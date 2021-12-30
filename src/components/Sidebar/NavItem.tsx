import { FC } from "react"
import {
  Box,
  Button,
  Icon,
  IconButton,
  Link,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"
import { useSidebar } from "../../hooks/useSidebar"
import useChakraBreakpoint from "../../hooks/useChakraBreakpoint"

export interface NavItemDetail {
  text: string
  href: string
  activeIcon: any
  passiveIcon: any
  isFooter?: boolean
}

const NavItem: FC<NavItemDetail> = ({
  text,
  href,
  activeIcon,
  passiveIcon,
  isFooter,
}) => {
  const { isOpen, closeSidebar } = useSidebar()
  const isMobileDevice = useChakraBreakpoint("md")
  const isActive = useRouteMatch(href)

  return (
    <Box position="relative" my={2}>
      {/* Active Border Highlight */}
      {isActive && (
        <Box
          zIndex={999}
          top="-8px"
          height="calc(100% + 16px)"
          width="4px"
          bg={useColorModeValue("brand.500", "brand.50")}
          position="absolute"
          right={0}
          borderRadius="4px 0 0 4px"
        />
      )}
      <Tooltip
        placement="right"
        hasArrow
        label={text}
        isDisabled={isOpen}
        boxShadow="md"
        bg={useColorModeValue("gray.800", "white")}
        color={useColorModeValue("white", "gray.700")}
        padding={2}
        gutter={32}
        arrowSize={16}
      >
        <Link
          as={isFooter ? undefined : RouterLink}
          to={href}
          href={href}
          _hover={{ textDecoration: "none" }}
          tabIndex={-1}
        >
          {isOpen ? (
            <Button
              iconSpacing={4}
              onClick={() => {
                if (isMobileDevice) {
                  closeSidebar()
                }
              }}
              w="calc(100% - 32px)"
              justifyContent="left"
              variant="side-bar"
              leftIcon={
                <Icon
                  boxSize="32px"
                  as={isActive ? activeIcon : passiveIcon}
                  color={
                    isActive
                      ? useColorModeValue("brand.500", "brand.50")
                      : undefined
                  }
                />
              }
              color={
                isActive ? useColorModeValue("gray.700", "brand.50") : undefined
              }
              fontSize="lg"
            >
              {text}
            </Button>
          ) : (
            <IconButton
              variant="side-bar"
              aria-label={text}
              icon={
                <Icon
                  boxSize="32px"
                  as={isActive ? activeIcon : passiveIcon}
                  color={
                    isActive
                      ? useColorModeValue("brand.500", "brand.50")
                      : undefined
                  }
                />
              }
            />
          )}
        </Link>
      </Tooltip>
    </Box>
  )
}

export default NavItem
