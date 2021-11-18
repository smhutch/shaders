module.exports = {
  webpack: (config) => {
    return Object.assign({}, config, {
      module: Object.assign({}, config.module, {
        rules: config.module.rules.concat([
          {
            test: /\.(glsl|vert|frag)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "raw-loader",
                options: {
                  esModule: false,
                },
              },
            ],
          },
        ]),
      }),
    });
  },
};
