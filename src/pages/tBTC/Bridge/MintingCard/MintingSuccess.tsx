import { FC, useEffect, useState } from "react"
import {
  BodyLg,
  BodySm,
  Box,
  Button,
  HStack,
  Image,
  Progress,
  Skeleton,
  Stack,
  Text,
} from "@threshold-network/components"
import { TbtcMintingCardTitle } from "../components/TbtcMintingCardTitle"
import { TbtcMintingCardSubTitle } from "../components/TbtcMintingCardSubtitle"
import InfoBox from "../../../../components/InfoBox"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import ViewInBlockExplorer from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"
import tbtcSuccess from "../../../../static/images/tbtc-success.png"
import TransactionDetailsTable from "../components/TransactionDetailsTable"
import { useTBTCTokenAddress } from "../../../../hooks/useTBTCTokenAddress"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { InlineTokenBalance } from "../../../../components/TokenBalance"
import { useAppDispatch } from "../../../../hooks/store"
import { tbtcSlice } from "../../../../store/tbtc"
import { UnspentTransactionOutput } from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"
import { CheckCircleIcon } from "@chakra-ui/icons"
import { useThreshold } from "../../../../contexts/ThresholdContext"

const MintingSuccessComponent: FC<{
  utxo: UnspentTransactionOutput
  onPreviousStepClick: (previosuStep: MintingStep) => void
}> = ({ utxo, onPreviousStepClick }) => {
  const { tBTCMintAmount, txConfirmations } = useTbtcState()
  const dispatch = useAppDispatch()
  const threshold = useThreshold()
  const [minConfirmationsNeeded, setMinConfirmationsNeeded] = useState<
    number | undefined
  >(undefined)

  const tbtcTokenAddress = useTBTCTokenAddress()

  const onDismissButtonClick = () => {
    onPreviousStepClick(MintingStep.ProvideData)
  }

  const transactionHash = utxo.transactionHash.toString()
  const value = utxo.value.toString()

  useEffect(() => {
    dispatch(
      tbtcSlice.actions.fetchUtxoConfirmations({
        utxo: { transactionHash, value },
      })
    )
  }, [dispatch, transactionHash, value])

  useEffect(() => {
    const minConfrimations = threshold.tbtc.minimumNumberOfConfirmationsNeeded(
      utxo.value
    )
    setMinConfirmationsNeeded(minConfrimations)
  }, [utxo.value])

  const checkmarkColor =
    txConfirmations &&
    minConfirmationsNeeded &&
    txConfirmations >= minConfirmationsNeeded
      ? "brand.500"
      : "gray.500"

  return (
    <>
      <TbtcMintingCardTitle
        previousStep={MintingStep.ProvideData}
        onPreviousStepClick={onPreviousStepClick}
      />
      <TbtcMintingCardSubTitle
        stepText="Success"
        subTitle="Your tBTC is on its way!"
      />
      <InfoBox>
        <Image src={tbtcSuccess} />
      </InfoBox>
      <Stack my={2}>
        <Skeleton
          isLoaded={
            txConfirmations !== undefined &&
            minConfirmationsNeeded !== undefined
          }
        >
          <Progress
            h="2"
            borderRadius="md"
            colorScheme="brand"
            value={
              txConfirmations >= minConfirmationsNeeded!
                ? 100
                : (txConfirmations / minConfirmationsNeeded!) * 100
            }
          />
        </Skeleton>
        <HStack mt={1} alignSelf="flex-end">
          <CheckCircleIcon w={4} h={4} color={checkmarkColor} />{" "}
          <BodySm color={"gray.500"}>
            <Skeleton
              isLoaded={
                txConfirmations !== undefined &&
                minConfirmationsNeeded !== undefined
              }
              display="inline-block"
            >
              {txConfirmations > minConfirmationsNeeded!
                ? minConfirmationsNeeded
                : txConfirmations}
              {"/"}
              {minConfirmationsNeeded}
            </Skeleton>
            {"  Bitcoin Network Confirmations"}
          </BodySm>
        </HStack>
      </Stack>

      <Stack spacing={4} mb={8}>
        <BodyLg>
          You should receive{" "}
          <InlineTokenBalance
            tokenAmount={tBTCMintAmount}
            withSymbol
            tokenSymbol="tBTC"
          />{" "}
          in around{" "}
          <Box as="span" color="brand.500">
            1-3 hours
          </Box>
          .
        </BodyLg>
        <BodySm>
          Add the tBTC{" "}
          <ViewInBlockExplorer
            id={tbtcTokenAddress}
            type={ExplorerDataType.ADDRESS}
            text="token address"
          />{" "}
          to your Ethererum wallet.
          <Text>
            The tBTC minting process will start only after 6 Bitcoin Network
            confirmations.
          </Text>
        </BodySm>
      </Stack>
      <TransactionDetailsTable />

      <Button onClick={onDismissButtonClick} isFullWidth mb={6} mt="10">
        New Mint
      </Button>
    </>
  )
}

export const MintingSuccess = withOnlyConnectedWallet(MintingSuccessComponent)
