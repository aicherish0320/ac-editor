# AcEditor for HTML5

## `.d.ts`文件

`vite.env.d.ts`是为了 typescript 做的适配定义文件，因为 `.vue`文件不是一个常规类型，ts 是不能理解 vue 文件是干嘛的

```ts
// declare 声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

## 前端工具链

- 静态类型语言
  - typescript
  - flow
- 代码风格检查 linter··
  - 多人协作的弊端，风格各异，维护和扩展的困难
- 包管理器
- 转译器
  - 非 JS 或不同版本的 JS 翻译成 符合平台要求的等价代码
- 打包工具 bundler
  - webpack
  - rollup
  - parcel
- 任务管理工具 Task Runner
  - 自动执行项目所需的重复任务
    - css 预处理
    - 优化图片
    - 合并压缩
    - 文件处理
    - 监听文件变化
  - Gulp
  - webpack
  - npm scripts
- 脚手架
  - 将工具链聚合在一个工具内 **简单、快速、零配置**

## ESLint

是一个开源的 JavaScript 的 linting 工具，使用 espree 将 JavaScript 解析成抽象语法树（AST），然后通过 AST 来分析我们代码。

## Git Flow

所有的这些规范都是针对特定的多人设定的，意在让多人协作的过程更顺畅，更简单，减少不必要的冲突和时间的浪费

## Github Flow
