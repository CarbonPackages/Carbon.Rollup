// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    theme: {
        extend: {
            maxWidth: theme => ({
                'screen-md-p': `calc(${theme('screens.md')} + ${theme('spacing.8')})`
            }),
            fontFamily: {
                sans: ['HeroNew', ...defaultTheme.fontFamily.sans]
            },
            padding: theme => ({
                ...theme('spacing'),
                '1/1': '100%',
                '768/525': 100 / (768 / 525) + '%'
            }),
            listStyleType: {
                square: 'square'
            }
        }
    },
    purge: [
        './DistributionPackages/**/*.fusion',
        './DistributionPackages/**/*.html',
        './Data/Temporary/Development/MonocleViews/**/*.html'
    ]
};
