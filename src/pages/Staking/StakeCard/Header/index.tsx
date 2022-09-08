import { FC, useContext } from "react"
import { Badge, FilterTabs, Flex } from "@threshold-network/components"
import { StakeCardHeaderTitle } from "./HeaderTitle"
import { StakeData } from "../../../../types"
import { useStakeCardContext } from "../../../../hooks/useStakeCardContext"

export interface StakeCardHeaderProps {
  stake: StakeData | null
  onTabClick: () => void
}

const StakeCardHeader: FC<StakeCardHeaderProps> = ({ stake, onTabClick }) => {
  const { isInactiveStake } = useStakeCardContext()

  return (
    <Flex as="header" alignItems="center">
      <Badge
        colorScheme={isInactiveStake ? "gray" : "green"}
        variant="subtle"
        size="small"
        mr="2"
      >
        {isInactiveStake ? "inactive" : "active"}
      </Badge>
      <StakeCardHeaderTitle stake={stake} />
      <FilterTabs
        tabs={[
          { title: "Stake", tabId: "1" },
          { title: "Unstake", tabId: "2" },
        ]}
        selectedTabId="1"
        size="xs"
        variant="inline"
        onTabClick={onTabClick}
      />
    </Flex>
  )
}

export default StakeCardHeader
