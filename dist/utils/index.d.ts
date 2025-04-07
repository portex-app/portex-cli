import { ColumnUserConfig, Indexable, SpanningCellConfig, TableUserConfig } from 'table';
/**
 * Write content to a log file with a timestamped name.
 *
 * @param content - The content to be written into the log file.
 */
export declare const writeLogFile: (content: string) => void;
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
export declare const getTableConfig: (columnsConfig: Indexable<ColumnUserConfig>, spanningCells?: SpanningCellConfig[]) => TableUserConfig;
