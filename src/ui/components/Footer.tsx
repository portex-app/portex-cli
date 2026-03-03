import { Box, Text } from 'ink'
import React from 'react'

import { t } from '../../locales/index.js'

export function Footer() {
    return (
        <Box borderStyle="round" borderColor="gray" paddingX={1} width={60}>
            <Text color="gray">{t('footer.hint')}</Text>
        </Box>
    )
}
