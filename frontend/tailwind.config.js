module.exports = {
       purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
        darkMode: false, // or 'media' or 'class'
        theme: {
          minHeight: {
            'down': '128px'
          },
          fill: theme => ({
            'red': theme('colors.red.500'),
            'green': theme('colors.green.500'),
            'blue': theme('colors.blue.500'),
            'black': theme('colors.black')
          })
        },
        variants: {
          extend: {},
        },
        plugins: [],
      }