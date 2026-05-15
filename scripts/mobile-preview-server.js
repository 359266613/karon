const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const { URL } = require('url');

const rootDir = path.resolve(__dirname, '..');
const siteDir = path.join(rootDir, 'ksp.karon.cn');
const injectCssPath = path.join(rootDir, 'android-wrapper', 'app', 'src', 'main', 'assets', 'ksp-mobile-inject.css');
const injectJsPath = path.join(rootDir, 'android-wrapper', 'app', 'src', 'main', 'assets', 'ksp-mobile-inject.js');

const port = Number(process.env.PORT || 5173);
const targetOrigin = process.env.KSP_TARGET || 'https://ksp.karon.cn';

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    ...headers
  });
  res.end(body);
}

function safeJoin(baseDir, requestPath) {
  const normalizedPath = decodeURIComponent(requestPath.split('?')[0]).replace(/^\/+/, '');
  const filePath = path.resolve(baseDir, normalizedPath || 'desk');
  if (!filePath.startsWith(baseDir)) return null;
  return filePath;
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function injectApkAssets(html) {
  const css = readText(injectCssPath);
  const js = readText(injectJsPath);
  const styleTag = `<style id="ksp-apk-preview-style">\n${css}\n</style>`;
  const scriptTag = `<script id="ksp-apk-preview-script">\n${js}\n</script>`;
  const markerTag = '<script>document.documentElement.classList.add("ksp-preview","ksp-apk-preview");</script>';

  let output = html;
  output = output.replace(/<\/head>/i, `${styleTag}\n${markerTag}\n</head>`);
  output = output.replace(/<\/body>/i, `${scriptTag}\n</body>`);

  if (output === html) {
    output = `${styleTag}\n${markerTag}\n${html}\n${scriptTag}`;
  }

  return output;
}

function rewriteProxyHtml(html) {
  return html
    .replace(/(href|src|action)=(['"])\/(?!\/)/gi, '$1=$2/apk-proxy/')
    .replace(/url\(\/(?!\/)/gi, 'url(/apk-proxy/')
    .replace(new RegExp(targetOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '/apk-proxy');
}

function serveStatic(res, requestPath, shouldInject) {
  let filePath = safeJoin(siteDir, requestPath);
  if (!filePath) {
    send(res, 403, 'Forbidden', { 'Content-Type': 'text/plain; charset=utf-8' });
    return true;
  }

  if (!fs.existsSync(filePath)) {
    const withoutLeadingSlash = requestPath.replace(/^\//, '');
    if (!path.extname(withoutLeadingSlash)) {
      filePath = path.join(siteDir, withoutLeadingSlash);
    }
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return false;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  if (shouldInject && (ext === '' || ext === '.html' || ext === '.htm')) {
    const html = injectApkAssets(readText(filePath));
    send(res, 200, html, { 'Content-Type': 'text/html; charset=utf-8' });
    return true;
  }

  res.writeHead(200, {
    'Cache-Control': 'no-store',
    'Content-Type': contentType
  });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

function proxyRequest(req, res, proxyPath) {
  const targetUrl = new URL(proxyPath || '/desk', targetOrigin);
  const headers = { ...req.headers };
  headers.host = targetUrl.host;
  delete headers['accept-encoding'];

  const client = targetUrl.protocol === 'https:' ? https : http;
  const proxyReq = client.request(targetUrl, {
    method: req.method,
    headers
  }, proxyRes => {
    const chunks = [];
    proxyRes.on('data', chunk => chunks.push(chunk));
    proxyRes.on('end', () => {
      const body = Buffer.concat(chunks);
      const contentType = proxyRes.headers['content-type'] || '';
      const headersOut = { ...proxyRes.headers };

      delete headersOut['content-encoding'];
      delete headersOut['content-length'];
      headersOut['cache-control'] = 'no-store';

      if (headersOut.location) {
        headersOut.location = headersOut.location.replace(targetOrigin, '/apk-proxy');
      }

      if (headersOut['set-cookie']) {
        headersOut['set-cookie'] = headersOut['set-cookie'].map(cookie => (
          cookie
            .replace(/;\s*Domain=[^;]+/ig, '')
            .replace(/;\s*Secure/ig, '')
            .replace(/;\s*SameSite=None/ig, '; SameSite=Lax')
        ));
      }

      if (contentType.includes('text/html')) {
        const html = injectApkAssets(rewriteProxyHtml(body.toString('utf8')));
        send(res, proxyRes.statusCode || 200, html, {
          ...headersOut,
          'Content-Type': 'text/html; charset=utf-8'
        });
        return;
      }

      res.writeHead(proxyRes.statusCode || 200, headersOut);
      res.end(body);
    });
  });

  proxyReq.on('error', error => {
    send(res, 502, `Proxy error: ${error.message}`, { 'Content-Type': 'text/plain; charset=utf-8' });
  });

  req.pipe(proxyReq);
}

function renderHome() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>KSP 移动端 UI 预览</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #eef1f5; color: #172033; }
    .page { min-height: 100vh; display: grid; grid-template-columns: 320px 1fr; gap: 24px; padding: 24px; box-sizing: border-box; }
    .panel { background: #fff; border-radius: 18px; padding: 20px; box-shadow: 0 10px 30px rgba(18, 38, 63, .08); }
    h1 { margin: 0 0 8px; font-size: 22px; }
    p { line-height: 1.7; color: #526071; }
    a.button { display: block; margin: 12px 0; padding: 12px 14px; border-radius: 12px; background: #2780B3; color: #fff; text-decoration: none; font-weight: 600; }
    a.button.secondary { background: #596579; }
    code { background: #f2f4f7; padding: 2px 6px; border-radius: 6px; }
    .phone { width: 390px; height: 844px; margin: 0 auto; padding: 14px; border-radius: 38px; background: #111827; box-shadow: 0 20px 50px rgba(0,0,0,.25); }
    .screen { width: 100%; height: 100%; border: 0; border-radius: 28px; background: #fff; }
    @media (max-width: 900px) { .page { grid-template-columns: 1fr; padding: 12px; } .phone { width: min(390px, calc(100vw - 24px)); height: 78vh; } }
  </style>
</head>
<body>
  <main class="page">
    <section class="panel">
      <h1>KSP 移动端 UI 预览</h1>
      <p>推荐用 Chrome 打开本页，然后按 <code>F12</code>，切换设备工具栏，选择手机竖屏尺寸。</p>
      <a class="button" href="/apk-local/desk" target="previewFrame">本地静态页面 + APK 注入模拟</a>
      <a class="button secondary" href="/apk-proxy/desk" target="previewFrame">真实站点登录 + APK 注入模拟</a>
      <a class="button secondary" href="/desk" target="previewFrame">本地静态页面原始模式</a>
      <p><strong>调试“我的待办”：</strong>优先点“真实站点登录 + APK 注入模拟”，登录后从菜单进入“我的待办”。改 CSS/JS 后刷新即可，不需要重新打 APK。</p>
    </section>
    <section class="phone">
      <iframe class="screen" name="previewFrame" src="/apk-local/desk"></iframe>
    </section>
  </main>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname === '/' || pathname === '/preview') {
    send(res, 200, renderHome(), { 'Content-Type': 'text/html; charset=utf-8' });
    return;
  }

  if (pathname.startsWith('/apk-local/')) {
    const localPath = pathname.replace(/^\/apk-local/, '') || '/desk';
    if (!serveStatic(res, localPath, true)) {
      send(res, 404, 'Local file not found', { 'Content-Type': 'text/plain; charset=utf-8' });
    }
    return;
  }

  if (pathname.startsWith('/apk-proxy/')) {
    const proxyPath = pathname.replace(/^\/apk-proxy/, '') + url.search;
    proxyRequest(req, res, proxyPath || '/desk');
    return;
  }

  if (!serveStatic(res, pathname, false)) {
    send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
  }
});

server.listen(port, () => {
  console.log(`KSP mobile preview: http://localhost:${port}/preview`);
  console.log(`Local APK-style page: http://localhost:${port}/apk-local/desk`);
  console.log(`Proxy APK-style page: http://localhost:${port}/apk-proxy/desk`);
});