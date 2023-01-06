import { FC, Ref, useRef } from "react"
import { FormikErrors, FormikProps, withFormik } from "formik"
import { Button, BodyMd, H5 } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { TbtcMintingCardTitle } from "../components/TbtcMintingCardTitle"
import { TbtcMintingCardSubTitle } from "../components/TbtcMintingCardSubtitle"
import { Form, FormikInput } from "../../../../components/Forms"
import {
  getErrorsObj,
  validateBTCAddress,
  validateETHAddress,
} from "../../../../utils/forms"
import { MintingStep } from "../../../../types/tbtc"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"
import { Network } from "bitcoin-address-validation"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { useWeb3React } from "@web3-react/core"

export interface FormValues {
  ethAddress: string
  btcRecoveryAddress: string
}

type ComponentProps = {
  formId: string
}

const MintingProcessFormBase: FC<ComponentProps & FormikProps<FormValues>> = ({
  formId,
}) => {
  return (
    <Form id={formId} mb={6}>
      <FormikInput
        name="ethAddress"
        label="ETH address"
        tooltip="ETH address is prepopulated with your wallet address. This is the address where you’ll receive your tBTC."
        mb={6}
      />
      <FormikInput
        name="btcRecoveryAddress"
        label="BTC Recovery Address"
        tooltip="Recovery Address is a BTC address where your BTC funds are sent back if something exceptional happens with your deposit. The funds can be claimed."
      />
    </Form>
  )
}

type MintingProcessFormProps = {
  initialEthAddress: string
  innerRef: Ref<FormikProps<FormValues>>
  onSubmitForm: (values: FormValues) => void
} & ComponentProps

const MintingProcessForm = withFormik<MintingProcessFormProps, FormValues>({
  mapPropsToValues: ({ initialEthAddress }) => ({
    ethAddress: initialEthAddress,
    btcRecoveryAddress: "tb1q0tpdjdu2r3r7tzwlhqy4e2276g2q6fexsz4j0m",
  }),
  validate: async (values) => {
    const errors: FormikErrors<FormValues> = {}
    errors.ethAddress = validateETHAddress(values.ethAddress)
    // TODO: check network
    errors.btcRecoveryAddress = validateBTCAddress(
      values.btcRecoveryAddress,
      Network.testnet
    )
    return getErrorsObj(errors)
  },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values)
  },
  displayName: "MintingProcessForm",
})(MintingProcessFormBase)

export const ProvideData: FC = () => {
  const { updateState, ethAddress, btcRecoveryAddress } = useTbtcState()
  const formRef = useRef<FormikProps<FormValues>>(null)
  const { openModal } = useModal()
  const threshold = useThreshold()
  const { account, active } = useWeb3React()

  if (!active || !account) {
    return <H5 align={"center"}>Wallet not connected</H5>
  }

  const onSubmit = async (values: FormValues) => {
    // check if the user has changed the eth or btc address from the previous attempt
    if (
      ethAddress !== values.ethAddress ||
      btcRecoveryAddress !== values.btcRecoveryAddress
    ) {
      // if so...
      const depositScriptParameters =
        await threshold.tbtc.createDepositScriptParameters(
          values.ethAddress,
          values.btcRecoveryAddress
        )

      const depositAddress = await threshold.tbtc.calculateDepositAddress(
        depositScriptParameters,
        "testnet"
      )

      // update state,
      updateState("btcRecoveryAddress", values.btcRecoveryAddress)
      updateState("ethAddress", values.ethAddress)

      // create a new deposit address,
      updateState("btcDepositAddress", depositAddress)
      updateState("blindingFactor", depositScriptParameters.blindingFactor)
      updateState("refundLocktime", depositScriptParameters.refundLocktime)
      // TODO: Either change the name in store to `wallePubKeyHash` or save
      // walletPublicKey here
      updateState(
        "walletPublicKey",
        depositScriptParameters.walletPublicKeyHash
      )

      // if the user has NOT declined the json file, ask the user if they want to accept the new file
      openModal(ModalType.TbtcRecoveryJson, {
        depositScriptParameters,
      })
    }

    // do not ask about JSON file again if the user has not changed anything because they have already accepted/declined the same json file
    updateState("mintingStep", MintingStep.Deposit)
  }

  return (
    <>
      <TbtcMintingCardTitle />
      <TbtcMintingCardSubTitle stepText="Step 1" subTitle="Provide Data" />
      <BodyMd color="gray.500" mb={12}>
        Based on these two addresses, the system will generate for you an unique
        BTC deposit address. There is no minting limit
      </BodyMd>
      <MintingProcessForm
        innerRef={formRef}
        formId="tbtc-minting-data-form"
        initialEthAddress={account}
        onSubmitForm={onSubmit}
      />
      <Button type="submit" form="tbtc-minting-data-form" isFullWidth>
        Generate Deposit Address
      </Button>
    </>
  )
}
