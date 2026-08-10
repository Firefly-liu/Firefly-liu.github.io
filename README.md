# Firefly-liu的博客（静态博客）

一个用纯 HTML + CSS 写的最基础静态博客，可免费部署到 GitHub Pages。

## 文件夹结构

```text
blog/
├── index.html          # 首页（搜索首屏 + 博客/文件分享/关于三个区块）
├── about.html          # 关于页
├── files.html          # 文件分享页（EteDrop 下载 + 常用链接卡片）
├── intro.html          # 自我介绍页（置顶卡片点进去）
├── 404.html            # 404 页面（迷路的萤火虫）
├── articles/           # 文章都放在这里
│   ├── welcome.html
│   ├── static-blog.html
│   └── study-notes.html
├── images/             # 图片资源（背景图）
│   ├── bg-1.jpg
│   ├── bg-2.jpg
│   ├── bg-3.jpg
│   ├── bg-4.jpg
│   ├── desktop/        # 电脑端横屏背景（d-1.jpg ~ d-7.jpg）
│   ├── mobile/         # 手机端竖屏背景（m-1.jpg ~ m-13.jpg）
│   └── emote.gif       # 404 页装饰动图
├── css/
│   └── style.css       # 全站样式
└── js/
    ├── bg.js           # 随机背景逻辑
    └── main.js         # 回到顶部按钮等交互
```

## 页面效果说明

- 首页第一屏是整屏搜索页（Bing 搜索框 + B站/GitHub 等快捷方式），往下滑进入内容区；
  内容区有"博客（默认）/文件分享/关于"三个可切换区块，导航和地址栏 `#files` / `#about` 可直达。
- 背景图：电脑访问从 `images/desktop/` 随机选横屏图，手机访问从 `images/mobile/` 随机选竖屏图
  （`js/bg.js` 按屏幕宽度判断，<768px 视为手机）。
- 页面加载：整页从下方滑入（`css/style.css` 的 `pageUp` 动画）。
- 内容区顶部的切换标签是细虚线分隔 + 低调文字样式（不再是大黑条）。
- 主页顶部、欢迎区、文章卡片：共用 `css/style.css` 里的 `--theme-tint` 颜色（淡粉），
  改这一处三处一起变；顶部遮罩透明度固定 0.7。
- 文章页：正文背后是萤火虫绿遮罩（透明度 70%），颜色在 `css/style.css` 的 `--firefly-green` 变量。
  文章页顶部（导航栏）也跟随变为萤火虫绿（透明度 0.7）。
- 博客卡片：鼠标悬停时卡片变成萤火虫绿，左下角的小图以 2 秒动画向左滑出。
  图片位置和滑动距离用 `css/style.css` 里 `.post-card` 的三个变量调试：
  `--img-x`（左右位置）、`--img-y`（上下位置）、`--slide-left`（向左滑出距离）。
- 页面右下角有"回到顶部"按钮，滚动超过一屏后出现。
- 主题色（链接、按钮、时间标签等）为萤火虫绿系，变量是 `--accent`。
- 夜晚效果：全站有一层暗化遮罩，强度在 `css/style.css` 的 `--night` 变量（0.28），
  0 = 不变暗，1 = 全黑。
- 特效（`js/effects.js`）：
  - 星空粒子背景（画布闪烁星光，手机端数量减半）
  - 萤火虫光点只出现在页面左右两侧（动画 4–9 秒来回）
  - 流星划过夜空（随机出现，3 颗轮番划过）
  - 点击爆发：一圈萤光圆环 + 10 个四散的光点
  - 鼠标拖尾（仅鼠标设备，手机/平板自动关闭）
  - 卡片悬停绿光（卡片左下角图片动画为 1 秒）
- 文字发光（`css/style.css` 的 `textGlow`）：站点名、欢迎标题、文章标题带萤火虫绿呼吸光晕。
- 页面切换动画（`js/main.js`）：点击站内链接时，页面先暗化过渡再跳转，加载后淡入。
- 阅读进度条：页面顶部一条萤光绿进度线，随滚动增长。
- 图片灯箱：点击文章里的图片会全屏放大查看，点空白或按 Esc 关闭。
- 站点标识：标签页标题为"firefly_liu的小家"；标签页图标是 `images/target_one.png`，
  切换到后台时自动换成 `images/test.png`，标题变成"小家会一直等你回来zzZ"
  （`js/main.js` 用 Page Visibility 检测，回到页面后恢复）。
- "阅读全文 →"：悬停按钮时，箭头 `→` 会换成 `images/target_two.png` 小图标。
- 首页置顶卡片："我的自我介绍"，和文章卡片同款样式，可点击进入 `intro.html`；
  左侧是动图头像 `images/dt.gif`，右上角是低调的"置顶"字样（内容在 `index.html` 改）。
- 首页搜索框：界面是自己的，搜索交给 Bing（提交到 `https://cn.bing.com/search`，
  新标签页打开结果页）。想换成国际版 Bing，把 `index.html` 里的 `cn.bing.com` 改成 `www.bing.com`。
- 电脑端（≥1200px）左右两侧有竖排装饰文字：左边"firefly_liu的小家"、
  右边"流萤为引 · 照亮前路"；大屏内容宽度自动从 760px 放宽到 860px。
- 页脚：标语"流萤为引，照亮前路"+ 建站运行天数自动计算。
- 博客卡片右上角有淡色的序号（01、02、03…）。
- 回到顶部按钮带脉冲光圈。
  如果系统开启"减弱动态效果"，特效会自动关闭；想彻底去掉，把页面里
  `<script src="js/effects.js">` 这行删掉即可。
- 顶部右上角有实时时钟，每秒更新，显示"现在是X月X日早上/下午X点X分X秒"（手机端隐藏日期部分）。

## 用工具发新文章（推荐）

工具位置：`outputs/tools/NewPost.exe`（Windows 图形界面，双击打开）。

1. 双击 `NewPost.exe` 打开窗口。
2. 填写博客文件夹（第一次填好后会自动记住，也可以点"浏览…"选择）、
   文件名（英文或拼音，如 my-post）、文章标题，选择正文字号。
3. 在正文框里写内容，支持以下写法：

   - 空一行 = 分段
   - `## 小标题` = 小标题
   - `> 引用文字` = 引用
   - `- 列表项` = 列表
   - `**加粗**` / `*斜体*` = 加粗 / 斜体
   - 图片：点"插入图片…"选择，或直接把图片文件拖进正文框，工具会自动复制图片到 `images/` 并插入文章

4. 点"生成文章"，工具用电脑当前日期生成 `articles/文章名.html`，
   并自动更新 `index.html`（默认还会在浏览器打开预览）。
5. 按提示把新文章、改过的 `index.html`，以及新增的图片文件一起上传到 GitHub 即可。

> 文章里的图片显示样式（圆角、最大宽度）由 `css/style.css` 的 `.article-body img` 控制；
> 全站正文字号默认在 `.article-body`（16.5px），工具里设置的字号只对那一篇文章生效。

## 如何修改博客内容

### 添加快捷方式（搜索页下方）

打开 `index.html`，找到"快捷方式"那一块（`class="quick-links"`），
复制一行并改网址和名字即可：

```html
<a class="quick-link" href="https://example.com" target="_blank" rel="noopener">示例站</a>
```

### 添加背景图（电脑/手机分开）

1. 电脑横屏图放进 `images/desktop/`，手机竖屏图放进 `images/mobile/`（建议先用工具压缩成网页大小）。
2. 打开 `js/bg.js`，在对应列表里加一行，例如：

   ```js
   var desktopImages = [ ..., "desktop/你的图片.jpg" ];
   var mobileImages  = [ ..., "mobile/你的图片.jpg" ];
   ```

3. 上传新图片和 `js/bg.js` 即可。

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
- 透明度：主页顶部遮罩是 `rgba(var(--theme-tint), 0.7)`，文章绿色遮罩是 `rgba(var(--firefly-green), 0.7)`，改 0.7 即可。

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
