// Los logos vienen de Illustrator con muchos decimales y grupos redundantes.
// `currentColor` se preserva para poder colorearlos con `text-*`.
export default {
  multipass: true,
  floatPrecision: 2,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // El viewBox es necesario para escalar por CSS
          removeViewBox: false,
          convertPathData: { floatPrecision: 2, transformPrecision: 2 },
          cleanupNumericValues: { floatPrecision: 2 }
        }
      }
    },
    'removeDimensions',
    'sortAttrs'
  ]
}
