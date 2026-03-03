import fs from 'node:fs'
import path from 'node:path'

export const writeLogFile = (content: string): void => {
    try {
        const date = new Date()
        const ts = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, '0'),
            String(date.getDate()).padStart(2, '0'),
            String(date.getHours()).padStart(2, '0'),
            String(date.getMinutes()).padStart(2, '0'),
            String(date.getSeconds()).padStart(2, '0'),
        ].join('_')

        const logDir = path.join(process.env._PORTEX_CONFIG_DIR_ as string, 'log')
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })

        fs.writeFileSync(path.join(logDir, `${ts}.log`), content)
    } catch {
        // ignore log failures silently
    }
}
