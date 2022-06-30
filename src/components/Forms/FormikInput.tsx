import { FC } from "react"
import {
  FormControl,
  FormControlProps,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  Stack,
} from "@chakra-ui/react"
import { useField } from "formik"
import { BodySm } from "@threshold-network/components"
import TooltipIcon from "../TooltipIcon"

export const FormikInput: FC<
  FormControlProps & {
    name: string
    label: string
    secondaryLabel?: string
    helperText?: string
    placeholder?: string
    tooltip?: string
  }
> = ({
  name,
  label,
  secondaryLabel,
  helperText,
  placeholder,
  tooltip,
  ...restProps
}) => {
  const [field, meta] = useField(name)

  const isError = Boolean(meta.touched && meta.error)

  return (
    <FormControl isInvalid={isError} {...restProps}>
      <Stack direction="row" mb={2} justifyContent="space-between">
        <Stack direction="row">
          <FormLabel m={0} htmlFor={name}>
            {label}
          </FormLabel>
          {tooltip && <TooltipIcon marginTop="4px" label={tooltip} />}
        </Stack>
        {secondaryLabel && (
          <BodySm color="gray.700" m={0}>
            {secondaryLabel}
          </BodySm>
        )}
      </Stack>
      <Input
        id={name}
        isInvalid={isError}
        errorBorderColor="red.300"
        placeholder={placeholder}
        {...field}
        value={meta.value}
      />
      {!isError ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      )}
    </FormControl>
  )
}
