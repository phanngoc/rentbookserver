module.exports = {
  dev: {
    client: 'pg',
    connection: {
      "driver": "pg",
      "user": "postgres",
      "password": "Phann123@123",
      "host": "localhost",
      "database": "postgres",
      "schema": "rentbook"
    }
  },
  production: { client: 'pg', connection: process.env.DATABASE_URL }
};
