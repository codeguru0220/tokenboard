import { stakingApplicationsSlice, StakingAppName } from "./slice"
import { AppListenerEffectAPI } from "../listener"
import { selectStakingProviders, setStakes } from "../staking"
import {
  IApplication,
  StakingProviderAppInfo,
} from "../../threshold-ts/applications"

export const getSupportedAppsEffect = async (
  action: ReturnType<typeof stakingApplicationsSlice.actions.getSupportedApps>,
  listenerApi: AppListenerEffectAPI
) => {
  try {
    listenerApi.unsubscribe()
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.fetchingAppParameters({
        appName: "tbtc",
      })
    )
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.fetchingAppParameters({
        appName: "randomBeacon",
      })
    )
    const data =
      await listenerApi.extra.threshold.multiAppStaking.getSupportedAppsAuthParameters()
    // one-off listener
    const payload = {
      tbtc: {
        minimumAuthorization: data.tbtc.minimumAuthorization.toString(),

        authorizationDecreaseDelay:
          data.tbtc.authorizationDecreaseDelay.toString(),

        authorizationDecreaseChangePeriod:
          data.tbtc.authorizationDecreaseChangePeriod.toString(),
      },
      randomBeacon: {
        minimumAuthorization: data.randomBeacon.minimumAuthorization.toString(),

        authorizationDecreaseDelay:
          data.randomBeacon.authorizationDecreaseDelay.toString(),

        authorizationDecreaseChangePeriod:
          data.randomBeacon.authorizationDecreaseChangePeriod.toString(),
      },
    }
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.setAppParameters({
        appName: "randomBeacon",
        parameters: payload.randomBeacon,
      })
    )
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.setAppParameters({
        appName: "tbtc",
        parameters: payload.tbtc,
      })
    )
  } catch (error) {
    const errorMessage = (error as Error).toString()
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.setAppParametersError({
        appName: "randomBeacon",
        error: errorMessage,
      })
    )
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.setAppParametersError({
        appName: "tbtc",
        error: errorMessage,
      })
    )
    console.log("Could not fetch supported apps auth parameters", error)
    listenerApi.subscribe()
  }
}

export const getSupportedAppsStakingProvidersData = async (
  action: ReturnType<typeof setStakes>,
  listenerApi: AppListenerEffectAPI
) => {
  try {
    const stakingProviders = selectStakingProviders(listenerApi.getState())
    if (stakingProviders.length === 0) return
    // one-off listener
    listenerApi.unsubscribe()

    await getKeepStakingAppStakingProvidersData(
      stakingProviders,
      listenerApi.extra.threshold.multiAppStaking.randomBeacon,
      "randomBeacon",
      listenerApi
    )

    await getKeepStakingAppStakingProvidersData(
      stakingProviders,
      listenerApi.extra.threshold.multiAppStaking.ecdsa,
      "tbtc",
      listenerApi
    )
  } catch (error) {
    console.log("Could not fetch apps data for staking providers ", error)
    listenerApi.subscribe()
  }
}

const getKeepStakingAppStakingProvidersData = async (
  stakingProviders: string[],
  application: IApplication,
  appName: StakingAppName,
  listenerApi: AppListenerEffectAPI
) => {
  try {
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.fetchingStakingProvidersAppData({
        appName,
      })
    )
    const appData = await Promise.all(
      stakingProviders.map(application.getStakingProviderAppInfo)
    )
    const appDataByStakingProvider = stakingProviders.reduce(
      (reducer, stakingProvider, index) => {
        const _appData = appData[index]
        reducer[stakingProvider] = {
          authorizedStake: _appData.authorizedStake.toString(),
          pendingAuthorizationDecrease:
            _appData.pendingAuthorizationDecrease.toString(),
          remainingAuthorizationDecreaseDelay:
            _appData.remainingAuthorizationDecreaseDelay.toString(),
        }
        return reducer
      },
      {} as { [stakingProvider: string]: StakingProviderAppInfo<string> }
    )
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.setStakingProvidersAppData({
        appName,
        data: appDataByStakingProvider,
      })
    )
  } catch (error) {
    listenerApi.dispatch(
      stakingApplicationsSlice.actions.setStakingProvidersAppDataError({
        appName,
        error: (error as Error).toString(),
      })
    )
    throw error
  }
}
