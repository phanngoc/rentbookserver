var config = {
  development: {
    postgresConnection : {
      client: "pg",
      debug: true,
      connection: {
        "driver": "pg",
        "user": "postgres",
        "password": "Phann123@123",
        "host": "localhost",
        "database": "postgres",
        "schema": "rentbook"
      }
    },
  },
};
module.exports = config;
