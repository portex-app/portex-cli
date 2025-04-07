import fs from 'node:fs';
import path from 'node:path';
/**
 * Write content to a log file with a timestamped name.
 *
 * @param content - The content to be written into the log file.
 */
export const writeLogFile = (content) => {
    try {
        // Generate a formatted timestamp for the log file name (yyyy_mm_dd_hh_mm_ss)
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const logFileName = `${year}_${month}_${day}_${hours}_${minutes}_${seconds}.log`;
        // Check if the log directory exists under the user's home directory; create it if it does not exist
        const logFilePath = path.join(process.env._PORTEX_CONFIG_DIR_, 'log');
        if (!fs.existsSync(logFilePath)) {
            fs.mkdirSync(logFilePath, { recursive: true });
        }
        console.error('see log file:', logFilePath);
        // Write the provided content to the log file
        const logFileFullPath = path.join(logFilePath, logFileName);
        fs.writeFileSync(logFileFullPath, content);
    }
    catch (error) {
        console.error('log file write error:', error);
    }
};
/**
 * 生成表格配置
 *
 * 此函数用于合并列配置和跨行/跨列单元格配置，生成一个完整的表格配置对象
 * 它允许用户通过参数自定义表格的列和跨行/跨列单元格
 *
 * @param columnsConfig - 列配置对象，用于定义每列的属性
 * @param spanningCells - 跨行/跨列单元格配置数组，默认为空数组
 * @returns 返回一个包含边框样式、列配置和跨行/跨列单元格配置的表格配置对象
 */
export const getTableConfig = (columnsConfig, spanningCells = []) => ({
    // 定义表格边框样式
    border: {
        bodyJoin: `│`,
        bodyLeft: `│`,
        bodyRight: `│`,
        bottomBody: `─`,
        bottomJoin: `┴`,
        bottomLeft: `└`,
        bottomRight: `┘`,
        joinBody: `─`,
        joinJoin: `┼`,
        joinLeft: `├`,
        joinRight: `┤`,
        topBody: `─`,
        topJoin: `┬`,
        topLeft: `┌`,
        topRight: `┐`
    },
    // 使用传入的列配置
    columns: columnsConfig,
    // 使用传入的跨行/跨列单元格配置
    spanningCells,
});
