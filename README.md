# Firefly-liu的博客（静态博客）

一个用纯 HTML + CSS 写的最基础静态博客，可免费部署到 GitHub Pages。

## 文件夹结构

```text
blog/
├── index.html          # 首页（文章列表）
├── about.html          # 关于页
├── articles/           # 文章都放在这里
│   ├── welcome.html
│   ├── static-blog.html
│   └── study-notes.html
├── images/             # 图片资源（背景图）
│   ├── bg-1.jpg
│   ├── bg-2.jpg
│   └── bg-3.jpg
├── css/
│   └── style.css       # 全站样式
└── js/
    └── bg.js           # 随机背景逻辑
```

## 页面效果说明

- 背景图：每次打开页面从 `js/bg.js` 的图片列表里随机选一张。
- 主页顶部、欢迎区、文章卡片：共用 `css/style.css` 里的 `--theme-tint` 颜色（淡粉），
  改这一处三处一起变；顶部遮罩透明度固定 0.7。
- 文章页：正文背后是萤火虫绿遮罩（透明度 40%），颜色在 `css/style.css` 的 `--firefly-green` 变量。
  文章页顶部（导航栏）也跟随变为萤火虫绿（透明度 0.7）。
- 博客卡片：鼠标悬停时卡片变成萤火虫绿，左下角的小图以 2 秒动画向左滑出。
  图片位置和滑动距离用 `css/style.css` 里 `.post-card` 的三个变量调试：
  `--img-x`（左右位置）、`--img-y`（上下位置）、`--slide-left`（向左滑出距离）。

## 用工具发新文章（推荐）

工具位置：`outputs/tools/NewPost.exe`（双击运行）。

1. 双击 `NewPost.exe`，按提示确认博客文件夹（第一次会自动记住）。
2. 输入文章文件名（英文或拼音，如 my-post）、标题、正文。
3. 正文支持多行：空一行表示分段，最后单独输入一行 `END` 结束。
4. 工具会自动用电脑当前日期生成 `articles/文章名.html`，并把新文章卡片插入 `index.html` 列表顶部。
5. 把这两个文件上传到 GitHub 即可。

## 如何修改博客内容

### 改已有文章

1. 打开 `articles/` 下对应的 html 文件。
2. `<h1>…</h1>` 是文章标题，`<time>…</time>` 是日期，正文在 `<div class="article-body">…</div>` 里，直接改文字即可。
3. 保存后重新上传这个文件。

### 发一篇新文章（复制模板最快）

1. 复制 `articles/welcome.html`，重命名为新文章名，比如 `articles/my-post.html`。
2. 改 `<title>`、`<h1>`、`<time>` 和正文内容。
3. 打开 `index.html`，在"最新文章"列表里复制一份卡片：

   ```html
   <article class="post-card">
     <time datetime="2026-08-08">2026 年 8 月 8 日</time>
     <h3><a href="articles/my-post.html">文章标题</a></h3>
     <p>一句话简介。</p>
     <a class="read-more" href="articles/my-post.html">阅读全文 →</a>
   </article>
   ```

4. 把新文章文件和改过的 `index.html` 一起上传到 GitHub。

### 换背景图或加背景图

1. 把图片放到 `images/` 文件夹。
2. 打开 `js/bg.js`，在列表里加文件名，比如改成：

   ```js
   var images = ["bg-1.jpg", "bg-2.jpg", "bg-3.jpg", "bg-4.jpg"];
   ```

3. 上传新图片和 `js/bg.js`。

### 调整遮罩颜色和透明度

打开 `css/style.css`：

- 颜色：改 `--theme-tint`（主页淡粉）和 `--firefly-green`（萤火虫绿）后面的数字（RGB）。
- 透明度：主页顶部遮罩是 `rgba(var(--theme-tint), 0.7)`，文章绿色遮罩是 `rgba(var(--firefly-green), 0.4)`，改 0.7 / 0.4 即可。

## 如何发布到 GitHub Pages

1. 打开 https://github.com/new 新建一个仓库，仓库名必须是：
   `Firefly-liu.github.io`（把 Firefly-liu 换成你的 GitHub 用户名），选择 Public。
2. 在仓库页面点击 "uploading an existing file"，把 `blog` 文件夹里的**所有文件**拖进去上传。
3. 等待一两分钟，然后访问：https://Firefly-liu.github.io

网站上线后，以后每次更新文章：把新文件上传到同一个仓库，网站会自动更新。

## 如何写新文章

1. 复制 `articles/welcome.html` 这个文件，改个新名字，比如 `articles/my-new-post.html`。
2. 修改里面的 `<title>` 和文章正文内容。
3. 打开 `index.html`，把文章信息复制一份加到 "最新文章" 列表里（改日期、标题、简介和链接）。
4. 上传到 GitHub 仓库即可。

> 小提示：以后如果想要更省事的写作流程，可以升级成 Hugo 或 Astro 这类静态站点生成器，
> 只需要写 Markdown 文件，列表和页面会自动生成。
