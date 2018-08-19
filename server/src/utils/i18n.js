const i18n = require('i18n')

i18n.configure({
  locales: ['en'],
  // __dirname points to the current directory i.e., config directory
  // If the directory and the files are not available, those will
  // be created automatically.
  directory: `${__dirname}/../../locales`
})

module.exports = i18n
