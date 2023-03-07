import { JsonRpcProvider, Provider } from "@ethersproject/providers"
import { Signer } from "ethers"
import { Threshold } from "../threshold-ts"
import { ChainID, EnvVariable } from "../enums"
import { getEnvVariable, supportedChainId } from "../utils/getEnvVariable"
import { MockBitcoinClient } from "../tbtc/mock-bitcoin-client"
import {
  BitcoinConfig,
  BitcoinNetwork,
  BitcoinClientCredentials,
} from "../threshold-ts/types"

function getBitcoinConfig(): BitcoinConfig {
  const network =
    supportedChainId === ChainID.Ethereum.toString()
      ? BitcoinNetwork.Mainnet
      : BitcoinNetwork.Testnet

  const shouldMockBitcoinClient =
    getEnvVariable(EnvVariable.MOCK_BITCOIN_CLIENT) === "true"

  const credentials: BitcoinClientCredentials[] = [
    {
      host: getEnvVariable(EnvVariable.ELECTRUM_HOST),
      port: +getEnvVariable(EnvVariable.ELECTRUM_PORT),
      protocol: getEnvVariable(
        EnvVariable.ELECTRUM_PROTOCOL
      ) as BitcoinClientCredentials["protocol"],
    },
  ]

  return {
    client: shouldMockBitcoinClient ? new MockBitcoinClient() : undefined,
    network,
    credentials: !shouldMockBitcoinClient ? credentials : undefined,
  }
}

export const getDefaultThresholdLibProvider = () => {
  return new JsonRpcProvider(getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP))
}

export const getThresholdLib = (providerOrSigner?: Provider | Signer) => {
  return new Threshold({
    ethereum: {
      chainId: supportedChainId,
      providerOrSigner: providerOrSigner || getDefaultThresholdLibProvider(),
    },
    bitcoin: getBitcoinConfig(),
  })
}

export const threshold = getThresholdLib(
  new JsonRpcProvider(getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP))
)
