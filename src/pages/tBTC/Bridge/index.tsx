import { useEffect } from "react"
import { Grid, Box, Skeleton, Stack } from "@threshold-network/components"
import { PageComponent } from "../../../types"
import { TbtcBalanceCard } from "./TbtcBalanceCard"
import { MintUnmintNav } from "./MintUnmintNav"
import { BridgeActivityCard, BridgeActivity } from "./BridgeActivity"
import { useModal } from "../../../hooks/useModal"
import { ModalType } from "../../../enums"
import { useTBTCTerms } from "../../../hooks/useTBTCTerms"
import { useAppDispatch, useAppSelector } from "../../../hooks/store"
import { selectBridgeActivity, tbtcSlice } from "../../../store/tbtc"
import { useWeb3React } from "@web3-react/core"
import { Outlet } from "react-router"
import { MintPage } from "./Mint"
import { UnmintPage } from "./Unmint"

const gridTemplateAreas = {
  base: `
    "main"
    "aside"
    `,
  xl: `"aside main"`,
}

const TBTCBridge: PageComponent = (props) => {
  const { openModal } = useModal()
  const { hasUserResponded } = useTBTCTerms()
  const dispatch = useAppDispatch()
  const bridgeActivity = useAppSelector(selectBridgeActivity)
  const isBridgeActivityFetching = useAppSelector(
    (state) => state.tbtc.bridgeActivity.isFetching
  )
  const { account } = useWeb3React()

  useEffect(() => {
    if (!hasUserResponded) openModal(ModalType.NewTBTCApp)
  }, [hasUserResponded])

  useEffect(() => {
    if (!account) return

    dispatch(
      tbtcSlice.actions.requestBridgeActivity({
        depositor: account,
      })
    )
  }, [dispatch, account])

  return (
    <Grid
      gridTemplateAreas={gridTemplateAreas}
      gridTemplateColumns={{ base: "1fr", xl: "25% 1fr" }}
      gap="5"
    >
      <Box gridArea="main" minW="0">
        <MintUnmintNav w="100%" gridArea="nav" mb="5" pages={props.pages!} />
        <Outlet />
      </Box>
      <Box gridArea="aside">
        <TbtcBalanceCard gridArea="balance-card" mb="5" />
        <BridgeActivityCard>
          {isBridgeActivityFetching ? (
            <Stack>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          ) : (
            <BridgeActivity data={bridgeActivity} />
          )}
        </BridgeActivityCard>
      </Box>
    </Grid>
  )
}

TBTCBridge.route = {
  path: "",
  index: false,
  pathOverride: "/tBTC/*",
  pages: [MintPage, UnmintPage],
  title: "Bridge",
  isPageEnabled: true,
}

export default TBTCBridge
