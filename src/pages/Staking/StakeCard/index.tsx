import { FC, useRef, useCallback, useContext } from "react"
import { FormikProps } from "formik"
import { BigNumber } from "@ethersproject/bignumber"
import {
  Card,
  LineDivider,
  Button,
  useBoolean,
} from "@threshold-network/components"
import { TokenAmountForm, FormValues } from "../../../components/Forms"
import { useTokenBalance } from "../../../hooks/useTokenBalance"
import { useModal } from "../../../hooks/useModal"
import { StakeData } from "../../../types/staking"
import {
  ExternalHref,
  ModalType,
  StakeType,
  Token,
  TopUpType,
  UnstakeType,
} from "../../../enums"
import { isAddressZero } from "../../../web3/utils"
import StakeApplications from "./StakeApplications"
import StakeCardHeader from "./Header"
import StakeRewards from "./StakeRewards"
import StakeBalance from "./StakeBalance"
import StakeAddressInfo from "./StakeAddressInfo"
import { featureFlags } from "../../../constants"
import { StakeCardContext } from "../../../contexts/StakeCardContext"
import { useStakeCardContext } from "../../../hooks/useStakeCardContext"

const StakeCardContainer: FC<{ stake: StakeData }> = ({ stake }) => {
  const isInactiveStake = BigNumber.from(stake.totalInTStake).isZero()
  const canTopUpKepp = BigNumber.from(stake.possibleKeepTopUpInT).gt(0)
  const canTopUpNu = BigNumber.from(stake.possibleNuTopUpInT).gt(0)
  const hasLegacyStakes = stake.nuInTStake !== "0" || stake.keepInTStake !== "0"
  const isPRESet =
    !isAddressZero(stake.preConfig.operator) &&
    stake.preConfig.isOperatorConfirmed

  return (
    <StakeCardContext.Provider
      value={{
        isInactiveStake,
        canTopUpKepp,
        canTopUpNu,
        hasLegacyStakes,
        isPRESet,
      }}
    >
      <StakeCard stake={stake} />
    </StakeCardContext.Provider>
  )
}

const StakeCard: FC<{ stake: StakeData }> = ({ stake }) => {
  const formRef = useRef<FormikProps<FormValues>>(null)
  const [isStakeAction, setFlag] = useBoolean(true)
  const tBalance = useTokenBalance(Token.T)
  const { openModal } = useModal()
  const { isInactiveStake, canTopUpKepp, canTopUpNu, isPRESet } =
    useStakeCardContext()

  const submitButtonText = !isStakeAction ? "Unstake" : "Top-up"

  const onTabClick = useCallback(() => {
    formRef.current?.resetForm()
    setFlag.toggle()
  }, [setFlag.toggle])

  const onSubmitTopUp = (
    tokenAmount: string | number,
    topUpType: TopUpType
  ) => {
    openModal(ModalType.TopupT, { stake, amountTopUp: tokenAmount, topUpType })
  }

  const onSubmitUnstakeOrTopupBtn = () => {
    if (isStakeAction) {
      openModal(ModalType.TopupLegacyStake, { stake })
    } else {
      openModal(ModalType.UnstakeT, { stake })
    }
  }

  const onSubmitForm = (tokenAmount: string | number) => {
    if (isStakeAction) {
      onSubmitTopUp(tokenAmount, TopUpType.NATIVE)
    } else {
      // We display the unstake form for stakes that only contains T liquid
      // stake in the `StakeCard` directly. So we can go straight to the step 2
      // of the unstaking flow and force the unstake type to `native`.
      openModal(ModalType.UnstakeTStep2, {
        stake,
        amountToUnstake: tokenAmount,
        unstakeType: UnstakeType.NATIVE,
      })
    }
  }

  return (
    <Card borderColor={isInactiveStake || !isPRESet ? "red.200" : undefined}>
      <StakeCardHeader stakeType={stake.stakeType} onTabClick={onTabClick} />
      <StakeRewards stakingProvider={stake.stakingProvider} />
      <LineDivider />
      {featureFlags.MULTI_APP_STAKING && (
        <>
          <StakeApplications stakingProvider={stake.stakingProvider} />
          <LineDivider mb="0" />
        </>
      )}
      <StakeBalance
        nuInTStake={stake.nuInTStake}
        keepInTStake={stake.keepInTStake}
        tStake={stake.tStake}
        totalInTStake={stake.totalInTStake}
      />
      <StakeAddressInfo stakingProvider={stake.stakingProvider} />
      {(canTopUpNu || canTopUpKepp) && isStakeAction ? (
        <Button
          onClick={() =>
            onSubmitTopUp(
              canTopUpNu
                ? stake.possibleNuTopUpInT
                : stake.possibleKeepTopUpInT,
              canTopUpNu ? TopUpType.LEGACY_NU : TopUpType.LEGACY_KEEP
            )
          }
          isFullWidth
        >
          Confirm Legacy Top-up
        </Button>
      ) : stake.stakeType === StakeType.T ? (
        <TokenAmountForm
          innerRef={formRef}
          onSubmitForm={onSubmitForm}
          label={`${isStakeAction ? "Stake" : "Unstake"} Amount`}
          submitButtonText={submitButtonText}
          maxTokenAmount={isStakeAction ? tBalance : stake.tStake}
          shouldDisplayMaxAmountInLabel
        />
      ) : (
        <Button onClick={onSubmitUnstakeOrTopupBtn} isFullWidth>
          {submitButtonText}
        </Button>
      )}
      {!isPRESet && (
        <Button as="a" mt="4" href={ExternalHref.preNodeSetup} isFullWidth>
          Set PRE
        </Button>
      )}
    </Card>
  )
}

export default StakeCardContainer
