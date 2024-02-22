import { useEffect } from "react"
import { featureFlags } from "../../constants"
import * as posthog from "../../posthog"
import { useCapturePageview } from "./useCapturePageview"
import { useCaptureWalletConnected } from "./useCaptureWalletConnected"
import { useIdentify } from "./useIdentify"

export const usePosthog = () => {
  useEffect(() => {
    if (featureFlags.POSTHOG) {
      posthog.init()
    }
  }, [])

  useCapturePageview()
  useIdentify()
  useCaptureWalletConnected()
}
