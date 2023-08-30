import React from 'react'

import { createIcon } from '@chakra-ui/icons'

const StarIcon = createIcon({
  displayName: 'StarIcon',
  viewBox: '0 0 41 40',
  path: [
    (
      <rect width="40" height="40" fill="#E6B223" rx="20" />
    ),
    (
      <path fill="#E6B223" stroke="#F6F5F4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m24.8 25.55-3.63 9.97a1.25 1.25 0 0 1-2.34 0l-3.63-9.97a1.27 1.27 0 0 0-.75-.75l-9.97-3.63a1.25 1.25 0 0 1 0-2.34l9.97-3.63a1.27 1.27 0 0 0 .75-.75l3.63-9.97a1.25 1.25 0 0 1 2.34 0l3.63 9.97a1.27 1.27 0 0 0 .75.75l9.97 3.63a1.25 1.25 0 0 1 0 2.34l-9.97 3.63a1.26 1.26 0 0 0-.75.75v0Z" />
    )
  ]
})

export default StarIcon;
