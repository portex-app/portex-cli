import { Hook } from '@oclif/core';
/**
 * @description 在 CLI 完成初始化之后，找到对应命令之前,初始化配置文件
 * @param opts 包含 CLI 初始化时传递的配置信息，包括配置目录路径等
 */
declare const hook: Hook<'init'>;
export default hook;
