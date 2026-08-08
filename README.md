# 我的博客（静态博客）

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
├── images/             # 图片资源
│   └── firefly.jpg     # 全站背景图
└── css/
    └── style.css       # 全站样式
```

> 背景图在 `css/style.css` 的 `body` 规则里引用（`url("../images/firefly.jpg")`）。
> 背景完全透明显示，没有遮罩。如果某处文字在图上看不清，可以给该区域加浅色背景或文字阴影。

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
