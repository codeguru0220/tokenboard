import posthog from "posthog-js"

const POSTHOG_API_KEY = "phc_5XMnBAeMVxZQhmBm6G0Kee5ujBOiUhGYIakUKfDhgs5"
const POSTHOG_API_HOST = "https://app.posthog.com"

export const init = () => {
  posthog.init(POSTHOG_API_KEY, {
    api_host: POSTHOG_API_HOST,
    // T dapp is a single page app so we need to make a `pageview` call
    // manually. It also prevents sending the `pageview` event on postohog
    // initialization.
    capture_pageview: false,
    persistence: "memory",
  })
}

export const identify = (ethAddress: string) => {
  posthog.identify(ethAddress)
}

// Posthog automatically sends pageview events whenever it gets loaded. For a
// one-page app, this means it will only send a `pageview` once, when the app
// loads. To make sure any navigating a user does within your app gets captured,
// you must make a `pageview` call manually.
export const capturePageview = () => {
  posthog.capture("$pageview")
}

export const reset = () => {
  posthog.reset()
}
