# koishi-plugin-markdown

koishi-plugin-markdown 提供了 Markdown 的解析与渲染功能。

## 作为插件使用

加载这个插件，它的唯一作用就是提供了名为 `<markdown>` 的组件。这个组件可以解析并渲染 Markdown 文本。你可以将它用于 `echo` 指令、本地化文件、教学问答或者任何你想要的地方。

<chat-panel>
<chat-message nickname="Alice">
<p>echo -E &lt;markdown></p>
<p>![image](https://koishi.chat/logo.png)</p>
<p>&lt;/markdown></p>
</chat-message>
<chat-message nickname="Koishi">
<img src="https://koishi.chat/logo.png" alt="image" width="100"/>
</chat-message>
</chat-panel>

## 作为 API 使用

::: tip
如果你开发的插件使用了这些 API，你只需在 `package.json` 中将 `koishi-plugin-markdown` 添加为 `dependencies`。你不需要手动加载此插件或是声明 `peerDependencies`。
:::

这个插件的另一种使用方式是作为 API。插件开发者如果想要发送 Markdown 文本，可以直接导入 `transform` 方法，将原始文本转换为消息元素：

```ts
import { transform } from 'koishi-plugin-markdown'

session.send(transform('![image](https://koishi.chat/logo.png)'))
```

我们也提供了模板字符串的使用方式：

```ts
import { md } from 'koishi-plugin-markdown'

session.send(md`
  ![image](https://koishi.chat/logo.png)
`)
```
