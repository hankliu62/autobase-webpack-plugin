import { Compiler, Compilation, DefinePlugin } from 'webpack';

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

export class AutoBaseWebpackPlugin {
  prefix?: string
  private isGithubActions?: boolean;
  constructor(opts?: Options) {
    this.prefix = opts?.prefix || (process.env?.GITHUB_REPOSITORY || "").replace(/.*?\//, "");

    // 检测是否在Github Actions环境中运行
    this.isGithubActions = !!(process.env?.GITHUB_ACTIONS || false);
  }
  apply(compiler: Compiler): void {
    const mode = compiler.options.mode;

    compiler.hooks.afterEnvironment.tap('AutoBaseWebpackPlugin', () => {
      // 根据命令模式（构建或开发）自动调整配置
      if (mode === 'production') {
        // 生产模式下的逻辑
        if (this.isGithubActions) {
          // 在Github Actions环境中自动设置base路径
          if (this.prefix) {
            // 用于为静态资源（如图像、样式表、JavaScript 文件等）设置 URL 前缀
            // 这在将应用部署到自定义域名或 CDN 上时特别有用，因为它允许您将静态资源存储在不同的位置
            // 设置publicPath路径，用于静态资源的URL前缀
            compiler.options.output.publicPath = `/${this.prefix}/`;
          }
        }
      }
    });

    compiler.hooks.thisCompilation.tap('AutoBaseWebpackPlugin', (compilation: Compilation) => {
      // 根据命令模式（构建或开发）自动调整配置
      if (mode === 'production' && this.isGithubActions) {
        // 生产模式下的逻辑
        // 获取DefinePlugin的定义
        const definePlugin = compilation.options.plugins.find(
          (plugin) => plugin?.constructor && plugin?.constructor.name === 'DefinePlugin'
        );

        if (definePlugin) {
          // DefinePlugin的options属性包含了所有定义的值
          // 设置process.env.ROUTE_PREFIX的值为 prefix
          (definePlugin as DefinePlugin).definitions['process.env.ROUTE_PREFIX'] = JSON.stringify(`/${this.prefix}`);
        } else {
          // 不存在，直接添加插件
          // 设置process.env.ROUTE_PREFIX的值为 prefix
          const definePlugin = new DefinePlugin({
            'process.env.ROUTE_PREFIX': JSON.stringify(`/${this.prefix}`),
          });

          // 调用DefinePlugin的apply方法将其应用到编译上下文中
          definePlugin.apply(compiler);
        }
      }
    });
  }
}

export default AutoBaseWebpackPlugin;
