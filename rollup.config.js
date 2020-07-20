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

const dynamicImports = {};

// You can pass multiple parser to one type
const parser = {
    javascript: [
        {
            plugin: "@rollup/plugin-babel",
            options: {
                exclude: "node_modules/**", // only transpile our source code
                babelHelpers: "bundled",
            },
        },
    ],
    typescript: [
        {
            plugin: "@wessberg/rollup-plugin-ts",
            options: {},
        },
    ],
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
let neededParser = [];
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
            const isModule = checkFileextension("module", filename);
            const isCSS = checkFileextension("css", filename);
            const targetType = isCSS ? "css" : isModule ? "module" : "js";
            let parserType = null;
            if (checkFileextension("js", filename)) {
                parserType = "javascript";
            } else if (checkFileextension("ts", filename)) {
                parserType = "typescript";
            }

            if (parserType && !neededParser.includes(parserType)) {
                neededParser.push(parserType);
            }

            files.push({
                packageName,
                filename,
                inputFolder,
                inline,
                sourcemap,
                format,
                customAlias,
                parserType,
                targetType,
            });
        });
    }
);

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function config() {
    if (isProduction) {
        const { terser } = isProduction && (await import("rollup-plugin-terser"));
        dynamicImports.terser = terser;
    }

    // Pre-import parser
    await asyncForEach(neededParser, async (entry) => {
        await asyncForEach(parser[entry], async (item) => {
            const name = item.plugin;
            if (dynamicImports[name]) {
                return;
            }
            const imp = await import(name);
            dynamicImports[name] = imp.default;
            if (item.additionalPlugins?.length) {
                await asyncForEach(item.additionalPlugins, async (additonalPlugin) => {
                    if (dynamicImports[additonalPlugin]) {
                        return;
                    }
                    const imp = await import(additonalPlugin);
                    dynamicImports[additonalPlugin] = imp.default;
                });
            }
        });
    });

    return files.map(
        ({ packageName, filename, inputFolder, inline, sourcemap, format, customAlias, parserType, targetType }) => {
            const baseFilename = filename.substring(0, filename.lastIndexOf("."));
            const isCSS = targetType === "css";
            const licenseFilename = `${filename}.license`;
            const banner = `${filename} from ${packageName}`;
            const licenseBanner = `For license information please see ${licenseFilename}`;
            const parserPackages = parserType ? parser[parserType] : [];

            if (targetType === "module") {
                format = "es";
            }

            const outputFilename = path.join(
                folder(packageName, inline ? "inline" : targetType),
                `${baseFilename}.${targetFileextension[targetType]}`
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
                    ...parserPackages.map((entry) =>
                        dynamicImports[entry.plugin](
                            typeof entry.options === "function"
                                ? entry.options({ packageName, filename, sourcemap, format })
                                : entry.options
                        )
                    ),
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
                    dynamicImports.terser &&
                        dynamicImports.terser({
                            output: {
                                comments: false,
                            },
                        }),
                    !inline &&
                        license({
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
                                    file: path.join(folder(packageName, targetType), licenseFilename),
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
        }
    );
}

export default config;
