import { FC, ComponentProps } from "react"
import { useTBTCBridgeContractAddress } from "../../hooks/useTBTCBridgeContractAddress"
import { ExplorerDataType } from "../../utils/createEtherscanLink"
import ViewInBlockExplorer from "../ViewInBlockExplorer"

type Props = Omit<
  ComponentProps<typeof ViewInBlockExplorer>,
  "text" | "id" | "type"
> & {
  text?: string
}

export const BridgeContractLink: FC<Props> = ({
  text = "Bridge Contract",
  ...props
}) => {
  const address = useTBTCBridgeContractAddress()
  return (
    <ViewInBlockExplorer
      id={address}
      type={ExplorerDataType.ADDRESS}
      text={text}
      {...props}
    />
  )
}
