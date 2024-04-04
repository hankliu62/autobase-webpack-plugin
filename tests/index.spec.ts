/* eslint-disable @typescript-eslint/no-explicit-any */
import webpack, { DefinePlugin } from 'webpack';
import AutoBaseWebpackPlugin from '../src/index';

const Owner = 'hankliu62';
const Repo = 'autobase-webpack-plugin';

// 在你的测试文件中
describe('createPlugin', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.GITHUB_ACTIONS = "TRUE";
    process.env.GITHUB_REPOSITORY = `${Owner}/${Repo}`;
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
    jest.restoreAllMocks(); // 确保在每个测试后恢复所有mock
  });

  test('set the correct config output public path value', () => {
    const compiler = webpack({
      entry: './entry.js',
      mode: 'production',
      plugins: [new AutoBaseWebpackPlugin()]
    });

    compiler.hooks.afterEnvironment.tap("Test", () => {
      expect(compiler.options.output.publicPath).toEqual(`/${Repo}/`);
    });
  });

  test('set the correct defined env value', () => {
    const compiler = webpack({
      entry: './entry.js',
      mode: 'production',
      plugins: [new AutoBaseWebpackPlugin()]
    });

    compiler.hooks.thisCompilation.tap("Test", (compilation) => {
      const definePlugin: DefinePlugin = compilation.options.plugins.find(
        (plugin) => plugin?.constructor && plugin?.constructor.name === 'DefinePlugin'
      ) as DefinePlugin;

      const expectDefine = {
        ["process.env"]: {
          "ROUTE_PREFIX": `/${Repo}`
        }
      }

      expect(definePlugin).not.toBeNull();
      expect(definePlugin.definitions).not.toBeNull();
      expect(definePlugin.definitions).toMatchObject(expectDefine);
    });
  });
});

