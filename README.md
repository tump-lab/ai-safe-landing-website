# AI SafeLanding Website

A plain static website with no npm dependencies and no build service. Live site: https://reliable-griffin-292c60.netlify.app/

## Structure

```
build.py        Page copy and templates; generates every HTML file and _redirects in site/
components/     Page fragments (section templates, team cards, brand mark)
site/           Publish directory; Netlify serves this folder as-is
  assets/       CSS, JS and images (edit these directly)
netlify.toml    Netlify config: publish = "site"
```

## Editing the site

- **Copy or page structure**: edit `build.py` or `components/`, then run `python3 build.py`. Do not edit the HTML in `site/` by hand; the next build will overwrite it.
- **Styles or interactions**: edit the CSS / JS in `site/assets/` directly; no build needed.

After regenerating the HTML, commit the updated `site/` folder as well.

## Local preview

```sh
python3 -m http.server 4311 --directory site
```

Then open http://localhost:4311/

## Deployment

Either connect this repository in Netlify (leave the build command empty and set the publish directory to `site`), or keep deploying manually by dragging the `site/` folder into Netlify.
