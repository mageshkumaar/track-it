const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'

const development = {
  app: {
    port: {
      frontend: 3000,
      backend: 3001
    },
    url: {
      frontend: "http://localhost:3001"
    }
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
  },
  logs: {
    file_name: 'app.log'
  }
}

const production = {
  app: {
    port: {
      frontend: 8080,
      backend: 8081
    },
    url: {
      frontend: "http://localhost:8081"
    }
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
  },
  logs: {
    file_name: 'app.log'
  }
}

const test = {
  app: {
    port: {
      frontend: 3010,
      backend: 3011
    },
    url: {
      frontend: "http://localhost:3011"
    }
  },
  database: {
    uri: 'mongodb://localhost:27017/trackit-test',
    options: {
      useNewUrlParser: true
    }
  },
  jwt: {
    secret_key: '4rwDHftQzLc4Z0xrwV0L',
    options: {
      expiresIn: 86400
    }
  },
  logs: {
    file_name: 'test.log'
  }
}

const config = {
  development,
  production,
  test
}

module.exports = config[env]
