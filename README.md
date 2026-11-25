# AI SafeLanding 官网

纯静态网站，没有 npm 依赖，也不需要构建服务。线上地址：https://reliable-griffin-292c60.netlify.app/

## 目录

```
build.py        页面文案和模板，生成 site/ 下的所有 HTML 和 _redirects
components/     页面片段（各区块的 HTML 模板、团队卡片、品牌标志）
site/           发布目录，Netlify 直接发布这个文件夹
  assets/       CSS、JS、图片（直接在这里修改）
netlify.toml    Netlify 配置：publish = "site"
```

## 修改网站

- **改文案或页面结构**：修改 `build.py` 或 `components/`，再运行 `python3 build.py`。不要直接改 `site/` 里的 HTML，下次构建时会被覆盖。
- **改样式或交互**：直接修改 `site/assets/` 里的 CSS / JS，不需要构建。

修改生成的 HTML 后，要把 `site/` 一起提交。

## 本地预览

```sh
python3 -m http.server 4311 --directory site
```

然后打开 http://localhost:4311/

## 部署

可以在 Netlify 连接这个仓库：构建命令留空，发布目录填 `site`；也可以继续把 `site/` 文件夹拖进 Netlify 手动部署。
