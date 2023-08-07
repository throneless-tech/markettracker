import React from 'react'
import { createIcon } from '@chakra-ui/icons'

const LicenseIcon = createIcon({
  displayName: 'LicenseIcon',
  viewBox: '0 0 24 24',
  path: (
    <path d="M3.75 10.75v-5.5a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 .75.75v5.5c0 7.88-6.68 10.48-8.02 10.93a.68.68 0 0 1-.46 0c-1.34-.45-8.02-3.05-8.02-10.93ZM12 9v3.75M8.44 11.59 12 12.75M9.8 15.79l2.2-3.04M14.2 15.79 12 12.75M15.56 11.59 12 12.75" stroke="#F6F5F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  )
})

export { LicenseIcon };