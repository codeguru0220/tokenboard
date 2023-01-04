import { FC, ComponentProps } from "react"
import { List } from "@chakra-ui/react"
import { LabelSm, Card } from "@threshold-network/components"
import DetailedLinkListItem from "../../../components/DetailedLinkListItem"
import { IoDocument } from "react-icons/all"
import { ExternalHref } from "../../../enums"

export const AuditsCard: FC<ComponentProps<typeof Card>> = (props) => {
  return (
    <Card {...props}>
      <LabelSm mb={8}>Audit Reports</LabelSm>
      <List spacing="2">
        {audits.map((audit) => (
          <DetailedLinkListItem key={audit.title} {...audit} />
        ))}
      </List>
    </Card>
  )
}

const audits = [
  {
    title: "Audit Bridge",
    href: ExternalHref.tBTCBrdigeAudit,
    icon: IoDocument,
  },
  {
    title: "Spearbit",
    href: ExternalHref.spearbitAudit,
    icon: IoDocument,
  },
]
