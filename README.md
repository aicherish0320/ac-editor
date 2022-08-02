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

## Vue 组件的三种形式

- SFC 单文件组件（混合三种标签，返回 vue 的 template）
- 函数组件 Function Component（函数形式，使用 jsx 或者 h 函数）
- render function （对象形式，使用对象上的 render 方法返回，使用 jsx 或者 h 函数）

## 文件上传

### 传统模式

```html
<form method="post" enctype="multipart/form-data">
  <input type="file" />
</form>
```

### 使用异步 API 上传

- ajax
- fetch

### 拖拽上传

- `dragover` 和 `dragleave` 添加或者删除对应的 class
- `drop` 事件拿到正在被拖拽的文件，删除 class 并且触发上传

### 图片预览的方式

- `URL.createObjectURL()`
  - 一个静态方法，创建一个 DOMString，返回一个 URL，URL 和 document 绑定，表示指定的 File 对象
- `FileReader.readAsDataURL()`

### Vue3 的三种实例

- `App Instance` 应用实例 createApp
- `Component Instance` 组件实例 ref 或者 app.mount 返回
- `Component Internal Instance` 组件内部实例 getInternalInstance

## 列表排序

- 拖动开始(dragstart)
  - 被拖动图层的变化
  - 会出现一个浮层
- 拖动进行中(dragmove)
  - 浮层会随着鼠标移动
  - 条目发生“换位”
- 松开鼠标阶段(drop)
  - 浮层消失
  - 被拖动图层状态复原
  - 数据被更新
