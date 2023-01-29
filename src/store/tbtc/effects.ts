import { AppListenerEffectAPI } from "../listener"
import { tbtcSlice } from "./tbtcSlice"
import { isAddress, isAddressZero } from "../../web3/utils"
import { MintingStep } from "../../types/tbtc"
import { ONE_SEC_IN_MILISECONDS } from "../../utils/date"
import { TaskAbortError } from "@reduxjs/toolkit"

export const fetchBridgeTxHitoryEffect = async (
  action: ReturnType<typeof tbtcSlice.actions.requestBridgeTransactionHistory>,
  listenerApi: AppListenerEffectAPI
) => {
  const { depositor } = action.payload
  if (!isAddress(depositor) || isAddressZero(depositor)) return

  listenerApi.unsubscribe()

  listenerApi.dispatch(tbtcSlice.actions.fetchingBridgeTransactionHistory())

  try {
    const data = await listenerApi.extra.threshold.tbtc.bridgeTxHistory(
      depositor
    )
    listenerApi.dispatch(
      tbtcSlice.actions.bridgeTransactionHistoryFetched(data)
    )
  } catch (error) {
    console.error("Could not fetch bridge transaction history: ", error)
    listenerApi.subscribe()
    listenerApi.dispatch(
      tbtcSlice.actions.bridgeTransactionHistoryFailed({
        error: "Could not fetch bridge transaction history.",
      })
    )
  }
}

export const findUtxoEffect = async (
  action: ReturnType<typeof tbtcSlice.actions.findUtxo>,
  listenerApi: AppListenerEffectAPI
) => {
  const { btcDepositAddress } = action.payload

  if (!btcDepositAddress) return

  // Cancel any in-progress instances of this listener.
  listenerApi.cancelActiveListeners()

  const pollingTask = listenerApi.fork(async (forkApi) => {
    try {
      while (true) {
        // Looking for utxo.
        const utxos = await forkApi.pause(
          listenerApi.extra.threshold.tbtc.findAllUnspentTransactionOutputs(
            btcDepositAddress
          )
        )

        if (!utxos || utxos.length === 0) {
          // Bitcoin deposit address exists and there is no utxo for a given
          // deposit address- this means someone wants to use this deposit
          // address to mint tBTC. Redirect to step 2 and continue searching for
          // utxo.

          listenerApi.dispatch(
            tbtcSlice.actions.updateState({
              key: "mintingStep",
              value: MintingStep.Deposit,
            })
          )
          await forkApi.delay(10 * ONE_SEC_IN_MILISECONDS)
          continue
        }

        // UTXOs returned from `findAllUnspentTransactionOutputs` are in
        // reversed order so we have to get the last element of the `utxos`
        // array to get the oldest utxo related to this deposit address.
        const utxo = utxos.pop()!

        // Check if deposit is revealed.
        const deposit = await forkApi.pause(
          listenerApi.extra.threshold.tbtc.getRevealedDeposit(utxo)
        )

        const isDepositRevealed = deposit.revealedAt !== 0

        if (isDepositRevealed) {
          // Deposit already revealed, force start from step 1 and remove deposit data.
          // TODO: Remove deposit data.
          listenerApi.dispatch(
            tbtcSlice.actions.updateState({
              key: "mintingStep",
              value: MintingStep.ProvideData,
            })
          )
        } else {
          // UTXO exists for a given Bitcoin deposit address and deposit is not
          // yet revealed. Redirect to step 3 to reveal the deposit and set
          // utxo.
          listenerApi.dispatch(
            tbtcSlice.actions.updateState({
              key: "mintingStep",
              value: MintingStep.InitiateMinting,
            })
          )
          listenerApi.dispatch(
            tbtcSlice.actions.updateState({ key: "utxo", value: utxo })
          )
        }
      }
    } catch (err) {
      if (!(err instanceof TaskAbortError)) {
        console.error(`Failed to fetch utxo for ${btcDepositAddress}.`, err)
      }
    }
  })

  await listenerApi.condition((action) => {
    if (!tbtcSlice.actions.updateState.match(action)) return false

    const { key, value } = (
      action as ReturnType<typeof tbtcSlice.actions.updateState>
    ).payload
    return key === "mintingStep" && value !== MintingStep.Deposit
  })

  // Stop polling task.
  pollingTask.cancel()
}
