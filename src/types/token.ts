import { Token } from "../enums"

export interface ReduxTokenInfo {
  loading: boolean
  balance: number
  conversionRate: number
  text: string
  icon: any
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
    t: ReduxTokenInfo
    setTokenBalance: (token: Token, balance: number) => TokenActionTypes
    setTokenLoading: (token: Token, loading: boolean) => TokenActionTypes
  }
}
