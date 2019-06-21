
<div align="center">
  <a href="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-banner.svg?cb=134">
    <img width="200" height="200" src="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-banner.svg?cb=234">
  </a>
  <br>
  <br>

  <img width="200" height="200" src="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-banner.svg?cb=234">
  <img src="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/itw-creative-works-banner.svg?cb=234">
  <img src="https://cdn.itwcreativeworks.com/assets/itw-creative-works/images/logo/icon-square-big.svg">
  
  <img src="https://webpack.js.org/assets/icon-square-big.svg">


<!-- [![npm][npm]][npm-url]

[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![builds][builds]][builds-url]
[![builds2][builds2]][builds2-url]
[![coverage][cover]][cover-url]
[![licenses][licenses]][licenses-url]

<img alt="David" src="https://img.shields.io/david/itw-creative-works/push-manager.svg"> -->

![GitHub package.json version](https://img.shields.io/github/package-json/v/itw-creative-works/push-manager.svg)

![David](https://img.shields.io/david/itw-creative-works/push-manager.svg)
![David](https://img.shields.io/david/dev/itw-creative-works/push-manager.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/itw-creative-works/push-manager.svg)
![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability-percentage/itw-creative-works/push-manager.svg)
![npm](https://img.shields.io/npm/dm/push-manager.svg)
![node](https://img.shields.io/node/v/push-manager.svg)
![Website](https://img.shields.io/website/https/itwcreativeworks.com.svg)
![GitHub](https://img.shields.io/github/license/itw-creative-works/push-manager.svg)
![GitHub contributors](https://img.shields.io/github/contributors/itw-creative-works/push-manager.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/itw-creative-works/push-manager.svg)


  <!-- <br>
  <a href="https://dependabot.com/compatibility-score.html?dependency-name=webpack&package-manager=npm_and_yarn&new-version=latest">
    <img src="https://api.dependabot.com/badges/compatibility_score?dependency-name=webpack&package-manager=npm_and_yarn&version-scheme=semver&target-version=latest">
  </a>
	<a href="https://npmcharts.com/compare/webpack?minimal=true">
		<img src="https://img.shields.io/npm/dm/webpack.svg">
	</a>
	<a href="https://packagephobia.now.sh/result?p=webpack">
		<img src="https://packagephobia.now.sh/badge?p=webpack" alt="install size">
	</a>
	<a href="https://opencollective.com/webpack#backer">
		<img src="https://opencollective.com/webpack/backers/badge.svg">
	</a>
	<a href="https://opencollective.com/webpack#sponsors">
		<img src="https://opencollective.com/webpack/sponsors/badge.svg">
	</a>
	<a href="https://github.com/webpack/webpack/graphs/contributors">
		<img src="https://img.shields.io/github/contributors/webpack/webpack.svg">
	</a>
	<a href="https://gitter.im/webpack/webpack">
		<img src="https://badges.gitter.im/webpack/webpack.svg">
	</a> -->

  <!-- <h1 align="center">webpack</h1> -->
  # Push Manager

**webpack** is a module bundler. Its main purpose is to bundle JavaScript files for usage in a browser, yet it is also capable of transforming, bundling, or packaging just about any resource or asset.

</div>


<h2 align="center">Install</h2>

Install with npm:

```bash
npm install webpack
```
<h2 align="center">Introduction</h2>

**webpack** is a bundler for modules. The main purpose is to bundle JavaScript files for usage in a browser, yet it is also capable of transforming, bundling, or packaging just about any resource or asset.

**TL;DR**

* Bundles [ES Modules](http://www.2ality.com/2014/09/es6-modules-final.html), [CommonJS](http://wiki.commonjs.org/), and [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) modules (even combined).
* Can create a single bundle or multiple chunks that are asynchronously loaded at runtime (to reduce initial loading time).
* Dependencies are resolved during compilation, reducing the runtime size.
* Loaders can preprocess files while compiling, e.g. TypeScript to JavaScript, Handlebars strings to compiled functions, images to Base64, etc.
* Highly modular plugin system to do whatever else your application requires.

### Get Started

Check out webpack's quick [**Get Started**](https://webpack.js.org/guides/getting-started) guide and the [other guides](https://webpack.js.org/guides/).

### Browser Compatibility

webpack supports all browsers that are [ES5-compliant](http://kangax.github.io/compat-table/es5/) (IE8 and below are not supported).
webpack also needs `Promise` for `import()` and `require.ensure()`. If you want to support older browsers, you will need to [load a polyfill](https://webpack.js.org/guides/shimming/) before using these expressions.

<h2 align="center">Concepts</h2>

### [Plugins](https://webpack.js.org/plugins/)

webpack has a [rich plugin
interface](https://webpack.js.org/plugins/). Most of the features
within webpack itself use this plugin interface. This makes webpack very
**flexible**.

<h2 align="center">Special Thanks to</h2>
<p align="center">(In chronological order)</p>

* @google for [Google Web Toolkit (GWT)](http://www.gwtproject.org/), which aims to compile Java to JavaScript. It features a similar [Code Splitting](http://www.gwtproject.org/doc/latest/DevGuideCodeSplitting.html) as webpack.
* @medikoo for [modules-webmake](https://github.com/medikoo/modules-webmake), which is a similar project. webpack was born because I wanted Code Splitting for modules-webmake. Interestingly the [Code Splitting issue is still open](https://github.com/medikoo/modules-webmake/issues/7) (thanks also to @Phoscur for the discussion).
* @substack for [browserify](http://browserify.org/), which is a similar project and source for many ideas.
* @jrburke for [require.js](http://requirejs.org/), which is a similar project and source for many ideas.
* @defunctzombie for the [browser-field spec](https://gist.github.com/defunctzombie/4339901), which makes modules available for node.js, browserify and webpack.
* Every early webpack user, which contributed to webpack by writing issues or PRs. You influenced the direction...
* @shama, @jhnns and @sokra for maintaining this project
* Everyone who has written a loader for webpack. You are the ecosystem...
* Everyone I forgot to mention here, but also influenced webpack.


[npm]: https://img.shields.io/npm/v/webpack.svg
[npm-url]: https://npmjs.com/package/webpack

[node]: https://img.shields.io/node/v/webpack.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/david/webpack/webpack.svg
[deps-url]: https://david-dm.org/webpack/webpack

[tests]: https://img.shields.io/travis/webpack/webpack/master.svg
[tests-url]: https://travis-ci.org/webpack/webpack

[builds-url]: https://ci.appveyor.com/project/sokra/webpack/branch/master
[builds]: https://ci.appveyor.com/api/projects/status/github/webpack/webpack?svg=true

[builds2]: https://dev.azure.com/webpack/webpack/_apis/build/status/webpack.webpack
[builds2-url]: https://dev.azure.com/webpack/webpack/_build/latest?definitionId=3

[licenses-url]: https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fwebpack%2Fwebpack?ref=badge_shield
[licenses]: https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fwebpack%2Fwebpack.svg?type=shield

[cover]: https://img.shields.io/coveralls/webpack/webpack.svg
[cover-url]: https://coveralls.io/r/webpack/webpack/
