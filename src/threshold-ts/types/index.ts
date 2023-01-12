import { Client } from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import { Credentials } from "@keep-network/tbtc-v2.ts/dist/electrum"
import { providers, Signer } from "ethers"

export enum BitcoinNetwork {
  mainnet = "mainnet",
  testnet = "testnet",
}

export interface EthereumConfig {
  providerOrSigner: providers.Provider | Signer
  chainId: string | number
  account?: string
}

export type BitcoinClientCredentials = Credentials

export interface BitcoinConfig {
  /**
   * Indicates for which network the addresses (eg deposit address) should be
   * encoded for. Also is used to validate the user input on the dapp.
   * For example "mainnet" or "testnet"
   */
  network: BitcoinNetwork

  /**
   * If we want to mock client then we should pass the mock here
   */
  client?: Client

  /**
   * Credentials for electrum client
   */
  credentials?: BitcoinClientCredentials
}

export interface ThresholdConfig {
  ethereum: EthereumConfig
  bitcoin: BitcoinConfig
}
