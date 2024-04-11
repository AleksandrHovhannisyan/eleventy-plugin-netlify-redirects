# eleventy-plugin-netlify-redirects

> [!NOTE]
> This plugin is only compatible with Eleventy versions `>= 3.0.0-alpha.6`.

Automatically generate a [Netlify `_redirects` file](https://docs.netlify.com/routing/redirects/#syntax-for-the-redirects-file) for your Eleventy site using front matter.

## Getting Started

Install the plugin in your project using your preferred package manager:

```
npm install --save-dev eleventy-plugin-netlify-redirects
```

And update your Eleventy config to import and use the plugin:

```js
const EleventyPluginNetlifyRedirects = require("eleventy-plugin-netlify-redirects");

module.exports = (eleventyConfig) => {
    /** @type {import("eleventy-plugin-netlify-redirects").EleventyPluginNetlifyRedirectsOptions} */
    const eleventyPluginNetlifyRedirectsOptions = {};
    eleventyConfig.addPlugin(EleventyPluginNetlifyRedirects, eleventyPluginNetlifyRedirectsOptions);
}
```

## Example Usage

Add `redirectFrom` to the front matter of any input file to specify which URL(s) to redirect from.

For single redirects, `redirectFrom` can be a string:

**src/posts/2024-04-11-my-post-slug.md
```md
---
redirectFrom: /old-url/
---
```

If a page's URL changed multiple times, `redirectFrom` can be an array of strings:

```md
---
redirectFrom:
    - /one/
    - /two/
---
```

In both cases, the plugin will automatically map the old URLs to the template's current URL (`page.url` in Eleventy).

For example, if the above redirects are specified in a post with a current permalink/URL of `/posts/my-post-slug/`, then you would get the following output:

**<output-folder>/_redirects**
```
/one/   /posts/my-post-slug/
/two/   /posts/my-post-slug/
```

Netlify will detect this file after Eleventy builds your site.

## API

The following plugin options are available for use in your `.eleventy.js` configuration:

Option            |Type                       |Description|Example|
------------------|---------------------------|-----------|-------|
`staticRedirects` |`Record<string, string>|undefined`   |(Optional) A hard-coded mapping from old URLs to new URLs. For example, you might want to use this for [Netlify splats](https://docs.netlify.com/routing/redirects/redirect-options/#splats) or any other redirect rules Netlify supports that you cannot implement via the `redirectFrom` front-matter variable.|`{ "/blog/*": "/articles/:splat" }`|
`frontMatterOverrides`|Record<string, string>|undefined`|(Optional) Any front matter variables you want to set for the redirects file. By default, the plugin will set [`eleventyExcludeFromCollections: true`](https://www.11ty.dev/docs/collections/#how-to-exclude-content-from-collections) as well as `permalink: /_redirects`. These can be overridden too, but it's not recommended.|`{ "customFrontMatter": "value" }`|

## Motivation

You can define Netlify redirect rules by hand, but this requires keeping the new/current URL up to date and in sync with your template files' slugs/permalinks. If you change a template file name multiple times, that becomes a headache to manage. This plugin allows you to define your redirect rules right inside your templates' front matter; the new/current URL is always `page.url`.

Inspired by:

- [Automate Netlify Redirects in 11ty](https://www.aleksandrhovhannisyan.com/blog/eleventy-netlify-redirects/), an article I wrote years ago, before Eleventy supported virtual templates.
- The official [jekyll-redirect-from plugin](https://github.com/jekyll/jekyll-redirect-from), from when I used to build my site with Jekyll.

## Notes

- This plugin registers Liquid as a recognized template language, as suggested by Zach Leatherman here: https://github.com/11ty/eleventy/issues/1612#issuecomment-2027476340
