import AutoBaseWebpackPlugin from '../src/index';

const Repo = 'autobase-webpack-plugin';

describe('validation', () => {
  test('validation create plugin', () => {
    expect(() => {
      new AutoBaseWebpackPlugin({ prefix: Repo });
    }).not.toThrow();

    expect(() => {
      new AutoBaseWebpackPlugin();
    }).not.toThrow();
  })
})
