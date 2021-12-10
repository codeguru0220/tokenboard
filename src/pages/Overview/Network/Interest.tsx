import { FC } from "react"
import CardTemplate from "./CardTemplate"
import { HStack } from "@chakra-ui/react"
import { Label3 } from "../../../components/Typography"
import StatBox from "./StatBox"

const Interest: FC = () => {
  const yieldData = [
    { value: "80%", text: "Stake Yield" },
    { value: "80%", text: "Pool Yield" },
    { value: "80%", text: "Yield" },
  ]

  return (
    <CardTemplate title="INTEREST">
      <HStack justifyContent="space-between" spacing={4}>
        {yieldData.map((node) => (
          <StatBox key={node.text} {...node} />
        ))}
      </HStack>
    </CardTemplate>
  )
}

export default Interest
