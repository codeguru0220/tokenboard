import { createContext, FC, useContext, useEffect, useRef } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  getDefaultThresholdLibProvider,
  threshold,
} from "../utils/getThresholdLib"
import { supportedChainId } from "../utils/getEnvVariable"
import { MockBitcoinClient } from "../threshold-ts/tbtc/mock-bitcoin-client"

const ThresholdContext = createContext(threshold)

export const useThreshold = () => {
  return useContext(ThresholdContext)
}

export const ThresholdProvider: FC = ({ children }) => {
  const { library, active, account } = useWeb3React()
  const hasThresholdLibConfigBeenUpdated = useRef(false)

  useEffect(() => {
    if (active && library && account) {
      threshold.updateConfig({
        ethereum: {
          chainId: supportedChainId,
          providerOrSigner: library,
          account,
        },
        bitcoin: {
          client: new MockBitcoinClient(),
        },
      })
      hasThresholdLibConfigBeenUpdated.current = true
    }

    if (!active && !account && hasThresholdLibConfigBeenUpdated.current) {
      threshold.updateConfig({
        ethereum: {
          chainId: supportedChainId,
          providerOrSigner: getDefaultThresholdLibProvider(),
        },
        bitcoin: {
          client: new MockBitcoinClient(),
        },
      })
      hasThresholdLibConfigBeenUpdated.current = false
    }
  }, [library, active, account])

  return (
    <ThresholdContext.Provider value={threshold}>
      {children}
    </ThresholdContext.Provider>
  )
}
