![Carbon.Rollup – Build stack for Neos CMS][preview]

[![Download]][master.zip] [![Template]][generate] [![David]][david-dm] [![GitHub stars]][stargazers] [![GitHub watchers]][subscription] [![GitHub license]][license] [![GitHub issues]][issues] [![GitHub forks]][network] [![Twitter]][tweet] [![Sponsor @Jonnitto on GitHub]][sponsor]

**Carbon.Rollup is a delicious blend of tasks and build tools poured into Rollup to form a full-featured modern asset pipeline for Flow Framework and [Neos CMS].**

This repository is meant to use as a template for your project. Download the files and copy them into your [Neos CMS] mono repository. After that, you've got the freedom to adjust the configuration (edit/remove/add) to your specific needs.

## Getting started

To use this build stack, you can either [download the code as zip file][master.zip] or generate a new repository and [use this as a template][generate]. If you use the template function, please be aware, that you have to edit/replace/remove following files or folders:

- `.github`
- `.gitattributes`
- [`.gitignore`]
- `CODE_OF_CONDUCT.md`
- `README.md`

For example, in this repository, `yarn.lock` is excluded, but in a project, `yarn.lock` should be included.

## Add files to the build stack

The entry files of your Neos repository is configured in [`rollup.packages.js`]. The entries are set up in an array, and a single entry is an object with following options:

| Key           | Type      | required | Description                                                                    | Default    | Example                    |
| ------------- | --------- | :------: | ------------------------------------------------------------------------------ | ---------- | -------------------------- |
| `packageName` | `string`  |    ✓     | The name of the package                                                        |            | `"Vendor.Foo"`             |
| `filenames`   | `array`   |    ✓     | The names of the entry files                                                   |            | `["Main.js", "Main.pcss"]` |
| `inputFolder` | `string`  |          | The folder under `Resources/Private` where to look for the entry files         | `"Fusion"` | `"Assets"`                 |
| `inline`      | `boolean` |          | Flag to toggle if the files should be inlined. If set, sourcemaps are disabled | `false`    | `true`                     |
| `sourcemap`   | `boolean` |          | Flag to toggle source map generation                                           | `true`     | `false`                    |
| `format`      | `string`  |          | Set the format of the output file. [Read more][rollup outputformat]            | `"iife"`   | `"umd"`                    |
| `alias`       | `string`  |          | Add your own, package-specific alias                                           | `{}`       | `{react: "preact/compat"}` |

- Inline files will be written to `Resources/Private/Templates/InlineAssets`.
- If you want to inject the styles via JavaScript, you can import your styles directly into your JS file (e.g. `import ./Component/Header.pcss`)

## Yarn tasks

There are three predefined tasks:

| Scripts         | Description                               | Optimize file size | Command                                                 |
| --------------- | ----------------------------------------- | :----------------: | ------------------------------------------------------- |
| `yarn start`    | Start the file watcher                    |                    | `rollup --config --watch`                               |
| `yarn build`    | Build the files once                      |                    | `rollup --config`                                       |
| `yarn pipeline` | Run install, build and optimize file size |         ✓          | `yarn install;rollup --config --environment production` |


## CSS

### PostCSS

This template comes with a variety of PostCSS Plugins. Feel free to remove some or add your own favorites packages. The configuration is located in [`postcss.config.js`]. The suffix of these files should be `.pcss`.

### Usage of CSS Pre-Processors

If you want to use [Sass, Scss][sass], [Less], or [stylus], you have to add to the corresponding package to your setup.

- For [Sass or Scss][sass] enter `yarn add --dev node-sass`
- For [Less] enter `yarn add --dev less`
- For [stylus] enter `yarn add --dev stylus`

> Note: If you want to use [stylus], you have to set [.nvmrc] to `13`, as there is a bug with node 14

### Tailwind CSS

This setup comes with [Tailwind CSS], a highly customizable, low-level CSS framework. An example configuration is provided in [`tailwind.config.js`]. The setup for purge the CSS files is also configured. [Read more about controlling the file size here.][tailwind file-size]. To remove unused CSS styles, simply run `yarn pipeline`.

By the way: [Alpine.js] is excellent in combination with [Tailwind CSS].

## Javascript

### Usage of TypeScript

If you want TypeScript, add following packages to `package.json`:

```bash
yarn add --dev typescript @typescript-eslint/eslint-plugin @babel/preset-typescript @typescript-eslint/parser @wessberg/rollup-plugin-ts
```

You have also to edit [`babel.config.js`]:

```js
module.exports = {
  presets: ["@babel/env", "@babel/typescript"],
  plugins: ["@babel/proposal-class-properties", "@babel/proposal-object-rest-spread"],
};
```

To enable the correct linting, edit [`.eslintrc`]:

```json
{
  "parser": "@typescript-eslint/parser",
  "extends": ["plugin:@typescript-eslint/recommended", "eslint:recommended", "plugin:prettier/recommended", "prettier/@typescript-eslint"],
  "env": {
    "es6": true,
    "node": true
  }
}
```

If you don't use Javascript at all, you can remove `@rollup/plugin-babel` with the following command:

```bash
yarn remove @rollup/plugin-babel
```

[preview]: https://repository-images.githubusercontent.com/276846965/b977e000-c6db-11ea-9cd8-18040e6a19d8
[david]: https://img.shields.io/david/dev/CarbonPackages/Carbon.Rollup
[david-dm]: https://david-dm.org/CarbonPackages/Carbon.Rollup?type=dev
[github issues]: https://img.shields.io/github/issues/CarbonPackages/Carbon.Rollup
[issues]: https://github.com/CarbonPackages/Carbon.Rollup/issues
[github forks]: https://img.shields.io/github/forks/CarbonPackages/Carbon.Rollup
[network]: https://github.com/CarbonPackages/Carbon.Rollup/network
[github stars]: https://img.shields.io/github/stars/CarbonPackages/Carbon.Rollup
[stargazers]: https://github.com/CarbonPackages/Carbon.Rollup/stargazers
[github license]: https://img.shields.io/github/license/CarbonPackages/Carbon.Rollup
[license]: LICENSE
[twitter]: https://img.shields.io/twitter/url?url=https%3A%2F%2Fgithub.com%2FCarbonPackages%2FCarbon.Rollup
[tweet]: https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2FCarbonPackages%2FCarbon.Rollup
[sponsor @jonnitto on github]: https://img.shields.io/badge/sponsor-Support%20this%20package-informational
[sponsor]: https://github.com/sponsors/jonnitto
[github watchers]: https://img.shields.io/github/watchers/CarbonPackages/Carbon.Rollup.svg
[subscription]: https://github.com/CarbonPackages/Carbon.Rollup/subscription
[template]: https://img.shields.io/badge/template-Use%20this%20template-informational
[generate]: https://github.com/CarbonPackages/Carbon.Rollup/generate
[download]: https://img.shields.io/badge/download-Download%20as%20zip-informational
[master.zip]: https://github.com/CarbonPackages/Carbon.Rollup/archive/master.zip
[neos cms]: https://www.neos.io
[sass]: https://sass-lang.com
[less]: http://lesscss.org
[stylus]: https://stylus-lang.com
[.nvmrc]: .nvmrc
[`babel.config.js`]: babel.config.js
[`.eslintrc`]: .eslintrc
[`rollup.packages.js`]: rollup.packages.js
[rollup outputformat]: https://rollupjs.org/guide/en/#outputformat
[`postcss.config.js`]: postcss.config.js
[tailwind css]: https://tailwindcss.com
[alpine.js]: https://github.com/alpinejs/alpine
[`tailwind.config.js`]: tailwind.config.js
[tailwind file-size]: https://tailwindcss.com/docs/controlling-file-size
[`.gitignore`]: .gitignore
