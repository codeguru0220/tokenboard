import { mode, PartsStyleFunction, anatomy } from "@chakra-ui/theme-tools"

const parts = anatomy("DetailedLinkListItem").parts(
  "container",
  "image",
  "title",
  "subTitle",
  "link"
)

const baseStyle: PartsStyleFunction<typeof parts> = (props) => {
  return {
    container: {
      backgroundColor: mode("gray.50", "gray.800")(props),
      padding: 4,
      borderRadius: "6px",
      border: mode("none", "1px solid")(props),
      borderColor: "gray.700",
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: { base: "column", sm: "row" },
    },
    image: {
      w: "48px",
      h: "48px",
      borderRadius: "6px",
      mr: { sm: "4" },
    },
    title: {
      alignSelf: { base: "center", sm: "unset" },
      color: mode("gray.700", "white")(props),
    },
    subTitle: {
      color: mode("gray.500", "white")(props),
    },
    link: {
      color: mode("gray.700", "white")(props),
    },
    imageFallback: {
      w: "48px",
      h: "48px",
      bg: "brand.500",
      color: "white",
      borderRadius: "6px",
      mr: { sm: "4" },
    },
  }
}

export const DetailedLinkListItem = {
  parts: parts.keys,
  baseStyle,
}
