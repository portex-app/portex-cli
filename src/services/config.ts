import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export interface ProjectConfig {
    appId?: string
    appName?: string
    platform?: string
    deployPath?: string
    description?: string
}

export interface GlobalConfig {
    defaultLang?: 'zh' | 'en'
}

const PROJECT_CONFIG_DIR  = path.join(process.cwd(), '.portex')
const PROJECT_CONFIG_FILE = path.join(PROJECT_CONFIG_DIR, 'config.json')
const GLOBAL_CONFIG_FILE  = path.join(os.homedir(), '.portex', 'config.json')

function ensureProjectConfigDir(): void {
    const stat = fs.existsSync(PROJECT_CONFIG_DIR) ? fs.statSync(PROJECT_CONFIG_DIR) : null
    if (stat?.isDirectory()) return
    if (stat?.isFile()) {
        // Migrate legacy .portex file → .portex/config.json
        const legacy = fs.readFileSync(PROJECT_CONFIG_DIR, 'utf8')
        fs.rmSync(PROJECT_CONFIG_DIR)
        fs.mkdirSync(PROJECT_CONFIG_DIR, { recursive: true })
        fs.writeFileSync(PROJECT_CONFIG_FILE, legacy)
    } else {
        fs.mkdirSync(PROJECT_CONFIG_DIR, { recursive: true })
    }
}

export function readProjectConfig(): ProjectConfig {
    ensureProjectConfigDir()
    if (fs.existsSync(PROJECT_CONFIG_FILE)) {
        try { return JSON.parse(fs.readFileSync(PROJECT_CONFIG_FILE, 'utf8')) as ProjectConfig } catch { return {} }
    }
    return {}
}

export function writeProjectConfig(config: ProjectConfig): void {
    ensureProjectConfigDir()
    fs.writeFileSync(PROJECT_CONFIG_FILE, JSON.stringify(config, null, 2))
}

export function readGlobalConfig(): GlobalConfig {
    if (!fs.existsSync(GLOBAL_CONFIG_FILE)) return {}
    try {
        return JSON.parse(fs.readFileSync(GLOBAL_CONFIG_FILE, 'utf8')) as GlobalConfig
    } catch {
        return {}
    }
}

export function writeGlobalConfig(config: GlobalConfig): void {
    fs.writeFileSync(GLOBAL_CONFIG_FILE, JSON.stringify(config, null, 2))
}
