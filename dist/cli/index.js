import { Command } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { t } from '../locales/index.js';
import { login, logout, isLoggedIn } from '../services/auth.js';
import { getApplicationInfo, listApplications, createApplication, fetchPlatforms, getPlatformByName } from '../services/app.js';
import { deployApp } from '../services/deploy.js';
import { publishApp, getVersionList } from '../services/publish.js';
import { getBotInfo, registerBot, getBotMessages, saveBotMessages, setMenuButton } from '../services/bot.js';
import { readProjectConfig, writeProjectConfig } from '../services/config.js';
// 简单的终端交互工具（CLI 模式专用，不依赖 inquirer）
function prompt(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}
function promptPassword(question) {
    return new Promise(resolve => {
        process.stdout.write(question);
        const rl = readline.createInterface({ input: process.stdin, output: undefined });
        process.stdin.setRawMode?.(true);
        let password = '';
        process.stdin.on('data', function handler(ch) {
            const char = ch.toString();
            if (char === '\n' || char === '\r' || char === '\u0003') {
                process.stdin.setRawMode?.(false);
                process.stdin.removeListener('data', handler);
                rl.close();
                process.stdout.write('\n');
                resolve(password);
            }
            else if (char === '\u007f') {
                password = password.slice(0, -1);
            }
            else {
                password += char;
                process.stdout.write('*');
            }
        });
    });
}
// 打印一条状态行
function ok(msg) { console.log(`✓ ${msg}`); }
function fail(msg) { console.error(`✗ ${msg}`); process.exit(1); }
function info(msg) { console.log(`  ${msg}`); }
// 从 .portex 或参数中解析 appName
async function resolveAppName(argName) {
    if (argName)
        return argName;
    const cfg = readProjectConfig();
    if (cfg.appName) {
        info(`${t('config.appName')}: ${cfg.appName}`);
        return cfg.appName;
    }
    const name = await prompt(`App name: `);
    if (!name)
        fail(t('error.appNotFound'));
    return name;
}
export async function runCLI(argv) {
    const program = new Command();
    program
        .name('portex')
        .description('Portex CLI — one-click web game deployment')
        .version(process.env.npm_package_version ?? '0.1.4');
    // ── login ────────────────────────────────────────────────────────────────
    program
        .command('login')
        .description(t('login.title'))
        .action(async () => {
        const account = await prompt(`${t('login.account')}: `);
        const password = await promptPassword(`${t('login.password')}: `);
        process.stdout.write(t('login.loggingIn') + '\n');
        try {
            await login(account, password);
            ok(t('login.success'));
        }
        catch {
            fail(t('login.failed'));
        }
    });
    // ── logout ───────────────────────────────────────────────────────────────
    program
        .command('logout')
        .description(t('logout.success'))
        .action(() => {
        logout();
        ok(t('logout.success'));
    });
    // ── new ──────────────────────────────────────────────────────────────────
    program
        .command('new')
        .description(t('new.title'))
        .option('--name <name>', 'App name')
        .option('--platform <platform>', 'Platform name')
        .action(async (opts) => {
        if (!isLoggedIn())
            fail(t('error.unauthorized'));
        const name = opts.name ?? await prompt(`${t('new.appName')}: `);
        const nameRegex = /^[a-z0-9_]{5,35}$/;
        if (!nameRegex.test(name))
            fail(t('new.appNameInvalid'));
        let platformId;
        if (opts.platform) {
            platformId = await getPlatformByName(opts.platform);
        }
        else {
            const platforms = await fetchPlatforms();
            info('Available platforms:');
            platforms.forEach((p, i) => info(`  ${i + 1}. ${p.name}`));
            const idx = parseInt(await prompt('Select platform (number): '), 10) - 1;
            if (idx < 0 || idx >= platforms.length)
                fail(t('error.platformNotFound'));
            platformId = platforms[idx].id;
        }
        const desc = await prompt(`${t('new.description')}: `);
        process.stdout.write(t('new.creating') + '\n');
        try {
            const newApp = await createApplication({ name, platformId, description: desc });
            ok(t('new.success'));
            writeProjectConfig({ appId: newApp.id, appName: name, deployPath: './dist', description: desc });
            ok(t('new.configCreated'));
            info(`  ${t('config.created')}: commit .portex/ to git for team sharing`);
        }
        catch {
            fail(t('new.failed'));
        }
    });
    // ── link ─────────────────────────────────────────────────────────────────
    program
        .command('link [appName]')
        .description('Link current directory to an existing app')
        .action(async (argName) => {
        if (!isLoggedIn())
            fail(t('error.unauthorized'));
        let appName = argName;
        if (!appName) {
            const apps = await listApplications();
            if (!apps.length)
                fail(t('error.appNotFound'));
            info('Your apps:');
            apps.forEach((a, i) => info(`  ${i + 1}. ${a.name}  (${a.platform_name})`));
            const idx = parseInt(await prompt('Select app (number): '), 10) - 1;
            if (idx < 0 || idx >= apps.length)
                fail(t('error.appNotFound'));
            appName = apps[idx].name;
        }
        const app = await getApplicationInfo({ application_name: appName });
        writeProjectConfig({ appId: app.id, appName: app.name, deployPath: './dist' });
        ok(`Linked to "${app.name}"`);
        ok(t('config.created'));
    });
    // ── ls ───────────────────────────────────────────────────────────────────
    program
        .command('ls')
        .description(t('list.title'))
        .option('-n, --name <name>', 'Filter by app name (fuzzy)')
        .option('-i, --id <id>', 'Filter by app ID')
        .option('-p, --platform <platform>', 'Filter by platform name')
        .option('--page <n>', 'Page number (1-based)', '1')
        .option('--per-page <n>', 'Items per page', '20')
        .action(async (opts) => {
        if (!isLoggedIn())
            fail(t('error.unauthorized'));
        const params = { application_id: opts.id };
        if (opts.platform)
            params.platform_id = await getPlatformByName(opts.platform);
        let apps = await listApplications(params);
        if (!apps.length) {
            info(t('list.empty'));
            return;
        }
        // 客户端名称模糊过滤
        if (opts.name) {
            const q = opts.name.toLowerCase();
            apps = apps.filter(a => a.name.toLowerCase().includes(q));
        }
        const perPage = Math.max(1, parseInt(opts.perPage, 10));
        const totalPages = Math.ceil(apps.length / perPage);
        const page = Math.min(Math.max(1, parseInt(opts.page, 10)), totalPages);
        const pageApps = apps.slice((page - 1) * perPage, page * perPage);
        const col = (s, w) => s.substring(0, w).padEnd(w);
        const line = '-'.repeat(100);
        console.log(line);
        console.log(col(t('list.headers.name'), 20), col(t('list.headers.platform'), 12), col(t('list.headers.lastVersion'), 10), col(t('list.headers.dev'), 6), col(t('list.headers.test'), 6), col(t('list.headers.prod'), 6), t('list.headers.description'));
        console.log(line);
        for (const app of pageApps) {
            const vmap = {};
            for (const v of app.published_versions ?? []) {
                vmap[v.env] = String(v.version);
            }
            console.log(col(app.name, 20), col(app.platform_name, 12), col(String(app.last_version), 10), col(vmap['0'] ?? '-', 6), col(vmap['1'] ?? '-', 6), col(vmap['2'] ?? '-', 6), app.description ?? '-');
        }
        console.log(line);
        console.log(`Page ${page}/${totalPages}  (${apps.length} total)`);
    });
    // ── deploy ───────────────────────────────────────────────────────────────
    program
        .command('deploy [appName] [buildPath] [description]')
        .description(t('deploy.title'))
        .action(async (argName, argPath, argDesc) => {
        if (!isLoggedIn())
            fail(t('error.unauthorized'));
        const cfg = readProjectConfig();
        const appName = argName ?? cfg.appName ?? await prompt(`${t('deploy.appName')}: `);
        const buildPath = argPath ?? cfg.deployPath ?? await prompt(`${t('deploy.path')}: `);
        let stage = '';
        try {
            const result = await deployApp({
                appName,
                buildPath,
                description: argDesc ?? cfg.description,
                onProgress: (s, pct) => {
                    if (s !== stage) {
                        stage = s;
                        const labels = {
                            compressing: t('deploy.compressing'),
                            getting_url: t('deploy.gettingUrl'),
                            uploading: t('deploy.uploading'),
                        };
                        process.stdout.write(`\r${labels[s] ?? s}${pct !== undefined ? ` ${pct}%` : ''}`);
                    }
                    else if (pct !== undefined) {
                        process.stdout.write(`\r${t('deploy.uploading')} ${pct}%   `);
                    }
                },
            });
            process.stdout.write('\n');
            ok(`${t('deploy.success')} ${t('deploy.version')}: ${result.version}`);
            info(t('deploy.nextStep'));
        }
        catch (e) {
            process.stdout.write('\n');
            fail(`${t('deploy.failed')}: ${e instanceof Error ? e.message : e}`);
        }
    });
    // ── publish ──────────────────────────────────────────────────────────────
    program
        .command('publish [appName] [version]')
        .description(t('publish.title'))
        .option('-e, --env <env>', 'Target environment (dev|test|prod)', 'dev')
        .action(async (argName, argVersion, opts) => {
        if (!isLoggedIn())
            fail(t('error.unauthorized'));
        const cfg = readProjectConfig();
        const appName = argName ?? cfg.appName ?? await prompt(`${t('publish.appName')}: `);
        const app = await getApplicationInfo({ application_name: appName });
        let version;
        if (argVersion) {
            version = parseInt(argVersion, 10);
        }
        else {
            const versions = await getVersionList(app.id);
            if (!versions.length)
                fail(t('publish.noVersions'));
            info('Available versions:');
            versions.forEach((v, i) => info(`  ${i + 1}. v${v.version}`));
            const idx = parseInt(await prompt('Select version (number): '), 10) - 1;
            version = versions[idx]?.version ?? 0;
        }
        const env = opts?.env ?? 'dev';
        process.stdout.write(t('publish.publishing') + '\n');
        try {
            const url = await publishApp({ applicationId: app.id, appName, version, env });
            ok(t('publish.success'));
            info(`${t('publish.previewUrl')}: ${url}`);
        }
        catch {
            fail(t('publish.failed'));
        }
    });
    // ── bot register ─────────────────────────────────────────────────────────
    const bot = program.command('bot').description(t('bot.title'));
    bot
        .command('register <appName> <botToken>')
        .description(t('bot.menu.register'))
        .action(async (appName, botToken) => {
        if (!isLoggedIn())
            fail(t('error.unauthorized'));
        const app = await getApplicationInfo({ application_name: appName });
        if (app.platform_name !== 'Telegram')
            fail(t('bot.onlyTelegram'));
        process.stdout.write(t('bot.register.registering') + '\n');
        try {
            await registerBot(app.id, botToken);
            ok(t('bot.register.success'));
        }
        catch {
            fail(t('bot.register.failed'));
        }
    });
    // ── bot info ──────────────────────────────────────────────────────────────
    bot
        .command('info <appName>')
        .description(t('bot.menu.info'))
        .action(async (appName) => {
        if (!isLoggedIn())
            fail(t('error.unauthorized'));
        const app = await getApplicationInfo({ application_name: appName });
        if (app.platform_name !== 'Telegram')
            fail(t('bot.onlyTelegram'));
        try {
            const botInfo = await getBotInfo(app.id);
            info(`${t('bot.info.name')}: ${botInfo.name}`);
            info(`${t('bot.info.description')}: ${botInfo.description}`);
            info(`${t('bot.info.shortDescription')}: ${botInfo.short_description}`);
        }
        catch {
            fail(t('bot.notBound'));
        }
    });
    // ── bot message ──────────────────────────────────────────────────────────
    bot
        .command('message <appName> [filePath]')
        .description(t('bot.menu.message'))
        .option('-i, --input', 'Import messages from JSON file')
        .option('-o, --output', 'Export messages to JSON file')
        .option('-t, --template', 'Export default template')
        .action(async (appName, filePath, opts) => {
        if (!isLoggedIn())
            fail(t('error.unauthorized'));
        const app = await getApplicationInfo({ application_name: appName });
        if (app.platform_name !== 'Telegram')
            fail(t('bot.onlyTelegram'));
        const resolvedPath = filePath
            ? path.resolve(process.cwd(), filePath)
            : path.resolve(process.cwd(), 'messages.json');
        if (opts?.input) {
            const messages = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
            await saveBotMessages(app.id, messages);
            ok('Bot messages saved');
        }
        else if (opts?.output) {
            const messages = await getBotMessages(app.id);
            fs.writeFileSync(resolvedPath, JSON.stringify(messages, null, 2));
            ok(`Messages exported to ${resolvedPath}`);
        }
        else if (opts?.template) {
            const { getDefaultMessageTemplate } = await import('../services/bot.js');
            fs.writeFileSync(resolvedPath, JSON.stringify(getDefaultMessageTemplate(), null, 2));
            ok(`Template exported to ${resolvedPath}`);
        }
        else {
            fail('Specify -i (input), -o (output) or -t (template)');
        }
    });
    // ── bot menu set ─────────────────────────────────────────────────────────
    const botMenu = bot.command('menu').description('Bot menu settings');
    botMenu
        .command('set <appName> <menuName> <menuURL>')
        .description(t('bot.menu.menuButton'))
        .action(async (appName, menuName, menuURL) => {
        if (!isLoggedIn())
            fail(t('error.unauthorized'));
        const app = await getApplicationInfo({ application_name: appName });
        if (app.platform_name !== 'Telegram')
            fail(t('bot.onlyTelegram'));
        process.stdout.write(t('bot.menuButton.updating') + '\n');
        try {
            await setMenuButton(app.id, menuURL, menuName);
            ok(t('bot.menuButton.success'));
        }
        catch {
            fail(t('bot.menuButton.failed'));
        }
    });
    // ── ui ────────────────────────────────────────────────────────────────────
    program
        .command('ui')
        .description('Open interactive TUI dashboard')
        .action(() => {
        // 由 src/index.ts 主入口处理，不会走到这里
    });
    await program.parseAsync(argv);
}
