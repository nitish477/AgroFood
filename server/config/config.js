import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_URI,
  env: process.env.NODE_ENV,
  jwtAccessSecret: process.env.ACCESS_TOKEN_SECRET,
  jwtRefreshSecret: process.env.REFRESH_TOKEN_SECRET,
  jwtAccessExpiration: process.env.ACCESS_TOKEN_EXPIRY,
  jwtRefreshExpiration: process.env.REFRESH_TOKEN_EXPIRY,
};

export const config = Object.freeze(_config);