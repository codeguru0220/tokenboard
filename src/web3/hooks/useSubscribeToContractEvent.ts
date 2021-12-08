import { useEffect, useRef } from "react"
import { Contract, EventFilter } from "@ethersproject/contracts"

// TODO: types
export const useSubscribeToContractEvent = (
  contract: Contract | null,
  eventName: string,
  callback: (args: any[]) => void,
  // The indexed parameters must be in the correct order. For example if we want
  // to filter the `Transfer` event of ERC20 contract, which is implemented as
  // `event Transfer(address indexed from, address indexed to, uint256 value);`,
  // by `to` param we need to pass `[null, <address>]`.
  indexedFilterParams: string[] = []
) => {
  const callbackRef = useRef<(args: any[]) => void>()
  const indexedFilterParamsLength = indexedFilterParams.length
  // An event can have up to 3 indexed params. We want to extract these values
  // from an array and use them in `useEffect` dependency array.
  const firstIndexedParam = indexedFilterParams[0] || null
  const secondIndexedParam = indexedFilterParams[1] || null
  const thirdIndexedParam = indexedFilterParams[2] || null

  useEffect(() => {
    callbackRef.current = callback // Update ref to the latest callback.
  }, [callback])

  useEffect(() => {
    if (!contract) {
      return
    }

    // @ts-ignore
    function cb(...args) {
      // @ts-ignore
      callbackRef.current(...args)
    }

    const fileterParams = [
      firstIndexedParam,
      secondIndexedParam,
      thirdIndexedParam,
    ]

    // Remove unnecessary params, otherwise encoding topic filter will fail. For
    // example, we can't pass `[<address>, null]` if we want to filter the
    // `Transfer` event only by `from`.
    fileterParams.length = indexedFilterParamsLength
    const eventNameOrFilter: string | EventFilter =
      indexedFilterParamsLength === 0
        ? eventName
        : contract.filters[eventName](fileterParams)

    // Ethers.js considers the current block as part of "from now on" so we
    // start subscribing to event in the next block. If the user submit a
    // transactions, that certainly won't be part of the current block, so we
    // can omit event from a current block.
    const onBlockGuard = () => {
      contract.on(eventNameOrFilter, cb)
    }
    // TODO: consider if we should do it in this way because it creates a
    // subscription to `block` on every use of this hook. Maybe we should fetch
    // the current block when the dapp starts and save it in the context?
    contract.provider.once("block", onBlockGuard)

    return () => {
      if (contract) {
        contract.provider.off("block", onBlockGuard)
        contract.off(eventNameOrFilter, cb)
      }
    }
  }, [
    contract,
    eventName,
    firstIndexedParam,
    secondIndexedParam,
    thirdIndexedParam,
    indexedFilterParamsLength,
  ])
}
