import TBTCVault from "@keep-network/tbtc-v2/artifacts/TBTCVault.json"
import Bridge from "@keep-network/tbtc-v2/artifacts/Bridge.json"
import TBTCToken from "@keep-network/tbtc-v2/artifacts/TBTC.json"
import { Contract, providers } from "ethers"
import { Client } from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"
import { IMulticall } from "../../multicall"
import { AddressZero } from "@ethersproject/constants"
import { getContract, getProviderOrSigner } from "../../utils"
import { ITBTC, TBTC } from ".."
import { BitcoinConfig, BitcoinNetwork, EthereumConfig } from "../../types"
import { Bridge as ChainBridge } from "@keep-network/tbtc-v2.ts/dist/src/chain"
import { MockBitcoinClient } from "../../../tbtc/mock-bitcoin-client"
import { ElectrumClient, EthereumBridge } from "@keep-network/tbtc-v2.ts"

jest.mock("@keep-network/tbtc-v2/artifacts/TBTCVault.json", () => ({
  address: "0x1e742E11389e5590a1a0c8e59a119Be5F73BFdf6",
  abi: [],
}))

jest.mock("@keep-network/tbtc-v2/artifacts/Bridge.json", () => ({
  address: "0xF0d5D8312d8B3fd5b580DC46A8154c45aAaF47D2",
  abi: [],
}))

jest.mock("@keep-network/tbtc-v2/artifacts/TBTC.json", () => ({
  address: "0x5db5A1382234E2447E66CEB2Ee366a3e7a313Acf",
  abi: [],
}))

jest.mock("@keep-network/tbtc-v2.ts", () => ({
  EthereumAddress: jest.fn(),
}))

jest.mock("@keep-network/tbtc-v2.ts/dist/src/deposit", () => ({
  calculateDepositAddress: jest.fn(),
  calculateDepositRefundLocktime: jest.fn(),
  DepositScriptParameters: jest.fn(),
  revealDeposit: jest.fn(),
  getRevealedDeposit: jest.fn(),
}))

jest.mock("../../utils", () => ({
  ...(jest.requireActual("../../utils") as {}),
  getContract: jest.fn(),
  getContractPastEvents: jest.fn(),
  getChainIdentifier: jest.fn(),
  getProviderOrSigner: jest.fn(),
}))

// jest.mock("../../../tbtc/mock-bitcoin-client")

jest.mock("@keep-network/tbtc-v2.ts/dist/src", () => ({
  EthereumBridge: jest.fn(),
  ElectrumClient: jest.fn(),
}))

describe("TBTC test", () => {
  let tBTC: ITBTC

  let bridge: ChainBridge
  let tbtcVault: Contract
  let bitcoinClient: Client
  let multicall: IMulticall
  let bridgeContract: Contract
  let token: Contract

  const mockTBTCVaultContract = {
    interface: {},
    address: TBTCVault.address,
  }

  const mockBridgeContract = {
    interface: {},
    address: Bridge.address,
  }

  const mockTokenContract = {
    interface: {},
    address: TBTCToken.address,
  }

  const mockedEthereumProvider = {} as providers.Provider
  const ethConfig: EthereumConfig = {
    providerOrSigner: mockedEthereumProvider,
    chainId: 1,
    account: AddressZero,
  }

  const btcConfig: BitcoinConfig = {
    network: BitcoinNetwork.testnet,
    client: new MockBitcoinClient(),
  }

  describe("with mocked bitcoin client", () => {
    beforeEach(() => {
      ;(getContract as jest.Mock)
        .mockImplementationOnce(() => mockTBTCVaultContract)
        .mockImplementationOnce(() => mockBridgeContract)
        .mockImplementationOnce(() => mockTokenContract)
      ;(EthereumBridge as unknown as jest.Mock).mockImplementationOnce(
        () => bridge
      )
      multicall = {
        aggregate: jest.fn(),
        getCurrentBlockTimestampCallObj: jest.fn(),
      }
      bridge = {
        getDepositRevealedEvents: jest.fn(),
        submitDepositSweepProof: jest.fn(),
        revealDeposit: jest.fn(),
        deposits: jest.fn(),
        requestRedemption: jest.fn(),
        submitRedemptionProof: jest.fn(),
        txProofDifficultyFactor: jest.fn(),
        pendingRedemptions: jest.fn(),
        timedOutRedemptions: jest.fn(),
        activeWalletPublicKey: jest.fn(),
      } as ChainBridge

      tBTC = new TBTC(ethConfig, btcConfig, multicall)
    })

    test("should create TBTC instance correctly with mocked Bitcoin client", () => {
      expect(getContract).toHaveBeenCalledWith(
        TBTCVault.address,
        TBTCVault.abi,
        ethConfig.providerOrSigner,
        ethConfig.account
      )
      expect(getContract).toHaveBeenCalledWith(
        Bridge.address,
        Bridge.abi,
        ethConfig.providerOrSigner,
        ethConfig.account
      )
      expect(getContract).toHaveBeenCalledWith(
        TBTCToken.address,
        TBTCToken.abi,
        ethConfig.providerOrSigner,
        ethConfig.account
      )
      expect(EthereumBridge).toHaveBeenCalledWith({
        address: Bridge.address,
        signerOrProvider: getProviderOrSigner(
          ethConfig.providerOrSigner as any,
          ethConfig.account
        ),
      })

      expect(tBTC.vaultContract).toBe(mockTBTCVaultContract)
      expect(tBTC.bridgeContract).toBe(mockBridgeContract)
      expect(tBTC.tokenContract).toBe(mockTokenContract)
      expect(tBTC.bitcoinNetwork).toBe(BitcoinNetwork.testnet)

      expect(ElectrumClient).not.toBeCalled()
    })
  })
})
