import { Compiler } from 'webpack';
export interface Options {
    /**
     * 自定义前缀
     */
    prefix?: string;
}
/**
 * 创建一个webpack插件，自动设置基础路径（base）和环境变量。
 *
 * 在 Github Pages 项目中，编译的文件需要加项目repo的前缀
 *
 * @example
 * ```js
 * import { defineConfig } from 'vite';
 * import AutoBaseWebpackPlugin from 'autobase-webpack-plugin';
 *
 * export default {
 *   plugins: [
 *     AutoBaseWebpackPlugin()
 *   ]
 * };
 * ```
 *
 * @param opts 选项，包括自定义前缀。
 * @returns 返回一个Vite插件对象。
 */
export declare class AutoBaseWebpackPlugin {
    prefix?: string;
    private isGithubActions?;
    constructor(opts?: Options);
    apply(compiler: Compiler): void;
}
export default AutoBaseWebpackPlugin;
