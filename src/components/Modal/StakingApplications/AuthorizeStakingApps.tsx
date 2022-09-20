import { FC } from "react"
import {
  BodyLg,
  Button,
  Card,
  H5,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  LabelSm,
  BodyMd,
  List,
  ListItem,
} from "@threshold-network/components"
import { CheckCircleIcon } from "@chakra-ui/icons"
import InfoBox from "../../InfoBox"
import TokenBalance from "../../TokenBalance"
import StakeAddressInfo from "../../../pages/Staking/StakeCard/StakeAddressInfo"
import withBaseModal from "../withBaseModal"
import {
  calculatePercenteage,
  formatPercentage,
} from "../../../utils/percentage"
import { BaseModalProps } from "../../../types"
import { useAuthorizeMultipleAppsTransaction } from "../../../hooks/staking-applications"

export type AuthorizeAppsProps = BaseModalProps & {
  stakingProvider: string
  totalInTStake: string
  applications: {
    appName: string
    address: string
    authorizationAmount: string
  }[]
}

const AuthorizeStakingAppsBase: FC<AuthorizeAppsProps> = ({
  stakingProvider,
  totalInTStake,
  applications,
  closeModal,
}) => {
  const { authorizeMultipleApps } = useAuthorizeMultipleAppsTransaction()
  const onAuthorize = async () => {
    await authorizeMultipleApps(
      applications.map((_) => ({
        address: _.address,
        amount: _.authorizationAmount,
      })),
      stakingProvider
    )
  }
  const numberOfApps = applications.length

  return (
    <>
      <ModalHeader>Authorize Apps</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" mb="6" mt="0">
          <H5>
            You are authorizing the Threshold Application
            {numberOfApps > 1 ? "s" : ""} to use your stake.
          </H5>
          <BodyLg mt="4">
            This will require {numberOfApps} transaction
            {numberOfApps > 1 ? "s" : ""}. You can adjust the authorization
            amount at any time.
          </BodyLg>
        </InfoBox>
        <List spacing="2.5">
          {applications.map((app) => (
            <ListItem key={app.appName}>
              <StakingApplicationToAuth
                {...app}
                stakingProvider={stakingProvider}
                totalInTStake={totalInTStake}
              />
            </ListItem>
          ))}
        </List>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Dismiss
        </Button>
        <Button mr={2} onClick={onAuthorize}>
          Authorize
        </Button>
      </ModalFooter>
    </>
  )
}

const StakingApplicationToAuth: FC<{
  appName: string
  authorizationAmount: string
  stakingProvider: string
  totalInTStake: string
}> = ({ appName, authorizationAmount, stakingProvider, totalInTStake }) => {
  const percentage = formatPercentage(
    calculatePercenteage(authorizationAmount, totalInTStake)
  )

  return (
    <Card>
      <LabelSm mb="4">
        <CheckCircleIcon color="green.500" verticalAlign="top" mr="2" />
        {appName} - {percentage}
      </LabelSm>
      <BodyMd mb="3">Authorization Amount</BodyMd>
      <TokenBalance tokenAmount={authorizationAmount} isLarge />
      <StakeAddressInfo stakingProvider={stakingProvider} mb="0" />
    </Card>
  )
}

export const AuthorizeStakingApps = withBaseModal(AuthorizeStakingAppsBase)
