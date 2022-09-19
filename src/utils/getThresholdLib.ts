import { JsonRpcProvider, Provider } from "@ethersproject/providers"
import { Signer } from "ethers"
import { Threshold } from "../threshold-ts"
import { EnvVariable } from "../enums"
import { getEnvVariable, supportedChainId } from "../utils/getEnvVariable"

export const getDefaultThresholdLibProvider = () => {
  return new JsonRpcProvider(getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP))
}

export const getThresholdLib = (providerOrSigner?: Provider | Signer) => {
  return new Threshold({
    ethereum: {
      chainId: supportedChainId,
      providerOrSigner: providerOrSigner || getDefaultThresholdLibProvider(),
    },
  })
}

export const threshold = getThresholdLib(
  new JsonRpcProvider(getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP))
)
