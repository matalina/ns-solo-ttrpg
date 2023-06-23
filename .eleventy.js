const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const obsidianImages = require('markdown-it-obsidian-images');
const taskLists = require('markdown-it-task-lists');
const wikilinks = require('markdown-it-wikilinks');

module.exports = function (eleventyConfig) {
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };

  eleventyConfig.setLibrary("md", markdownIt(options));
  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(obsidianImages({ relativeBaseURL: '/game/images/' })));
  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(taskLists));
  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(wikilinks({ baseURL: '/game/', uriSuffix: '' })));

  eleventyConfig.addWatchTarget("_site/assets/css/tailwind.css");
  eleventyConfig.addPassthroughCopy("src/assets/css/tailwind.css");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/game/images");
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addCollection("characters", (collection) => {
    const allItems = collection.getAll();
    return allItems.filter((item) => {
      return item.page.url.toString().startsWith('/game/characters');
    });
  });

  eleventyConfig.addCollection("wiki", (collection) => {
    const allItems = collection.getAll();
    return allItems.filter((item) => {
      return item.page.url.toString().startsWith('/game/wiki');
    });
  });

  eleventyConfig.addCollection("mechanics", (collection) => {
    const allItems = collection.getAll();
    return allItems.filter((item) => {
      return item.page.url.toString().startsWith('/game/mechanics');
    });
  });

  eleventyConfig.addCollection("adventures", (collection) => {
    const allItems = collection.getAll();
    return allItems.filter((item) => {
      return (item.page.url.toString().startsWith('/game/adventures') && item.page.fileSlug !== '000-setup');
    }).sort((a,b) => {
      if (a.fileSlug > b.fileSlug) return 1;
      if (a.fileSlug < b.fileSlug) return -1;
      return 0;
    });
  });

  return {
    dir: {
      input: "src",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts"
    },
  };
}