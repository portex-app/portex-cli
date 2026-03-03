import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const PROJECT_CONFIG_DIR = path.join(process.cwd(), '.portex');
const PROJECT_CONFIG_FILE = path.join(PROJECT_CONFIG_DIR, 'config.json');
const GLOBAL_CONFIG_FILE = path.join(os.homedir(), '.portex', 'config.json');
function ensureProjectConfigDir() {
    const stat = fs.existsSync(PROJECT_CONFIG_DIR) ? fs.statSync(PROJECT_CONFIG_DIR) : null;
    if (stat?.isDirectory())
        return;
    if (stat?.isFile()) {
        // Migrate legacy .portex file → .portex/config.json
        const legacy = fs.readFileSync(PROJECT_CONFIG_DIR, 'utf8');
        fs.rmSync(PROJECT_CONFIG_DIR);
        fs.mkdirSync(PROJECT_CONFIG_DIR, { recursive: true });
        fs.writeFileSync(PROJECT_CONFIG_FILE, legacy);
    }
    else {
        fs.mkdirSync(PROJECT_CONFIG_DIR, { recursive: true });
    }
}
export function readProjectConfig() {
    ensureProjectConfigDir();
    if (fs.existsSync(PROJECT_CONFIG_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(PROJECT_CONFIG_FILE, 'utf8'));
        }
        catch {
            return {};
        }
    }
    return {};
}
export function writeProjectConfig(config) {
    ensureProjectConfigDir();
    fs.writeFileSync(PROJECT_CONFIG_FILE, JSON.stringify(config, null, 2));
}
export function readGlobalConfig() {
    if (!fs.existsSync(GLOBAL_CONFIG_FILE))
        return {};
    try {
        return JSON.parse(fs.readFileSync(GLOBAL_CONFIG_FILE, 'utf8'));
    }
    catch {
        return {};
    }
}
export function writeGlobalConfig(config) {
    fs.writeFileSync(GLOBAL_CONFIG_FILE, JSON.stringify(config, null, 2));
}
