module.exports = {
    presets: ['@babel/env', { modules: false }, '@babel/typescript'],
    plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread']
};
