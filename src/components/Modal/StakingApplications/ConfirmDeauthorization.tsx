import { FC } from "react"
import {
  BodyLg,
  Button,
  H5,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  List,
  ListItem,
  Image,
  Divider,
  HStack,
  BodySm,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import DeauthorizeAppIcon from "../../../static/images/deauthorize-tbtc.svg"
import shortenAddress from "../../../utils/shortenAddress"
import { formatTokenAmount } from "../../../utils/formatAmount"
import withBaseModal from "../withBaseModal"
import { StakingAppName } from "../../../store/staking-applications"
import { BaseModalProps } from "../../../types"

export type ConfirmDeauthorizationProps = BaseModalProps & {
  stakingProvider: string
  stakingAppName: StakingAppName
  decreaseAmount: string
}

const ConfirmDeauthorizationBase: FC<ConfirmDeauthorizationProps> = ({
  stakingProvider,
  stakingAppName,
  decreaseAmount,
  closeModal,
}) => {
  const onDeauthorize = () => {
    console.log("test")
  }

  return (
    <>
      <ModalHeader>Confirm Deauthorization</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" mb="6" mt="0">
          <H5>The cooldown period is complete.</H5>
          <BodyLg mt="4">Confirm your deauthorization.</BodyLg>
        </InfoBox>
        {/* TODO: Get the icon based on the `stakingAppName` prop. */}
        <Image src={DeauthorizeAppIcon} mb="6" mx="auto" />
        <Divider />
        <List spacing="2.5" my="6">
          <ListItem>
            <HStack justifyContent="space-between">
              <BodySm>Increase Amount</BodySm>
              <BodySm>{formatTokenAmount(decreaseAmount)} T</BodySm>
            </HStack>
          </ListItem>
          <ListItem>
            <HStack justifyContent="space-between">
              <BodySm>Provider Address</BodySm>
              <BodySm>{shortenAddress(stakingProvider)}</BodySm>
            </HStack>
          </ListItem>
        </List>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button mr={2} onClick={onDeauthorize}>
          Confirm Deauthorization
        </Button>
      </ModalFooter>
    </>
  )
}

export const ConfirmDeauthorization = withBaseModal(ConfirmDeauthorizationBase)
