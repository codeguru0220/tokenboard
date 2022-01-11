import { useCallback } from "react"
import { ContractTransaction } from "@ethersproject/contracts"
import { useSendTransaction } from "./useSendTransaction"
import { useTStakingContract } from "./useTStakingContract"
import { ModalType } from "../../enums"
import { useModal } from "../../hooks/useModal"

enum CommonStakingErrors {
  OperatorInUse = "Operator is already in use",
}

export const useStakeTransaction = (
  onSuccess: (tx: ContractTransaction) => void
) => {
  const stakingContract = useTStakingContract()
  const { openModal } = useModal()

  const onError = (error: any) => {
    if (error?.data?.message.includes(CommonStakingErrors.OperatorInUse)) {
      openModal(ModalType.TransactionFailed, {
        error: new Error(
          "This operator is already in use. Please resubmit with a different operator address."
        ),
      })
    } else {
      openModal(ModalType.TransactionFailed, {
        error,
        isExpandableError: true,
      })
    }
  }

  const { sendTransaction, status } = useSendTransaction(
    stakingContract!,
    "stake",
    onSuccess,
    onError
  )

  const stake = useCallback(
    async (...args) => {
      console.log("sending the transaction", args)
      await sendTransaction(...args)
    },
    [sendTransaction, stakingContract?.address]
  )

  return { stake, status }
}
