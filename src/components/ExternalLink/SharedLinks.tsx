import { FC, ComponentProps } from "react"
import { useColorModeValue } from "@chakra-ui/react"
import { Body3 } from "../Typography"
import ViewInBlockExplorer from "../ViewInBlockExplorer"
import { useTStakingContract } from "../../web3/hooks"
import { ExplorerDataType } from "../../utils/createEtherscanLink"
import { ExternalHref } from "../../enums"
import ExternalLink from "."

type StakingContractLearnMoreProps = ComponentProps<typeof Body3>

export const StakingContractLearnMore: FC<StakingContractLearnMoreProps> = (
  props
) => {
  const tStakingContract = useTStakingContract()
  const color = useColorModeValue("gray.500", "gray.300")

  if (tStakingContract?.address) {
    return (
      <Body3 color={color} textAlign="center" {...props}>
        Read more about the&nbsp;
        <ViewInBlockExplorer
          id={tStakingContract.address}
          type={ExplorerDataType.ADDRESS}
          text="staking contract."
        />
      </Body3>
    )
  }

  return null
}

type StakingBonusReadMoreProps = ComponentProps<typeof Body3>

export const StakingBonusReadMore: FC<StakingBonusReadMoreProps> = (props) => {
  return (
    <Body3 mt="16" textAlign="center" {...props}>
      Read more about the{" "}
      <ExternalLink
        href={ExternalHref.stakingBonusDocs}
        text="Staking Bonus."
      />
    </Body3>
  )
}