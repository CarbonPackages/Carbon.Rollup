module.exports = ({ options }) => ({
    plugins: {
        "postcss-import-alias": options.importAlias,
        "postcss-easy-import": options.easyImport,
        tailwindcss: true,
        "postcss-nested": {
            bubble: ["layer", "variants", "responsive", "screen"],
        },
        "postcss-assets": {
            cachebuster: false,
            basePath: "DistributionPackages/",
            baseUrl: "/_Resources/Static/Packages",
            loadPaths: ["**/Resources/Public/**/*"],
        },
        "postcss-url": {
            filter: /\/_Resources\/Static\/Packages\/[\w]+\.[\w]+\/Resources\/Public\/.*/,
            url: (asset) => asset.url.replace("/Resources/Public/", "/"),
        },
        "postcss-normalize": {
            allowDuplicates: false,
            forceImport: false,
        },
        "postcss-preset-env": {
            stage: 1,
            autoprefixer: false,
        },
        "postcss-easing-gradients": {
            colorStops: 15,
            alphaDecimals: 5,
            colorMode: "lrgb",
        },
        "postcss-for": true,
        "postcss-each": true,
        "postcss-hexrgba": true,
        "postcss-clip-path-polyfill": true,
        "postcss-responsive-type": true,
        "postcss-easings": true,
        "pleeease-filters": true,
        "postcss-quantity-queries": true,
        "postcss-momentum-scrolling": ["scroll", "auto", "inherit"],
        "postcss-round-subpixels": true,
        "postcss-sort-media-queries": true,
        autoprefixer: true,
        cssnano: options.production
            ? {
                  preset: ["default", { discardComments: { removeAll: true } }],
              }
            : false,
        "postcss-banner": options.banner
            ? {
                  banner: options.banner,
                  inline: true,
              }
            : false,
        "postcss-reporter": {
            clearReportedMessages: true,
        },
    },
});
