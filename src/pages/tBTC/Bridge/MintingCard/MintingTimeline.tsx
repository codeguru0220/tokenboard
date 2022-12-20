import { FC } from "react"
import { LabelSm, Box, Badge, Icon } from "@threshold-network/components"
import { IoTime as TimeIcon } from "react-icons/all"
import TimelineItem from "../components/TimelineItem"
import tbtcMintingStep1 from "../../../../static/images/tbtcMintingStep1.svg"
import tbtcMintingStep2 from "../../../../static/images/minting-step-2.svg"
import tbtcMintingStep3 from "../../../../static/images/minting-step-3.svg"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"

export const MintingTimelineStep1: FC<{
  isActive: boolean
  isComplete: boolean
}> = ({ isActive, isComplete }) => {
  return (
    <TimelineItem
      isActive={isActive}
      isComplete={isComplete}
      stepText="Step 1"
      helperLabelText="OFF-CHAIN"
      title="Provide Data"
      description="Provide an ETH address and a BTC Recovery address to generate an unique BTC deposit address."
      imageSrc={tbtcMintingStep1}
    />
  )
}

export const MintingTimelineStep2: FC<{
  isActive: boolean
  isComplete: boolean
}> = ({ isActive, isComplete }) => {
  return (
    <TimelineItem
      isActive={isActive}
      isComplete={isComplete}
      stepText="Step 2"
      helperLabelText="ACTION ON BITCOIN NETWORK"
      title="Make a BTC deposit"
      description="Send any amount of BTC to this unique BTC Deposit Address. The amount you send is the amount will be minted as tBTC."
      imageSrc={tbtcMintingStep2}
    />
  )
}

export const MintingTimelineStep3: FC<{
  isActive: boolean
  isComplete: boolean
}> = ({ isActive, isComplete }) => {
  return (
    <TimelineItem
      isActive={isActive}
      // we never render the complete state for this step
      isComplete={isComplete}
      stepText="Step 3"
      helperLabelText="ACTION ON ETHEREUM NETWORK"
      title="Initiate minting"
      description="Minting tBTC does not require you to wait for the Bitcoin confirmations. Sign an Ethereum transaction in your wallet and your tBTC will arrive in around 1 to 3 hours."
      imageSrc={tbtcMintingStep3}
    />
  )
}

export const MintingTimeline: FC = () => {
  const { mintingStep } = useTbtcState()
  return (
    <Box>
      <LabelSm mb={8}>Minting Timeline</LabelSm>
      <MintingTimelineStep1
        isActive={mintingStep === MintingStep.ProvideData}
        isComplete={
          mintingStep === MintingStep.Deposit ||
          mintingStep === MintingStep.InitiateMinting ||
          mintingStep === MintingStep.MintingSuccess
        }
      />
      <MintingTimelineStep2
        isActive={mintingStep === MintingStep.Deposit}
        isComplete={
          mintingStep === MintingStep.InitiateMinting ||
          mintingStep === MintingStep.MintingSuccess
        }
      />
      <MintingTimelineStep3
        isActive={
          mintingStep === MintingStep.InitiateMinting ||
          mintingStep === MintingStep.MintingSuccess
        }
        // we never render the complete state for this step
        isComplete={false}
      />
      <Badge size="sm" colorScheme="yellow" variant="solid">
        <Icon as={TimeIcon} alignSelf="center" /> ~1-3 hours minting time
      </Badge>
    </Box>
  )
}
