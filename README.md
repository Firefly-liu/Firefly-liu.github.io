# firefly_liu的小家（静态博客 · 维护版）

纯 HTML + CSS 的静态博客，可以直接上传到 GitHub Pages 免费托管。
本目录是**唯一维护目录**，所有改动都在这里做。

---

## 内容归因约定（重要）

ROS 相关的技术记录是**两届队员接力**的成果，写文章时必须区分来源，不要混为一谈：

| 标注 | 含义 |
|---|---|
| <span>前届记录</span> | **2025 年 9 月 19 日之前**对原始 `ros日志.txt` 的记载，是上一届交接的内容 |
| <span>我的实践</span> | **2025 年 9 月 19 日之后**的记录，是我自己接手后写的 |

具体做法：

- 文章标题下方用一个「内容来源说明」提示框列出各小节归属；
- 每个 `<h2>` / `<h3>` 标题后面加徽标，写法为
  `<span class="src-badge src-prev">前届记录</span>` 或
  `<span class="src-badge src-mine">我的实践</span>`；
- 徽标会自动从目录（TOC）与锚点里剔除，不会污染目录文字；
- **写正文时不要把前届的经历写成"我"的经历**，改成"前一届""前届日志里"。

---

## 一、目录结构

```text
我的网站/
├── index.html            # 首页（搜索首屏 + 博客/文件分享/关于三个区块）
├── ros.html              # 智能车 / ROS 项目专题页
├── about.html            # 关于页
├── intro.html            # 自我介绍页
├── files.html            # 文件分享页
├── 404.html              # 404 页面
├── README.md             # 本文件
│
├── articles/             # 所有文章
│   ├── ros-env.html              # 01 环境搭建踩坑实录
│   ├── ros-voice.html            # 02 语音交互
│   ├── ros-nav.html              # 03 导航与建图
│   ├── ros-vision.html           # 04 视觉：YOLOv8 训练与 RKNN 部署
│   ├── ros-ocr.html              # 05 把 OCR 搬上 NPU
│   ├── ros-competition.html      # 06 比赛记录与复盘
│   ├── welcome.html              # 欢迎来到我的博客
│   ├── static-blog.html          # 为什么选择静态博客
│   └── study-notes.html          # 学习笔记示例
│
├── css/
│   └── style.css         # 全站样式（含阅读增强组件）
│
├── js/
│   ├── bg.js             # 随机背景图
│   ├── main.js           # 回到顶部、时钟、区块切换、灯箱、页脚天数等
│   ├── effects.js        # 星空 / 萤火虫 / 流星 / 点击爆发 / 鼠标拖尾
│   └── reading.js        # 文章目录、代码复制、阅读时长、标签筛选
│
├── images/
│   ├── desktop/          # 电脑端横屏背景 d-1 ~ d-15
│   ├── mobile/           # 手机端竖屏背景 m-1 ~ m-18
│   ├── deco/             # 透明装饰图 firefly-stand.png / firefly-bubble.png
│   ├── emote/            # 表情包（自我介绍页用）
│   └── *.png / *.gif     # 图标、头像、卡片装饰
│
└── tools/
    └── optimize-images.ps1   # 背景图批量压缩工具
```

> 管理台**不在**这个目录里，单独放在 `D:\网站管理\`，这样上传站点时不会误传。
> 该目录下有 `admin.html`（管理台）和 `test-admin.js`（它的回归测试）。

---

## 二、用管理台写文章（推荐）

**用法**：双击 `D:\网站管理\admin.html`，用 Chrome 或 Edge 打开即可，不需要装任何东西、也不需要启动服务器。

界面上有：

| 区域 | 作用 |
|---|---|
| 顶部 · 站点目录 | 告诉它站点在哪个文件夹（默认 `D:\我的网站`），预览靠它加载全站样式 |
| 左栏 · 编辑 | 文件名、日期、标签、标题、简介、上一篇 / 下一篇标题、正文 |
| 右栏 · 实时预览 | 直接用全站样式渲染，所见即所得 |
| 生成结果 | 「下载文章 HTML」「复制文章 HTML」「复制首页卡片」 |
| 文章列表 | 保存下来的文章，可编辑 / 上下排序 / 删除 / 单独下载 |

**完整流程**：

1. 双击 `D:\网站管理\admin.html` → 确认顶部「站点目录」是 `D:\我的网站` → 填表单 → 写正文；
2. 点「保存到文章列表」（数据存在浏览器里，**记得偶尔点「导出 JSON」备份**）；
3. 点「下载文章 HTML」，把下载到的 `<文件名>.html` 放进 `articles/` 目录；
4. 点「复制首页卡片」，粘贴进 `index.html` 的「最新文章」区块（想一次全粘就点「复制全部首页卡片」）；
5. 上传 `articles/` 里的新文件和改过的 `index.html`。

> **注意**：管理台已经放在站点目录之外了，正常上传整个 `D:\我的网站` 不会被带上去。

### 正文简写语法

| 写法 | 效果 |
|---|---|
| `## 标题` / `### 小标题` | 二 / 三级标题（自动进目录） |
| `- 项目` / `1. 项目` | 无序 / 有序列表 |
| `> 文字` | 引用块 |
| `**加粗**` `*斜体*` `` `代码` `` | 行内格式 |
| `[文字](链接)` | 超链接 |
| ` ```bash ` … ` ``` ` | 代码块（带语言标签和复制按钮） |
| `:::warn 标题` … `:::` | 提示框，类型可选 `warn` / `danger` / `tip` / `info` |
| `:::terminal 标题` … `:::` | macOS 风格终端窗口 |
| `\| A \| B \|` + 分隔行 | 表格 |
| `---` | 分隔线 |
| 以 `<div` `<table` 等标签开头的行 | 原样输出，可以直接写复杂 HTML（时间线、项目卡片等） |

终端窗口里还可以用行首标记上色：`$ `（命令，绿）、`! `（错误，红）、`? `（警告，黄）、`# `（注释，灰）。

**如果预览区没有样式**：先确认顶部「站点目录」填对了（默认 `D:\我的网站`）；再换 Chrome / Edge 打开（Firefox 对 `file://` 的限制更严）；或者直接看「生成结果」里的 HTML。

**跑回归测试**（改了管理台代码之后）：

```powershell
node "D:\网站管理\test-admin.js"
```

---

## 三、怎么发一篇新文章（手动方式）

### 方法一：复制模板

1. 复制 `articles/ros-env.html`，重命名为新文件名（英文或拼音，如 `my-post.html`）。
2. 用记事本或 VS Code 打开，改这几处：
   - `<title>新标题 - firefly_liu的小家</title>`
   - `<h1>新标题</h1>`
   - `<time datetime="2026-09-01">2026 年 9 月 1 日</time>`
   - `<div class="article-body"> ... </div>` 里的正文
   - `.article-meta` 里的标签和阅读时长
   - `<nav class="post-nav">` 里的上一篇/下一篇链接
3. 打开 `index.html`，在 `最新文章` 区块里复制一张卡片，改链接、日期、标题、简介和标签：

```html
<article class="post-card" data-tags="随笔">
  <time datetime="2026-09-01">2026 年 9 月 1 日</time>
  <h3><a href="articles/my-post.html">文章标题</a></h3>
  <p>一句话简介。</p>
  <div class="card-tags"><span>随笔</span></div>
  <a class="read-more" href="articles/my-post.html">阅读全文 <span class="arrow">→</span><img class="read-more-icon" src="images/target_two.png" alt=""></a>
  <img class="card-img" src="images/left_div_img.png" alt="">
</article>
```

> `data-tags` 决定标签筛选：多个标签用空格分隔，例如 `data-tags="智能车 导航"`。
> 想新增一个筛选按钮，就在 `.tag-filter` 里加一个 `<button class="tag-btn" data-tag="你的标签">`。

### 方法二：用旧的 `NewPost.exe`

它在原来的 `outputs/tools/` 里，能自动生成文章并更新首页列表，但它认的是旧版首页结构。
**建议只用它生成正文，然后把卡片手动粘进 `index.html`。**

---

## 四、正文里可以用的写法

### 小标题（会自动进目录）

```html
<h2>一级小标题</h2>
<h3>二级小标题</h3>
```

只要文章里有 `<details class="toc" id="toc"></details>`，脚本就会自动生成目录、并随滚动高亮当前章节。

### 代码块（带语言标签 + 一键复制）

```html
<div class="code-block">
  <div class="code-head"><span class="code-lang">bash</span><button class="code-copy" type="button">复制</button></div>
  <pre><code>sudo apt update</code></pre>
</div>
```

> 直接写裸的 `<pre><code>...</code></pre>` 也可以，脚本会自动补上标题栏和复制按钮。

### 终端输出 / 报错

```html
<div class="terminal">
  <div class="terminal-bar"><i></i><i></i><i></i><span>报错信息</span></div>
  <div class="terminal-body">普通文字
<span class="t-prompt">$ 提示符</span>
<span class="t-err">红色错误</span>
<span class="t-warn">黄色警告</span>
<span class="t-dim">灰色注释</span></div>
</div>
```

### 提示框

```html
<div class="callout"><span class="callout-title">标题</span><p>内容</p></div>
```

`class` 可选：`info`（绿，默认）、`warn`（黄）、`danger`（红）、`tip`（蓝）。

### 表格

用标准 `<table>`，外面套一层 `<div class="table-wrap">` 以便手机上横向滚动。

### 时间线

```html
<div class="timeline">
  <div class="tl-item">
    <span class="tl-date">2026 年 9 月</span>
    <div class="tl-body">
      <h3>节点标题</h3>
      <p>节点内容。</p>
    </div>
  </div>
</div>
```

### 其他

| 效果 | 写法 |
|---|---|
| 数据大数字 | `<div class="stat-row"><div class="stat"><b>13</b><span>说明</span></div></div>` |
| 项目卡片 | `<div class="project-grid"><div class="project-card"><h3>标题</h3><p>说明</p><div class="tech-badges"><span class="tech-badge">ROS</span></div></div></div>` |
| 标签 | `<span class="tag">标签</span>` |
| 按键 | `<kbd>Win</kbd>` |
| 表情包网格 | `<div class="emote-grid"><div class="emote-item"><img src="images/emote/idle.jpg" alt=""><span>待机</span></div></div>` |
| 文章底部装饰 | `<img class="article-deco" src="../images/deco/firefly-stand.png" alt="">` |

---

## 五、换背景图 / 加背景图

### 一、把图放进去

- 电脑端横屏图 → `images/desktop/`
- 手机端竖屏图 → `images/mobile/`

图太大必须压缩，直接跑工具：

```powershell
# 右键 tools\optimize-images.ps1 → 使用 PowerShell 运行
```

工具会读取 `D:\图片\流萤`，按清单压缩后写入 `images/`。要换成自己的图片，用记事本打开脚本，改这两处：

```powershell
$SOURCE_DIR = "D:\图片\流萤"     # 你的图片目录
```

然后按格式在 `$desktop` / `$mobile` 列表里加一行：

```powershell
@{ src = "你的图片.jpg"; out = "images\desktop\d-16.jpg" },
```

> 如果脚本双击运行报"字符串缺少终止符"，说明文件被存成了不带 BOM 的 UTF-8。
> 用 VS Code 打开 → 另存为 → 编码选「UTF-8 with BOM」即可。

### 二、在列表里登记

打开 `js/bg.js`，在对应数组里加一行：

```js
var desktopImages = [ ..., "desktop/d-16.jpg" ];
var mobileImages  = [ ..., "mobile/m-19.jpg" ];
```

> **注意**：`bg.js` 是按屏幕宽度（768px）二选一的。手机图片列表里只放竖图，否则会被裁得很难看。

---

## 六、改颜色 / 特效开关

打开 `css/style.css`，最上面的 `:root` 里集中了所有可调项：

| 变量 | 作用 |
|---|---|
| `--theme-tint` | 主页主题色（淡粉）：顶部遮罩、欢迎区、文章卡片一起变 |
| `--firefly-green` | 萤火虫绿：文章页底色、悬停色 |
| `--accent` | 链接、按钮、时间标签的主题色 |
| `--night` | 全站暗化程度，`0` = 不变暗，`1` = 全黑 |
| `--night-content` | 前景卡片暗化程度，默认是 `--night` 的一半 |

**想彻底关掉特效**：把页面底部 `<script src="js/effects.js" defer></script>` 这一行删掉即可。

---

## 七、发布到 GitHub Pages

1. 打开 https://github.com/new 新建仓库，仓库名必须是 `Firefly-liu.github.io`（换成你的 GitHub 用户名），选 Public。
2. 把本目录（`D:\我的网站`）里的**所有文件和文件夹**上传上去。
3. 等一两分钟，访问 `https://Firefly-liu.github.io`。

> 每次更新：把改动的文件重新上传即可，网站会自动更新。

### 改了 CSS / JS 之后访客还看到旧样式？——版本号

所有页面的引用都带了一个版本参数：

```html
<link rel="stylesheet" href="css/style.css?v=1">
<script src="js/reading.js?v=1" defer></script>
```

原因：GitHub Pages 会给静态资源发 `Cache-Control: max-age=600`，改完 CSS 后**浏览器可能十分钟内仍用旧文件**，表现就是"网页结构是新的、但样式是旧的"。

**所以每次改完 `css/style.css` 或 `js/*.js`，把 `?v=1` 里的数字 +1**（全站统一改成 `?v=2`、`?v=3`……），访客下次打开就会立刻拿到新文件。

批量改版本号的办法：用 VS Code 在 `D:\我的网站` 目录里**全局替换** `?v=1` → `?v=2` 即可（管理台生成的文章模板里也有一份，别漏）。

---

## 八、注意事项

- 本目录里的文章**不含任何密钥、账号、令牌信息**，所有配置项都用占位符（如 `你的APPID`）表示。往文章里贴命令时，请把真实密钥替换成占位符再上传。
- 管理台放在 `D:\网站管理\`（站点目录之外），所以上传整个 `D:\我的网站` 时不会把它带上去。
- 不要直接把 `D:\ROS` 里的原始日志整份拷进站点——里面有真实密钥和个人内容，只上传脱敏后的成稿。
- `D:\ROS` 只作只读参考资料，不要修改它。
- 文件命名尽量用英文或拼音，避免中文文件名在某些服务器上出现乱码。
- ROS 专题的文章要遵守上面的「内容归因约定」，不能把前届的经历写成自己的。

---

## 九、后续计划

- [x] 网页版管理台（写在 `D:\网站管理\admin.html`：写作 + 实时预览 + 生成文章卡片 + 文章列表管理 + JSON 导出/导入）
- [x] ROS 技术专题（6 篇 + 专题页 `ros.html`）
- [x] 阅读增强（自动目录、代码复制、标签筛选、时间线、提示框等）
- [x] CSS / JS 加缓存版本号，避免改了样式访客看不到
- [ ] 想加英文版或分页时再考虑换成静态站点生成器（Hugo / Astro）

---

## 十、常见问题

**Q：管理台打开后预览区没有样式？**
先确认顶部「站点目录」填的是 `D:\我的网站`（管理台在 `D:\网站管理\`，预览需要靠这个路径去找 `css/style.css`）；再换 Chrome 或 Edge 打开（Firefox 对 `file://` 的限制更严）；或者忽略预览，直接看「生成结果」区域的 HTML。

**Q：管理台里的文章列表不见了？**
数据存在浏览器 localStorage 里，清缓存、换浏览器或换电脑都会丢。所以每隔一段时间点「导出 JSON」把 `firefly-posts-日期.json` 存到别处。

**Q：图片放在哪？**
正文里引用写 `../images/xxx.jpg`（文章在 `articles/` 里，所以要往上跳一层）。图片文件放进 `images/`。

**Q：改了 CSS 之后所有页面都变了？**
是的，全站共用一个 `css/style.css`。改之前建议先复制一份备份成 `style.css.bak`。

**Q：本地看着是新的，线上还是旧的？**
两种可能：一是浏览器缓存 —— 按 <kbd>Ctrl</kbd>+<kbd>F5</kbd> 强制刷新，或开无痕窗口；二是文件没传上去 —— 打开 <kbd>F12</kbd> 看 Network 里 `style.css` 是不是 404 / 是不是旧内容。改完 CSS 记得把 `?v=1` 数字 +1（见第七节）。

**Q：怎么临时预览整站？**
在 `D:\我的网站` 目录里执行 `python -m http.server 8000`，然后浏览器打开 `http://127.0.0.1:8000`（需要本机有 Python）。
