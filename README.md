# Carbon.Rollup

[![Download]][master.zip] [![Template]][generate] [![David]][david-dm] [![GitHub stars]][stargazers] [![GitHub watchers]][subscription] [![GitHub license]][license] [![GitHub issues]][issues] [![GitHub forks]][network] [![Twitter]][tweet] [![Sponsor @Jonnitto on GitHub]][sponsor]

**Carbon.Rollup is a delicious blend of tasks and build tools poured into Rollup to form a full-featured modern asset pipeline for Flow Framework and [Neos CMS].**

## Usage of CSS Pre-Processors

If you want to use [Sass, Scss][sass], [Less] or [stylus] you have to add to correspondig package to your setup.

- For [Sass or Scss][sass] enter `yarn add --dev node-sass`
- For [Less] enter `yarn add --dev less`
- For [stylus] enter `yarn add --dev stylus`

> Note: If you want to use [stylus], you have to set [.nvmrc] to `13`, as there is a bug with node 14

## Usage of TypeScript

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

If you don't use Javascript at all, you can remove `@rollup/plugin-babel` with following command:

```bash
yarn remove @rollup/plugin-babel
```

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
