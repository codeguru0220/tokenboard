import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setMinStake } from "../store/staking"
import { useTStakingContract } from "../web3/hooks"
import { useStakingState } from "./useStakingState"

export const useMinStakeAmount = () => {
  const tStakingContract = useTStakingContract()
  const { minStakeAmount } = useStakingState()
  const dispatch = useDispatch()

  const [isLoading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const fetchMinStakeAmount = async () => {
      setLoading(true)
      try {
        const minStakeAmount = await tStakingContract?.minTStakeAmount()
        console.log("min loaded: " + minStakeAmount)
        dispatch(setMinStake({ amount: minStakeAmount.toString() }))
        setLoading(false)
        setHasError(false)
      } catch (error) {
        setLoading(false)
        setHasError(true)
        console.error("Could not fetch the min stake amount: ", error)
      }
    }
    if (minStakeAmount === "0" && tStakingContract) fetchMinStakeAmount()
  }, [tStakingContract, dispatch, minStakeAmount])

  return { minStakeAmount, isLoading, hasError }
}
