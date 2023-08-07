import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

const baseStyle = definePartsStyle({
  field: {
    backgroundColor: 'gray.50 !important',
    color: 'gray.300 !important',
  },
})

export const selectTheme = defineMultiStyleConfig({ baseStyle })