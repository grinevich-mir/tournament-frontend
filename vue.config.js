module.exports = {
  configureWebpack: {
    output: {
      filename: '[name].[hash].bundle.js',
    },
  },
  transpileDependencies: [
    'aws-amplify',
    'aws-amplify-vue',
    // [/(\/|\\)aws(\/|\\)/],
  ],
  css: {
    loaderOptions: {
      sass: {
        // prependData: `@import "@/scss/normalize.scss"; @import "@/scss/global.scss";`,
        prependData: `@import "@/scss/variables.scss";`,
      },
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-svg-inline-loader')
      .loader('vue-svg-inline-loader')
      .options({
        removeAttributes: ['alt', 'src', 'role', 'tabindex'],
      });
  },
};
