import { FC, useEffect } from "react"
import {
  BodyLg,
  BodySm,
  Button,
  H5,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { Skeleton } from "@chakra-ui/react"
import TransactionDetailsTable from "../../../pages/tBTC/Bridge/components/TransactionDetailsTable"
import { MintingStep } from "../../../types/tbtc"
import { useThreshold } from "../../../contexts/ThresholdContext"
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/src/deposit"
import {
  decodeBitcoinAddress,
  UnspentTransactionOutput,
} from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"
import {
  RevealDepositSuccessTx,
  useRevealMultipleDepositsTransaction,
} from "../../../hooks/tbtc"
import { BigNumber } from "ethers"
import { formatTokenAmount } from "../../../utils/formatAmount"
import { getChainIdentifier } from "../../../threshold-ts/utils"

export interface TbtcMintingConfirmationModalProps extends BaseModalProps {
  utxos: UnspentTransactionOutput[]
}

const TbtcMintingConfirmationModal: FC<TbtcMintingConfirmationModalProps> = ({
  utxos,
  closeModal,
}) => {
  const {
    updateState,
    tBTCMintAmount,
    btcRecoveryAddress,
    ethAddress,
    refundLocktime,
    walletPublicKeyHash,
    blindingFactor,
    mintingFee,
    thresholdNetworkFee,
  } = useTbtcState()
  const threshold = useThreshold()

  const onSuccessfulDepositReveal = (txs: RevealDepositSuccessTx[]) => {
    updateState("mintingStep", MintingStep.MintingSuccess)
    closeModal()
  }

  const { revealMultipleDeposits } = useRevealMultipleDepositsTransaction(
    onSuccessfulDepositReveal
  )

  const initiateMintTransaction = async () => {
    const depositScriptParameters: DepositScriptParameters = {
      depositor: getChainIdentifier(ethAddress),
      blindingFactor,
      walletPublicKeyHash: walletPublicKeyHash,
      refundPublicKeyHash: decodeBitcoinAddress(btcRecoveryAddress),
      refundLocktime,
    }

    const successfulTransactions = await revealMultipleDeposits(
      utxos,
      depositScriptParameters
    )
  }
  // TODO: Pass only one utxo as a prop and amount should be `utxo.value`
  const amount = utxos
    .reduce(
      (accumulator, currentValue) =>
        BigNumber.from(accumulator).add(currentValue.value),
      BigNumber.from(0)
    )
    .toString()

  useEffect(() => {
    const getEstimatedFees = async () => {
      const { treasuryFee, optimisticMintFee, amountToMint } =
        await threshold.tbtc.getEstimatedFees(amount)

      updateState("mintingFee", optimisticMintFee)
      updateState("thresholdNetworkFee", treasuryFee)
      updateState("tBTCMintAmount", amountToMint)
    }

    getEstimatedFees()
  }, [amount, updateState, threshold])

  return (
    <>
      <ModalHeader>Initiate minting tBTC</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" mb="6">
          <H5 mb={4}>
            You will initiate the minting of{" "}
            <Skeleton
              isLoaded={!!tBTCMintAmount}
              w={!tBTCMintAmount ? "105px" : undefined}
              display="inline-block"
            >
              {!!tBTCMintAmount ? formatTokenAmount(tBTCMintAmount) : "0"}
            </Skeleton>{" "}
            tBTC
          </H5>
          <BodyLg>
            Minting tBTC is a process that requires one transaction.
          </BodyLg>
        </InfoBox>
        <TransactionDetailsTable />
        <BodySm textAlign="center" mt="16">
          Read more about the&nbsp;
          <ViewInBlockExplorer
            id="NEED BRIDGE CONTRACT ADDRESS"
            type={ExplorerDataType.ADDRESS}
            text="bridge contract."
          />
        </BodySm>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button
          disabled={!tBTCMintAmount || !mintingFee || !thresholdNetworkFee}
          onClick={initiateMintTransaction}
        >
          Start minting
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TbtcMintingConfirmationModal)
