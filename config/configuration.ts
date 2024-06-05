export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    user: process.env.DATABASE_USER,
    pwd: String(process.env.DATABASE_PWD),
  },
  secret: process.env.JWT_SECRET_KEY,
});
