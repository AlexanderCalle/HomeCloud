module.exports = {
       purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
        darkMode: false, // or 'media' or 'class'
        theme: {
          minHeight: {
            'down': '128px'
          },
        },
        variants: {
          extend: {},
        },
        plugins: [],
      }