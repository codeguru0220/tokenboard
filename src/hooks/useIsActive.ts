import { useWeb3React } from "@web3-react/core"
import { useCallback, useMemo } from "react"
import { useLedgerLiveApp } from "../contexts/LedgerLiveAppContext"
import { supportedChainId } from "../utils/getEnvVariable"
import { useIsEmbed } from "./useIsEmbed"

type UseIsActiveResult = {
  account: string | undefined
  chainId: number | undefined
  isActive: boolean
  deactivate: () => void
}

/**
 * Checks if eth wallet is connected to the dashboard. It works with normal
 * view in the website and also inside Ledger Live App.
 * @return {UseIsActiveResult} Account address and `isActive` boolean
 */
export const useIsActive = (): UseIsActiveResult => {
  const {
    active: _active,
    account: _account,
    chainId: _chainId,
    deactivate: _deactivate,
  } = useWeb3React()
  const { ethAccount, setEthAccount } = useLedgerLiveApp()
  const ledgerLiveAppEthAddress = ethAccount?.address || undefined
  const { isEmbed } = useIsEmbed()

  const isActive = useMemo(() => {
    if (isEmbed) {
      return !!ledgerLiveAppEthAddress
    }
    return !!_active && !!_account
  }, [ledgerLiveAppEthAddress, _active, _account, isEmbed])

  const deactivateLedgerLiveApp = useCallback(() => {
    setEthAccount(undefined)
  }, [setEthAccount])

  return {
    account: (isEmbed ? ledgerLiveAppEthAddress : _account) || undefined,
    chainId: isEmbed ? Number(supportedChainId) : _chainId,
    isActive,
    deactivate: isEmbed ? deactivateLedgerLiveApp : _deactivate,
  }
}
