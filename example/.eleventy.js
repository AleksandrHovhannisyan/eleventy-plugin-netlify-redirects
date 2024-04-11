const EleventyPluginNetlifyRedirects = require("../src/index.js");

module.exports = (eleventyConfig) => {
    /** @type {import("../src/.eleventy.js").EleventyPluginNetlifyRedirectsOptions} */
    const options = { staticRedirects: { "/static-old": "/static-new", "/blog/*": "/posts/:splat" } };
    eleventyConfig.addPlugin(EleventyPluginNetlifyRedirects, options);

    return {
        dir: {
            input: "src",
            output: "_site",
        },
    };
}
