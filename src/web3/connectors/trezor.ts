import { ConnectorUpdate } from "@web3-react/types"
import { AbstractConnector } from "@web3-react/abstract-connector"
import Web3ProviderEngine from "web3-provider-engine"
import { TrezorSubprovider } from "@0x/subproviders/lib/src/subproviders/trezor" // https://github.com/0xProject/0x-monorepo/issues/1400
// import CacheSubprovider from "web3-provider-engine/subproviders/cache.js"
import { RPCSubprovider } from "@0x/subproviders/lib/src/subproviders/rpc_subprovider" // https://github.com/0xProject/0x-monorepo/issues/1400
import { RPC_URL_HTTPS } from "../../config"

interface TrezorConnectorArguments {
  chainId: number
  url: string
  pollingInterval?: number
  requestTimeoutMs?: number
  config?: any
  manifestEmail: string
  manifestAppUrl: string
}

export class TrezorConnector extends AbstractConnector {
  defaultAccount = ""
  private readonly chainId: number
  private readonly url: string
  private readonly pollingInterval?: number
  private readonly requestTimeoutMs?: number
  private readonly config: any
  private readonly manifestEmail: string
  private readonly manifestAppUrl: string

  private provider: any

  constructor({
    chainId,
    url,
    pollingInterval,
    requestTimeoutMs,
    config = {},
    manifestEmail,
    manifestAppUrl,
  }: TrezorConnectorArguments) {
    super({ supportedChainIds: [chainId] })

    this.chainId = chainId
    this.url = url
    this.pollingInterval = pollingInterval
    this.requestTimeoutMs = requestTimeoutMs
    this.config = config
    this.manifestEmail = manifestEmail
    this.manifestAppUrl = manifestAppUrl
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!this.provider) {
      const TrezorConnect = await import("trezor-connect").then(
        (m) => m?.default ?? m
      )
      TrezorConnect.manifest({
        email: this.manifestEmail,
        appUrl: this.manifestAppUrl,
      })
      const engine = new Web3ProviderEngine({
        pollingInterval: this.pollingInterval,
      })
      engine.addProvider(
        new TrezorSubprovider({
          trezorConnectClientApi: TrezorConnect,
          ...this.config,
        })
      )
      // engine.addProvider(new CacheSubprovider())
      engine.addProvider(new RPCSubprovider(this.url, this.requestTimeoutMs))
      this.provider = engine
    }

    this.provider.start()

    return { provider: this.provider, chainId: this.chainId }
  }

  public async getProvider(): Promise<Web3ProviderEngine> {
    return this.provider
  }

  public async getChainId(): Promise<number> {
    return this.chainId
  }

  public async getAccount() {
    return null
  }

  public async getAccounts(
    numAccounts: number = 10,
    offsetIdx: number = 0
  ): Promise<string[]> {
    return this.provider._providers[0].getAccountsAsync(numAccounts, offsetIdx)
  }

  setDefaultAccount(account: string) {
    this.defaultAccount = account
  }

  public deactivate() {
    this.provider.stop()
  }
}

const TREZOR_POLLING_INTERVAL = 12000

const trezor = new TrezorConnector({
  chainId: 1,
  url: RPC_URL_HTTPS[1],
  pollingInterval: TREZOR_POLLING_INTERVAL,
  manifestEmail: "work@keep.network",
  manifestAppUrl: "https://keep.network",
})

export default trezor
