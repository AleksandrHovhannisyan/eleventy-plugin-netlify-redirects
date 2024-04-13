const fs = require('fs')
const path = require('path')

/**
 * @typedef EleventyPluginNetlifyRedirectsOptions
 * @type {object}
 * @property {Record<string, string>} [staticRedirects] From-to key-value pairs of static redirect rules (e.g., `{ "/from": "/to" }`).
 * @property {Record<string, unknown>} [frontMatterOverrides] Front matter overrides to apply to the redirects template.
*/

// TODO: figure out how to test this 😬 Even as an inlined template literal string, it isn't testable since it uses Eleventy globals. Maybe there's some way I can run 11ty in a test runner and manually parse the template?

/** Parses and returns the Netlify redirects template. NOTE: This could've technically been inlined, but it's nicer to author it in a separate file with proper syntax highlighting and LSP features. */
const getRedirects = () => fs.readFileSync(path.resolve(__dirname, 'redirects.liquid'), 'utf-8')

/**
 * @param {unknown} eleventyConfig
 * @param {EleventyPluginNetlifyRedirectsOptions} options
 */
module.exports = (eleventyConfig, options) => {
  // https://www.11ty.dev/docs/plugins/#feature-testing
  if (!('addTemplate' in eleventyConfig)) {
    console.log('[eleventy-plugin-netlify-redirects] WARN Eleventy plugin compatibility: Virtual Templates are required for this plugin, please use Eleventy v3.0 or newer.')
  }

  const { staticRedirects, frontMatterOverrides } = options

  const frontMatter = {
    // Write this virtual template to a _redirects file at the root of the output directory
    permalink: '/_redirects',
    // https://www.11ty.dev/docs/collections/#how-to-exclude-content-from-collections
    eleventyExcludeFromCollections: true,
    // Forward static redirects and other front matter overrides to the template
    staticRedirects,
    ...frontMatterOverrides
  }

  // Needed per https://github.com/11ty/eleventy/issues/1612#issuecomment-2027476340
  eleventyConfig.addTemplateFormats('liquid')
  // Virtual template: https://github.com/11ty/eleventy/issues/1612
  eleventyConfig.addTemplate('./redirects.liquid', getRedirects(), frontMatter)
}
