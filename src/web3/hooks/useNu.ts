import NuCypherToken from "@threshold-network/solidity-contracts/artifacts/NuCypherToken.json"
import { Contract } from "@ethersproject/contracts"
// import { useWeb3React } from "@web3-react/core"
import { useErc20TokenContract } from "./useERC20"
import { Token } from "../../enums"
import { TransactionType } from "../../enums/transactionType"

// TODO grab these from env?
const NU_MAINNET = "0x4fe83213d56308330ec302a8bd641f1d0113a4cc"
const NU_GOERLI = "0x02B50E38E5872068F325B1A7ca94D90ce2bfff63"
const NU_RINKEBY = "0x78D591D90a4a768B9D2790deA465D472b6Fe0f18"

export interface UseNu {
  (): {
    approveNu: () => void
    fetchNuBalance: () => void
    contract: Contract | null
  }
}

export const useNu: UseNu = () => {
  // const { chainId } = useWeb3React()
  const { balanceOf, approve, contract } = useErc20TokenContract(
    NuCypherToken.address,
    undefined,
    NuCypherToken.abi
  )

  const approveNu = () => {
    approve(TransactionType.ApproveNu)
  }

  const fetchNuBalance = () => {
    balanceOf(Token.Nu)
  }

  return {
    fetchNuBalance,
    approveNu,
    contract,
  }
}