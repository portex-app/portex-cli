import fs from 'node:fs';
import path from 'node:path';
/**
 * @description 在 CLI 完成初始化之后，找到对应命令之前,初始化配置文件
 * @param opts 包含 CLI 初始化时传递的配置信息，包括配置目录路径等
 */
const hook = async function (opts) {
    const { configDir } = opts.config;
    // 判断是否存在配置目录,不存在则创建
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }
    const tokenFilePath = path.join(configDir, 'token.jwt');
    // 判断是否存在token文件,不存在则创建
    if (!fs.existsSync(tokenFilePath)) {
        fs.writeFileSync(tokenFilePath, '');
    }
    const packagePath = path.join(configDir, 'package');
    // 判断用户目录下是否存在路径
    if (!fs.existsSync(packagePath)) {
        fs.mkdirSync(packagePath, { recursive: true });
    }
    // 创建用户配置文件目录
    process.env._PORTEX_CONFIG_DIR_ = configDir;
    process.env._PORTEX_CONFIG_TOKEN_FILE_PATH_ = tokenFilePath;
    process.env._PORTEX_CONFIG_PACKAGE_FILE_PATH_ = packagePath;
};
export default hook;
