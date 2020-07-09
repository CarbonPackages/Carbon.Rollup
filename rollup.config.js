import path from 'path';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import beep from '@rollup/plugin-beep';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import license from 'rollup-plugin-license';
import postcss from 'rollup-plugin-postcss';
import notify from 'rollup-plugin-notify';
import packages from './rollup.packages.js';

const isProduction = process.env.production;
if (isProduction) {
    process.env.NODE_ENV = 'production';
}

let files = [];
packages.forEach(({ packageName, filenames, inputFolder = 'Fusion', inline = false, sourcemap = true, format = 'iife', alias = null }) => {
    if (!packageName || !filenames) {
        return;
    }
    const customAlias = alias;
    if (inline) {
        sourcemap = false;
    }
    filenames.forEach(filename => {
        files.push({
            packageName,
            filename,
            inputFolder,
            inline,
            sourcemap,
            format,
            customAlias
        });
    });
});

function folder(packageName, folder = 'private') {
    const base = path.join('DistributionPackages', packageName, 'Resources');
    if (folder === 'inline') {
        return path.join(base, 'Private/Templates/InlineAssets');
    }
    return path.join(base, folder.charAt(0).toUpperCase() + folder.slice(1));
}

async function config() {
    const terser = isProduction && (await import('rollup-plugin-terser'));
    return Promise.all(
        files.map(async ({ packageName, filename, inputFolder, inline, sourcemap, format, customAlias }) => {
            const lastIndexOfDot = filename.lastIndexOf('.');
            const baseFilename = filename.substring(0, lastIndexOfDot);
            const fileExtension = filename.substring(lastIndexOfDot + 1);
            const licenseFilename = `${filename}.license`;
            const extractCSS = fileExtension.endsWith('css');
            const targetFileextension = extractCSS ? 'css' : 'js';
            const targetFolder = extractCSS ? 'Styles' : 'Scripts';
            const banner = `${filename} from ${packageName}`;
            const licenseBanner = `For license information please see ${licenseFilename}`;
            const watchFiles = extractCSS ? '{scss,pcss}' : '{js,jsx,ts,tsx}';

            const isTypescript = fileExtension.match(/tsx?/);
            // Import babel / typescript only if needed
            const parser = extractCSS
                ? null
                : await import(isTypescript ? '@wessberg/rollup-plugin-ts' : '@rollup/plugin-babel');

            const outputFilename = inline
                ? `${folder(packageName, 'inline')}/${baseFilename}.${targetFileextension}`
                : `${folder(packageName, 'public')}/${targetFolder}/${baseFilename}.${targetFileextension}`;

            return {
                input: `${folder(packageName, 'private')}/${inputFolder}/${filename}`,
                watch: {
                    include: `${folder(packageName, 'private')}/**/*.${watchFiles}`
                },
                onwarn: (warning, warn) => {
                    if (warning.code === 'FILE_NAME_CONFLICT' && extractCSS) {
                        return;
                    }
                    warn(warning);
                },
                plugins: [
                    beep(),
                    notify(),
                    customAlias
                        ? alias({
                              entries: customAlias
                          })
                        : null,
                    resolve({
                        module: true,
                        jsnext: true,
                        preferBuiltins: false
                    }),
                    commonjs({ include: 'node_modules/**' }),
                    extractCSS
                        ? null
                        : parser.default(
                              isTypescript
                                  ? {}
                                  : {
                                        exclude: 'node_modules/**', // only transpile our source code
                                        babelHelpers: 'bundled'
                                    }
                          ),
                    json(),
                    postcss({
                        modules: true,
                        extract: extractCSS,
                        extensions: ['.pcss', '.scss'],
                        use: ['sass'],
                        config: {
                            ctx: {
                                production: isProduction,
                                banner: extractCSS ? banner : null
                            }
                        },
                        sourceMap: sourcemap
                    }),
                    terser
                        ? terser.terser({
                              output: {
                                  comments: false
                              }
                          })
                        : null,
                    inline
                        ? null
                        : license({
                              sourcemap: sourcemap,
                              banner: {
                                  commentStyle: 'none',
                                  data: {
                                      banner,
                                      licenseBanner
                                  },
                                  content: `// <%= data.banner %><% if (dependencies.length) { %>
// <%= data.licenseBanner %><% } %>`
                              },
                              thirdParty: {
                                  output: {
                                      file: `${folder(packageName, 'public')}/${targetFolder}/${licenseFilename}`
                                  }
                              }
                          })
                ].filter(item => !!item),
                output: {
                    sourcemapExcludeSources: !isProduction,
                    sourcemap: sourcemap,
                    file: outputFilename,
                    format: format,
                    name: `${packageName}.${baseFilename}.${targetFileextension}`
                }
            };
        })
    );
}

export default config;
