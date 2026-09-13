// 抽出 admin.html 里的纯函数做冒烟测试（不依赖浏览器）
const fs = require('fs');
const path = 'D:\\我的网站\\admin.html';
const html = fs.readFileSync(path, 'utf8');

const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const start = script.indexOf('var STORE_KEY');
const end = script.indexOf('/* ---------------- 预览 ---------------- */');
if (start < 0 || end < 0) { console.error('切片失败'); process.exit(1); }
const pure = script.slice(start, end);

// 提供最小桩
const sandbox = { $: () => null, toast: () => {}, clearTimeout: () => {}, setTimeout: () => {} };
const fn = new Function('$', 'toast', 'setTimeout', 'clearTimeout', pure + '\n; return { renderBody, esc, inline, buildArticle, buildCard, cnDate };');
const api = fn(sandbox.$, sandbox.toast, sandbox.setTimeout, sandbox.clearTimeout);

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name + (extra ? '\n        ' + extra : '')); }
}

console.log('== 渲染测试 ==');

// 1. 标题 + 段落 + 行内
let r = api.renderBody('## 一、结论\n\n这是一段 **加粗** 和 `代码` 的文字。');
check('h2 生成', r.includes('<h2>一、结论</h2>'), r);
check('段落包裹', r.includes('<p>这是一段 <strong>加粗</strong> 和 <code>代码</code> 的文字。</p>'), r);

// 2. 代码块
r = api.renderBody('```bash\nsudo apt update\n```');
check('代码块结构', r.includes('class="code-block"') && r.includes('<span class="code-lang">bash</span>') && r.includes('sudo apt update'), r);

// 3. callout
r = api.renderBody(':::warn 注意\n这里有 **危险**。\n:::');
check('警告框', r.includes('<div class="callout warn">') && r.includes('<span class="callout-title">注意</span>') && r.includes('<strong>危险</strong>'), r);

// 4. terminal
r = api.renderBody(':::terminal 报错\n$ 命令\n! 错误行\n? 警告行\n# 注释行\n:::');
check('终端窗口', r.includes('class="terminal-bar"') && r.includes('t-prompt') && r.includes('t-err') && r.includes('t-warn') && r.includes('t-dim'), r);

// 5. 表格
r = api.renderBody('| A | B |\n| --- | --- |\n| 1 | 2 |');
check('表格生成', r.includes('<table>') && r.includes('<th>A</th>') && r.includes('<td>1</td>'), r);

// 6. 原始 HTML 透传
r = api.renderBody('<div class="timeline">\n  <div class="tl-item"><span class="tl-date">第一步</span></div>\n</div>');
check('原始 HTML 透传', r.includes('class="timeline"') && r.includes('class="tl-item"') && !r.includes('&lt;div'), r);

// 7. 尖括号散文要被转义（不能当成标签）
r = api.renderBody('把 <包名> 换成你的名字。');
check('散文尖括号被转义', r.includes('&lt;包名&gt;') && !r.includes('<包名>'), r);

// 8. 列表 / 引用
r = api.renderBody('- 甲\n- 乙\n\n> 引用一句');
check('无序列表', r.includes('<ul><li>甲</li><li>乙</li></ul>'), r);
check('引用', r.includes('<blockquote><p>引用一句</p></blockquote>'), r);

// 9. 中文日期
check('中文日期', api.cnDate('2026-08-24') === '2026 年 8 月 24 日', api.cnDate('2026-08-24'));

console.log('== 生成文章测试 ==');
const post = {
  id: 'x1', slug: 'my-post', title: '测试文章', date: '2026-09-01',
  tags: ['智能车', '测试'], summary: '一句话简介。',
  prevTitle: '上一篇文章', nextTitle: '',
  body: '## 小标题\n\n正文 **内容**。'
};
const art = api.buildArticle(post);
check('文章 doctype', art.startsWith('<!DOCTYPE html>'), art.slice(0, 40));
check('文章标题', art.includes('<title>测试文章 - firefly_liu的小家</title>'));
check('文章日期', art.includes('<time datetime="2026-09-01">2026 年 9 月 1 日</time>'));
check('标签渲染', art.includes('<span class="meta-tag">智能车</span>') && art.includes('<span class="meta-tag">测试</span>'));
check('含目录占位', art.includes('<details class="toc" id="toc"></details>'));
check('含正文', art.includes('<h2>小标题</h2>'));
check('含 reading.js', art.includes('js/reading.js'));
check('上一篇链接', art.includes('<span class="nav-title">上一篇文章</span>'));
check('script 标签未被提前闭合', (art.match(/<\/script>/g) || []).length === 4, String((art.match(/<\/script>/g) || []).length));

// 10. 头部/尾部标签配平
const opens = (art.match(/<div\b/g) || []).length;
const closes = (art.match(/<\/div>/g) || []).length;
check('div 配平 (' + opens + '/' + closes + ')', opens === closes);

console.log('== 生成卡片测试 ==');
const card = api.buildCard(post);
check('卡片 data-tags', card.includes('data-tags="智能车 测试"'), card);
check('卡片链接', card.includes('href="articles/my-post.html"'));
check('卡片标签块', card.includes('<div class="card-tags"><span>智能车</span><span>测试</span></div>'));

// 11. 无标签文章回退到「随笔」
const card2 = api.buildCard({ slug: 'a', title: 'T', date: '2026-01-01', tags: [], summary: 's' });
check('空标签回退', card2.includes('data-tags="随笔"'), card2);

console.log('');
console.log('通过 ' + pass + ' 项，失败 ' + fail + ' 项');
process.exit(fail ? 1 : 0);
