import path from "path";
import alias from "@rollup/plugin-alias";
import json from "@rollup/plugin-json";
import beep from "@rollup/plugin-beep";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import license from "rollup-plugin-license";
import postcss from "rollup-plugin-postcss";
import notify from "rollup-plugin-notify";
import packages from "./rollup.packages.js";

const extensions = {
    css: [".pcss", ".scss", ".sass", ".less", ".styl", ".css"],
    js: [".js", ".jsx", ".json"],
    module: [".mjs", ".mjsx", ".mts", ".mtsx"],
    ts: [".ts", ".tsx", ".mts", ".mtsx"],
};

const targetFolder = {
    inline: "Private/Templates/InlineAssets",
    css: "Public/Styles",
    js: "Public/Scripts",
    module: "Public/Modules",
};

const targetFileextension = {
    css: "css",
    js: "js",
    module: "mjs",
};

const parser = {
    javascript: {
        plugin: "@rollup/plugin-babel",
        options: {
            exclude: "node_modules/**", // only transpile our source code
            babelHelpers: "bundled",
        },
    },
    typescript: {
        plugin: "@wessberg/rollup-plugin-ts",
        options: {},
    },
};

const aliasFolders = ["DistributionPackages", "Packages"];

const isProduction = process.env.production;
if (isProduction) {
    process.env.NODE_ENV = "production";
}

const defaultAliasResolver = resolve({
    extensions: [...extensions.js, ...extensions.ts, ...extensions.module, ...extensions.css],
});

const defaultAliasEntries = aliasFolders.map((folder) => {
    return {
        find: folder,
        replacement: path.resolve(__dirname, folder),
    };
});

const cssAlias = (() => {
    const alias = {};
    aliasFolders.forEach((folder) => {
        alias[folder] = path.resolve(__dirname, folder);
    });
    return alias;
})();

function folder(packageName, type) {
    const base = path.join("DistributionPackages", packageName, "Resources");
    return type ? path.join(base, targetFolder[type]) : base;
}

function checkFileextension(type, filename) {
    return extensions[type].some((suffix) => filename.endsWith(suffix));
}

let files = [];
packages.forEach(
    ({
        packageName,
        filenames,
        inputFolder = "Fusion",
        inline = false,
        sourcemap = true,
        format = "iife",
        alias = null,
    }) => {
        if (!packageName || !filenames) {
            return;
        }

        // Set up alias
        let aliasFromPackage = [];
        if (Array.isArray(alias)) {
            aliasFromPackage = alias;
        } else {
            for (const key in alias) {
                aliasFromPackage.push({
                    find: key,
                    replacement: alias[key],
                });
            }
        }
        const customAlias = {
            entries: [...defaultAliasEntries, ...aliasFromPackage],
            defaultResolver: defaultAliasResolver,
        };

        // Disable sourcemaps on inline documents
        if (inline) {
            sourcemap = false;
        }

        filenames.forEach((filename) => {
            files.push({
                packageName,
                filename,
                inputFolder,
                inline,
                sourcemap,
                format,
                customAlias,
            });
        });
    }
);

async function config() {
    const terser = isProduction && (await import("rollup-plugin-terser"));
    return Promise.all(
        files.map(async ({ packageName, filename, inputFolder, inline, sourcemap, format, customAlias }) => {
            const baseFilename = filename.substring(0, filename.lastIndexOf("."));
            const isModule = checkFileextension("module", filename);
            const isTypescript = checkFileextension("ts", filename);
            const isCSS = checkFileextension("css", filename);
            const type = isCSS ? "css" : isModule ? "module" : "js";
            const licenseFilename = `${filename}.license`;
            const banner = `${filename} from ${packageName}`;
            const licenseBanner = `For license information please see ${licenseFilename}`;
            let jsParser = isCSS ? null : "javascript";
            if (isTypescript) {
                jsParser = "typescript";
            }

            if (isModule) {
                format = "es";
            }

            // Import parser only if needed
            const parserPackage = jsParser ? await import(parser[jsParser].plugin) : null;

            const outputFilename = path.join(
                folder(packageName, inline ? "inline" : type),
                `${baseFilename}.${targetFileextension[type]}`
            );

            return {
                input: path.join(folder(packageName), "Private", inputFolder, filename),
                watch: {
                    include: "DistributionPackages/**",
                },
                onwarn: (warning, warn) => {
                    if (warning.code === "FILE_NAME_CONFLICT" && isCSS) {
                        return;
                    }
                    warn(warning);
                },
                plugins: [
                    beep(),
                    notify(),
                    alias(customAlias),
                    resolve({
                        module: true,
                        jsnext: true,
                        preferBuiltins: false,
                    }),
                    commonjs({ include: "node_modules/**" }),
                    jsParser ? parserPackage.default(parser[jsParser].options) : null,
                    json(),
                    postcss({
                        extract: isCSS,
                        extensions: extensions.css,
                        use: ["sass", "stylus", "less"],
                        config: {
                            ctx: {
                                importAlias: cssAlias,
                                easyImport: {
                                    extensions: extensions.css,
                                    prefix: "_",
                                },
                                production: isProduction,
                                banner: isCSS ? banner : null,
                            },
                        },
                        sourceMap: isCSS ? sourcemap : false,
                    }),
                    terser
                        ? terser.terser({
                              output: {
                                  comments: false,
                              },
                          })
                        : null,
                    inline
                        ? null
                        : license({
                              sourcemap: sourcemap,
                              banner: {
                                  commentStyle: "none",
                                  data: {
                                      banner,
                                      licenseBanner,
                                  },
                                  content: `// <%= data.banner %><% if (dependencies.length) { %>
// <%= data.licenseBanner %><% } %>`,
                              },
                              thirdParty: {
                                  output: {
                                      file: path.join(folder(packageName, type), licenseFilename),
                                  },
                              },
                          }),
                ].filter((item) => !!item),
                output: {
                    sourcemapExcludeSources: !isProduction,
                    sourcemap: sourcemap,
                    file: outputFilename,
                    format: format,
                    name: `${packageName}.${baseFilename}`,
                },
            };
        })
    );
}

export default config;
