import {
  Client,
  UnspentTransactionOutput,
} from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"
import { BitcoinNetwork } from "@keep-network/tbtc-v2.ts/dist/src/bitcoin-network"
import {
  ClientOptions,
  Credentials,
} from "@keep-network/tbtc-v2.ts/dist/src/electrum"
import { providers, Signer } from "ethers"
import { BitcoinClient } from "tbtc-sdk-v2"

export interface EthereumConfig {
  providerOrSigner: providers.Provider | Signer
  chainId: string | number
  account?: string
}

export type BitcoinClientCredentials = Credentials

export type BitcoinClientOptions = ClientOptions

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
  client?: BitcoinClient | Client
  // TODO: Remove deprecated `Client` fallback when the migration will be fully completed

  /**
   * Credentials for electrum client
   */
  credentials?: BitcoinClientCredentials[]

  /**
   * Additional options that can be passed to bitcoin client
   */
  clientOptions?: BitcoinClientOptions
}

export interface ThresholdConfig {
  ethereum: EthereumConfig
  bitcoin: BitcoinConfig
}

export { BitcoinNetwork }

export type UnspentTransactionOutputPlainObject = {
  [key in keyof UnspentTransactionOutput]: string
}
