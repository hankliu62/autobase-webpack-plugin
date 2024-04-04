## autobase-webpack-plugin

创建一个Webpack插件，自动设置基础路径（base）和环境变量。

在 Github Pages 项目中，编译的文件需要加项目repo的前缀

### example

``` js
import webpack from 'webpack';
import AutoBaseWebpackPlugin from 'autobase-webpack-plugin';

export default {
  plugins: [
    AutoBaseWebpackPlugin()
  ]
};
```


