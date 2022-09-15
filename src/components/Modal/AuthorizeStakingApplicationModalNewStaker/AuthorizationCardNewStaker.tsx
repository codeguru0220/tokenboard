import { FC, useMemo } from "react"
import {
  BodyMd,
  BoxProps,
  Card,
  Checkbox,
  Grid,
  GridItem,
  BodySm,
  Link,
} from "@threshold-network/components"
import { AppAuthorizationInfo } from "../../../pages/Staking/AuthorizeStakingApps/AuthorizeApplicationsCardCheckbox/AppAuthorizationInfo"
import ThresholdCircleBrand from "../../../static/icons/ThresholdCircleBrand"
import { formatTokenAmount } from "../../../utils/formatAmount"
import { FormikTokenBalanceInput } from "../../Forms/FormikTokenBalanceInput"
import { FormControl, HStack } from "@chakra-ui/react"
import { Field, FieldProps, useField } from "formik"
import numeral from "numeral"
import { formatUnits } from "@ethersproject/units"

export interface AuthorizationCardProps extends BoxProps {
  max: string | number
  min: string | number
  inputId: string
  checkBoxId: string
  label: string
}

export const AuthorizationCardNewStaker: FC<AuthorizationCardProps> = ({
  max,
  min,
  inputId,
  checkBoxId,
  label,
  ...restProps
}) => {
  const [, { value: inputValue }, { setValue }] = useField(inputId)
  const [, { value: checkboxValue }] = useField(checkBoxId)

  const percentToBeAuthorized = useMemo(() => {
    if (inputValue) {
      return (Number(formatUnits(inputValue)) / Number(formatUnits(max))) * 100
    }
    return 0
  }, [inputValue])

  return (
    <Card
      {...restProps}
      boxShadow="none"
      borderColor={checkboxValue === true ? "brand.500" : undefined}
    >
      <Grid
        gridTemplateAreas={{
          base: `
            "checkbox             checkbox"
            "app-info             app-info"
            "filter-tabs          filter-tabs"
            "token-amount-form    token-amount-form"
          `,
          sm: `
              "checkbox        app-info"
              "checkbox        filter-tabs"
              "checkbox        token-amount-form"
            `,
          md: `
              "checkbox        app-info           filter-tabs      "
              "checkbox        token-amount-form  token-amount-form"
              "checkbox        token-amount-form  token-amount-form"
            `,
        }}
        gridTemplateColumns={"1fr 18fr"}
        gap="3"
        p={0}
      >
        <Field name={checkBoxId}>
          {({ field }: FieldProps) => {
            const { value } = field
            return (
              <FormControl>
                <Checkbox
                  isChecked={value}
                  gridArea="checkbox"
                  alignSelf={"flex-start"}
                  justifySelf={"center"}
                  size="lg"
                  {...field}
                />
              </FormControl>
            )
          }}
        </Field>
        <AppAuthorizationInfo
          gridArea="app-info"
          label={label}
          percentageAuthorized={percentToBeAuthorized}
          aprPercentage={10}
          slashingPercentage={1}
          isAuthorizationRequired={true}
          separatePercentAuthorized
        />
        <GridItem gridArea="token-amount-form" mt={5}>
          <FormikTokenBalanceInput
            name={inputId}
            label={
              <HStack justifyContent="space-between">
                <BodyMd>Authorized Amount</BodyMd>
                <BodyMd>
                  Remaining Balance:{" "}
                  {numeral(formatUnits(max)).format("0,0.00")}
                </BodyMd>
              </HStack>
            }
            placeholder="Enter amount"
            icon={ThresholdCircleBrand}
            max={max}
            helperText={
              <BodySm>
                <Link onClick={() => setValue(min)}>Minimum</Link>
                {formatTokenAmount(min)} T for ${label}
              </BodySm>
            }
            _disabled={{ bg: "gray.50", border: "none" }}
          />
        </GridItem>
      </Grid>
    </Card>
  )
}

export default AuthorizationCardNewStaker
