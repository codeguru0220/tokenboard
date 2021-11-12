import { Token } from "../enums"
import { TransactionType } from "../enums/transactionType"

export interface ReduxTokenInfo {
  loading: boolean
  balance: number
  usdConversion: number
  usdBalance: string
}

export interface SetTokenBalanceActionPayload {
  token: Token
  balance: number
}

export interface SetTokenLoadingActionPayload {
  token: Token
  loading: boolean
}

export interface SetTokenBalance {
  payload: SetTokenBalanceActionPayload
}

export interface SetTokenLoading {
  payload: SetTokenLoadingActionPayload
}

export type TokenActionTypes = SetTokenBalance | SetTokenLoading

export interface UseReduxToken {
  (): {
    keep: ReduxTokenInfo
    nu: ReduxTokenInfo
    setTokenBalance: (token: Token, balance: number) => TokenActionTypes
    setTokenLoading: (token: Token, loading: boolean) => TokenActionTypes
    fetchTokenPriceUSD: (token: Token) => void
  }
}

export interface BalanceOf {
  (token: Token): Promise<void>
}

export interface Approve {
  (transactionType: TransactionType): any
}

export interface UseErc20Interface {
  (tokenAddress: string, withSignerIfPossible?: boolean): {
    approve: Approve
    balanceOf: BalanceOf
  }
}
