import { createCipheriv } from 'node:crypto'
import fs from 'node:fs'

import { apiLogin } from '../api/modules/public/index.js'

const AES_KEY = 'OsVgjzxz3GCbXnd/ANpKU6s501bGzrPZ'

function encryptPassword(password: string): string {
    const cipher = createCipheriv('aes-256-cbc', AES_KEY, AES_KEY.slice(0, 16))
    return cipher.update(password, 'utf8', 'base64') + cipher.final('base64')
}

export async function login(account: string, password: string): Promise<void> {
    const encrypted = encryptPassword(password)
    const { token } = await apiLogin({ login: account, password: encrypted })
    fs.writeFileSync(process.env._PORTEX_CONFIG_TOKEN_FILE_PATH_ as string, token)
}

export function logout(): void {
    fs.writeFileSync(process.env._PORTEX_CONFIG_TOKEN_FILE_PATH_ as string, '')
}

export function isLoggedIn(): boolean {
    try {
        const token = fs.readFileSync(
            process.env._PORTEX_CONFIG_TOKEN_FILE_PATH_ as string,
            'utf8'
        ).trim()
        return token.length > 0
    } catch {
        return false
    }
}

export function getToken(): string {
    try {
        return fs.readFileSync(
            process.env._PORTEX_CONFIG_TOKEN_FILE_PATH_ as string,
            'utf8'
        ).trim()
    } catch {
        return ''
    }
}
