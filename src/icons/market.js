import React from 'react'
import { createIcon } from '@chakra-ui/icons'

const MarketIcon = createIcon({
  displayName: 'MarketIcon',
  viewBox: '0 0 24 24',
  path: [
    (
      <path d="M4.5 13.09v6.41a.75.75 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75v-6.41" stroke="#F6F5F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    ),
    (
      <path d="M9 9v1.5a3 3 0 0 1-6 0V9M15 9v1.5a3 3 0 0 1-6 0V9M21 9v1.5a3 3 0 0 1-6 0V9M5.06 3.75h13.88a.76.76 0 0 1 .72.54L21 9H3l1.34-4.7a.76.76 0 0 1 .72-.55v0Z" stroke="#F6F5F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    )
  ]
})

export { MarketIcon };