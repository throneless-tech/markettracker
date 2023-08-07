import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

const baseStyle = definePartsStyle({
  field: {
    backgroundColor: 'gray.50 !important',
    '&:focus-visible': {
      backgroundColor: 'green.50 !important',
      borderColor: 'green.600 !important',
      borderWidth: 2,
      boxShadow: 'none !important',
    }
  },
})

export const inputTheme = defineMultiStyleConfig({ baseStyle })