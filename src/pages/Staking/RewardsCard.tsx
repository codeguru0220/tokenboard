import { FC, useMemo } from "react"
import { Button, useColorModeValue } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import {
  BodyMd,
  BodyLg,
  H5,
  LabelSm,
  Card,
  HStack,
  Badge,
  useCountdown,
} from "@threshold-network/components"
import InfoBox from "../../components/InfoBox"
import { useModal } from "../../hooks/useModal"
import { ModalType } from "../../enums"
import { formatTokenAmount } from "../../utils/formatAmount"
import { BigNumber } from "ethers"
import { useNextRewardsDropDate } from "../../hooks/useNextRewardsDropDate"

const RewardsCard: FC<{
  totalRewardsBalance: string
  totalBonusBalance: string
}> = ({ totalRewardsBalance, totalBonusBalance }) => {
  const { active } = useWeb3React()
  const { openModal } = useModal()

  const dropTimestamp = useNextRewardsDropDate()
  const { days, hours, minutes, seconds } = useCountdown(dropTimestamp, true)
  const hasBonusRewards = BigNumber.from(totalBonusBalance).gt(0)
  const hasRewards = BigNumber.from(totalRewardsBalance).gt(0)

  const timerColor = useColorModeValue("brand.500", "brand.300")

  // TODO: Determine if we need the "h", "m" "s" qualifiers and update if needed or remove this comment
  const timerText = useMemo(() => {
    let t = ""
    if (days !== "00") t = `${t}${days} : `
    if (hours !== "00") t = `${t}${hours} : `
    if (minutes !== "00") t = `${t}${minutes} : `
    t = `${t}${seconds}`
    return t
  }, [days, hours, minutes, seconds])

  return (
    <Card>
      <LabelSm textTransform="uppercase">Rewards</LabelSm>
      <HStack mt="6">
        <BodyMd>Total Rewards</BodyMd>
        {hasBonusRewards ? (
          <Badge variant="magic" ml="auto !important">
            staking bonus
          </Badge>
        ) : (
          <BodyMd ml="auto !important">
            Next rewards emission:{" "}
            <BodyMd as="span" color={timerColor}>
              {timerText}
            </BodyMd>
          </BodyMd>
        )}
      </HStack>
      <InfoBox mt="2" direction="row" p={active ? 0 : 4} alignItems="center">
        {active ? (
          <>
            <H5
              flex="2"
              p="4"
              borderRight={hasBonusRewards ? "1px solid" : undefined}
              borderColor={hasBonusRewards ? "gray.300" : undefined}
            >
              {formatTokenAmount(totalRewardsBalance)}
              <BodyLg as="span"> T</BodyLg>
            </H5>
            {hasBonusRewards && (
              <BodyLg flex="1" p="4" textAlign="right">
                {formatTokenAmount(totalBonusBalance)} T
              </BodyLg>
            )}
          </>
        ) : (
          <BodyMd>
            Rewards are released at the end of each month and can be claimed
            retroactively for March and April.
          </BodyMd>
        )}
      </InfoBox>

      <Button
        mt="4"
        variant="outline"
        size="lg"
        disabled={!active || !hasRewards}
        isFullWidth
        onClick={() =>
          openModal(ModalType.ClaimingRewards, {
            totalRewardsAmount: totalRewardsBalance,
          })
        }
      >
        Claim All
      </Button>
    </Card>
  )
}

export default RewardsCard
