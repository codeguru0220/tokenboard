import { FC, useEffect, useRef, useState } from "react"
import {
  AlertBox,
  AlertIcon,
  BodyLg,
  BodyXs,
  Box,
  Button,
  H5,
  LabelSm,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@threshold-network/components"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import InfoBox from "../../InfoBox"
import MapOperatorToStakingProviderForm, {
  MapOperatorToStakingProviderFormValues,
} from "./MapOperatorToStakingProviderForm"
import { FormikProps } from "formik"
import { ModalType } from "../../../enums"
import { useModal } from "../../../hooks/useModal"
import StakeAddressInfo from "../../../pages/Staking/StakeCard/StakeAddressInfo"
import { useWeb3React } from "@web3-react/core"
import { useThreshold } from "../../../contexts/ThresholdContext"
import {
  isAddressZero,
  isSameETHAddress,
  AddressZero,
} from "../../../web3/utils"

export interface MapOperatorToStakingProviderModalProps {
  mappedOperatorTbtc: string
  mappedOperatorRandomBeacon: string
}

const MapOperatorToStakingProviderModal: FC<
  BaseModalProps & MapOperatorToStakingProviderModalProps
> = ({ mappedOperatorTbtc, mappedOperatorRandomBeacon }) => {
  const { account } = useWeb3React()
  const formRef =
    useRef<FormikProps<MapOperatorToStakingProviderFormValues>>(null)
  const { closeModal, openModal } = useModal()
  const threshold = useThreshold()

  const isOperatorMappedOnlyInTbtc =
    !isAddressZero(mappedOperatorTbtc) &&
    isAddressZero(mappedOperatorRandomBeacon)

  const isOperatorMappedOnlyInRandomBeacon =
    isAddressZero(mappedOperatorTbtc) &&
    !isAddressZero(mappedOperatorRandomBeacon)

  const onSubmit = async ({
    operator,
  }: MapOperatorToStakingProviderFormValues) => {
    if (account) {
      openModal(ModalType.MapOperatorToStakingProviderConfirmation, {
        operator,
        mappedOperatorTbtc,
        mappedOperatorRandomBeacon,
      })
    }
  }

  const checkIfOperatorIsMappedToAnotherStakingProvider: (
    operator: string
  ) => Promise<boolean> = async (operator: string) => {
    const stakingProviderMappedEcdsa =
      await threshold.multiAppStaking.ecdsa.operatorToStakingProvider(operator)
    const stakingProviderMappedRandomBeacon =
      await threshold.multiAppStaking.randomBeacon.operatorToStakingProvider(
        operator
      )

    return (
      (!isAddressZero(stakingProviderMappedEcdsa) &&
        !isSameETHAddress(stakingProviderMappedEcdsa, account!)) ||
      (!isAddressZero(stakingProviderMappedRandomBeacon) &&
        !isSameETHAddress(stakingProviderMappedRandomBeacon, account!))
    )
  }

  return (
    <>
      <ModalHeader>Operator Address Mapping</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal">
          {isOperatorMappedOnlyInRandomBeacon || isOperatorMappedOnlyInTbtc ? (
            <H5>
              We noticed you've only mapped 1 application's Operator Address.
            </H5>
          ) : (
            <H5>
              We’ve noticed your wallet address is the same with your Provider
              Address
            </H5>
          )}
          <BodyLg mt="4">
            Would you like to map your Operator Address? Mapping an Operator
            Address will require one transaction per application.
          </BodyLg>
        </InfoBox>
        <BodyLg mt={"10"}>
          Choose an application to map the Operator Address:
        </BodyLg>
        <Box
          p={"24px"}
          border={"1px solid"}
          borderColor={"gray.100"}
          borderRadius={"12px"}
          mt={"5"}
          mb={"5"}
        >
          {isOperatorMappedOnlyInRandomBeacon ? (
            <LabelSm>tbtc app</LabelSm>
          ) : isOperatorMappedOnlyInTbtc ? (
            <LabelSm>random beacon app</LabelSm>
          ) : (
            <LabelSm>TBTC + Random Beacon apps (requires 2txs)</LabelSm>
          )}
          <StakeAddressInfo stakingProvider={account ? account : AddressZero} />
          <MapOperatorToStakingProviderForm
            innerRef={formRef}
            formId="map-operator-to-staking-provider-form"
            initialAddress={
              isOperatorMappedOnlyInRandomBeacon
                ? mappedOperatorRandomBeacon
                : isOperatorMappedOnlyInTbtc
                ? mappedOperatorTbtc
                : ""
            }
            onSubmitForm={onSubmit}
            checkIfOperatorIsMappedToAnotherStakingProvider={
              checkIfOperatorIsMappedToAnotherStakingProvider
            }
            mappedOperatorTbtc={mappedOperatorTbtc}
            mappedOperatorRandomBeacon={mappedOperatorRandomBeacon}
          />
        </Box>
        <AlertBox
          status="warning"
          withIcon={false}
          alignItems="center"
          p={"8px 10px"}
        >
          <AlertIcon h={"14px"} as={"div"} alignSelf="auto" />
          <BodyXs>
            Take note! tBTC + Random Beacon Apps Rewards Bundle will require two
            transactions, one transaction per application.
          </BodyXs>
        </AlertBox>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Dismiss
        </Button>
        <Button type="submit" form="map-operator-to-staking-provider-form">
          Map Address
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(MapOperatorToStakingProviderModal)
