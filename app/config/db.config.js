module.exports = {
 HOST: "ep-divine-salad-a45s7qjf-pooler.us-east-1.aws.neon.tech",
  USER: "neondb_owner",
  PASSWORD: "npg_RfHmdC1J8nga",
  DB: "neondb",
  dialect: "postgres",
    port: 5532,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};