/**
 * Pass an object with the following properties to the array:
 *
 * packageName   <string>  (required) The name of the package
 * filenames     <array>   (required) The names of the entry files
 * inputFolder   <string>  (optional) (default: `Fusion`) The inputFolder where to look for the entry files
 * inline        <boolean> (optional) (default: `false`) Flag to toggle if the files should be written to `Resources/Private/Templates/InlineAssets`
 * sourcemap     <boolean> (optional) (default: `true`) Flag to toggle source map generation
 * format        <string>  (optional) (default: `iife`)
 * alias         <object>  (optional) (default: `{}`) Add your own, package-specific alias
 */

export default [
    { packageName: 'Vendor.Theme', filenames: ['Main.pcss', 'Test.scss'] },
    { packageName: 'Vendor.Theme', filenames: ['Main.ts', 'TrackingOptions.ts'], inline: true },
    { packageName: 'Vendor.Slider', filenames: ['Main.ts'] },
];
