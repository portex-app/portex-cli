import { Box, Text } from 'ink'
import React from 'react'

interface ProgressBarProps {
    percent: number
    width?: number
    label?: string
}

export function ProgressBar({ percent, width = 30, label }: ProgressBarProps) {
    const filled = Math.round((percent / 100) * width)
    const empty = width - filled
    return (
        <Box flexDirection="column">
            {label && <Text color="gray">{label}</Text>}
            <Box>
                <Text color="cyan">{'█'.repeat(filled)}</Text>
                <Text color="gray">{'░'.repeat(empty)}</Text>
                <Text color="white">  {percent}%</Text>
            </Box>
        </Box>
    )
}
