import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const PORTEX_HOME = path.join(os.homedir(), '.portex');
const TOKEN_FILE = path.join(PORTEX_HOME, 'token.jwt');
const GLOBAL_CONFIG_FILE = path.join(PORTEX_HOME, 'config.json');
const PACKAGE_DIR = path.join(PORTEX_HOME, 'package');
export function initConfig() {
    if (!fs.existsSync(PORTEX_HOME)) {
        fs.mkdirSync(PORTEX_HOME, { recursive: true });
    }
    if (!fs.existsSync(TOKEN_FILE)) {
        fs.writeFileSync(TOKEN_FILE, '');
    }
    if (!fs.existsSync(GLOBAL_CONFIG_FILE)) {
        fs.writeFileSync(GLOBAL_CONFIG_FILE, JSON.stringify({}));
    }
    if (!fs.existsSync(PACKAGE_DIR)) {
        fs.mkdirSync(PACKAGE_DIR, { recursive: true });
    }
    process.env._PORTEX_CONFIG_DIR_ = PORTEX_HOME;
    process.env._PORTEX_CONFIG_TOKEN_FILE_PATH_ = TOKEN_FILE;
    process.env._PORTEX_CONFIG_PACKAGE_FILE_PATH_ = PACKAGE_DIR;
}
