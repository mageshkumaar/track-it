const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'

const development = {
  app: {
    port: 3000
  },
  database: {
    uri: 'mongodb://localhost:27017/trackit',
    options: {
      useNewUrlParser: true
    }
  },
  jwt: {
    secret_key: 'JeXFx33azwSiLKCVmfEU',
    options: {
      expiresIn: 604800
    }
  }
}

const production = {
  app: {
    port: 8080
  },
  database: {
    uri: 'mongodb://localhost:27017/trackit',
    options: {
      useNewUrlParser: true
    }
  },
  jwt: {
    secret_key: process.env.SECRET_KEY,
    options: {
      expiresIn: 604800
    }
  }
}

const config = {
  development,
  production
}

module.exports = config[env]
