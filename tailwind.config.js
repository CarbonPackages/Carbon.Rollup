// tailwind.config.js
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    theme: {
        extend: {
            screens: {
                light: { raw: "(prefers-color-scheme: light)" },
                dark: { raw: "(prefers-color-scheme: dark)" },
            },
            maxWidth: (theme) => ({
                "screen-md-p": `calc(${theme("screens.md")} + ${theme("spacing.8")})`,
            }),
            fontFamily: {
                sans: ["HeroNew", ...defaultTheme.fontFamily.sans],
            },
            padding: (theme) => ({
                ...theme("spacing"),
                "1/1": "100%",
                "768/525": 100 / (768 / 525) + "%",
            }),
            listStyleType: {
                square: "square",
            },
        },
    },
    dark: "media", // or 'class'
    experimental: {
        applyComplexClasses: true,
        uniformColorPalette: true,
        extendedSpacingScale: true,
        defaultLineHeights: true,
        extendedFontSizeScale: true,
        standardFontWeights: true,
        // darkModeVariant: true,
    },
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
    purge: {
        mode: "layers",
        layers: ["base", "components", "utilities"],
        preserveHtmlElements: true,
        content: [
            "./DistributionPackages/**/*.fusion",
            "./DistributionPackages/**/*.html",
            "./Data/Temporary/Development/MonocleViews/**/*.html",
        ],
    },
};
