const i18n = require('i18n')

// Configuration of the Internationalisation
i18n.configure({
  locales: ['en'],
  defaultLocale: 'en',
  directory: `${__dirname}/../locales`
})

module.exports = i18n
