import React, { createContext } from "react"
import { useWeb3React } from "@web3-react/core"
import { useKeep } from "../web3/hooks/useKeep"

const TokenContext = createContext({})

// Context that handles token data fetching when a user connects their wallet
export const TokenContextProvider: React.FC = ({ children }) => {
  const { fetchBalance: fetchKeepBalance } = useKeep()
  const { active, account } = useWeb3React()

  React.useEffect(() => {
    if (active && account) {
      fetchKeepBalance()
    }
  }, [active])

  return <TokenContext.Provider value={{}}>{children}</TokenContext.Provider>
}
