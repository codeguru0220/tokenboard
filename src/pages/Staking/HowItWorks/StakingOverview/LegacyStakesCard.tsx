import { ComponentProps, FC } from "react"
import { BodyMd, BoxLabel, Card, LabelSm } from "@threshold-network/components"
import { LegacyStakesDepositSteps } from "../../../../components/StakingChecklist"
import ViewInBlockExplorer from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"
import { StakeHowItWorksTab } from "../index"

export const LegacyStakesCard: FC<
  ComponentProps<typeof Card> & {
    tStakingContractAddress: string
    setTab: (tab: StakeHowItWorksTab) => void
  }
> = ({ tStakingContractAddress, setTab, ...props }) => {
  return (
    <Card {...props}>
      <LabelSm>legacy stakes</LabelSm>
      <BodyMd mt="5" mb="5">
        If you have an active stake on NuCypher or on Keep Network you can
        authorize the{" "}
        <ViewInBlockExplorer
          id={tStakingContractAddress}
          type={ExplorerDataType.ADDRESS}
          text="Threshold Staking Contract"
        />{" "}
        on the legacy dashboard.
      </BodyMd>
      <BoxLabel mb={6}>Staking Timeline</BoxLabel>
      <LegacyStakesDepositSteps setTab={setTab} />
    </Card>
  )
}
