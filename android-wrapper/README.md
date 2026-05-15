# Android APK 封装说明

本目录是开元咨询一站式平台的 Android WebView 壳工程。APK 默认加载线上页面：

```text
https://ksp.karon.cn/desk
```

也可以在构建时通过 `KSP_WEB_URL` 覆盖目标地址。

## 本地构建

需要本机已安装 Android SDK、JDK 17 和 Gradle。

```powershell
cd android-wrapper
gradle assembleDebug -PKSP_WEB_URL="https://ksp.karon.cn/desk"
```

构建产物：

```text
android-wrapper/app/build/outputs/apk/debug/app-debug.apk
```

## GitHub Actions 构建

仓库已提供：

```text
.github/workflows/android-apk.yml
```

使用方法：

1. 推送代码到 GitHub。
2. 打开仓库的 Actions。
3. 选择 `Build Android APK`。
4. 点击 `Run workflow`。
5. 填写 `web_url`，例如：

```text
https://ksp.karon.cn/desk
```

6. 构建完成后，在 Artifacts 下载 `karon-ksp-debug-apk`。

## 真机测试清单

安装 APK 后重点验证：

- 打开 App 是否进入目标 `desk` 页面；
- 登录是否正常，关闭 App 后登录态是否保留；
- 手机端顶部栏、左侧抽屉菜单、二级菜单是否正常；
- Android 返回键是否优先返回上一页；
- 表格是否可以横向滚动；
- 弹窗是否不超出屏幕；
- 文件上传是否能调起系统文件选择器；
- 下载链接是否能开始下载或跳转外部浏览器；
- 外部链接是否能正常打开；
- HTTP/HTTPS 混合链接是否被拦截。

## Windows 本地移动端 UI 预览

不需要先编译 APK，可以在仓库根目录启动本地预览服务：

```powershell
cd C:\Users\wyq\Desktop\karon
npm run preview:mobile
```

打开：

```text
http://localhost:5173/preview
```

页面里有三个入口：

- `本地静态页面 + APK 注入模拟`：加载本地 `ksp.karon.cn/desk`，并模拟 APK 注入的移动端 CSS/JS。
- `真实站点登录 + APK 注入模拟`：代理 `https://ksp.karon.cn/desk`，可用于登录后检查“我的待办”等真实业务页面的手机端 UI。
- `本地静态页面原始模式`：不模拟 APK 注入，用于对比原始页面。

推荐用 Chrome 打开后按 `F12`，切换设备工具栏，选择手机竖屏尺寸。之后修改移动端 CSS/JS 只需要刷新浏览器，不需要重新打包安装 APK。

## 后续发布正式包

当前 workflow 构建的是 debug APK，适合测试安装。正式发布需要补充 release 签名：

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

签名配置完成后再新增 `assembleRelease` 流程。