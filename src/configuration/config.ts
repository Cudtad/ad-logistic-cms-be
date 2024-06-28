import type { Config, Environment } from './config.interface';

const config: Config = {
  environment: process.env.NODE_ENV as Environment,
  nest: {
    port: parseInt(process.env.PORT, 10) || 3000,
    path: 'api',
  },
  cors: {
    enabled: true,
    origins: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
    ],
  },
  swagger: {
    enabled: true,
    title: 'NDExpress BE Service',
    description: 'NDExpress BE Service API description',
    version: '1.0',
    path: 'api/docs',
  },
  security: {
    expiresIn: '7d',
    refreshIn: '7d',
    bcryptSaltOrRound: 12,
    jwtSecretKey: process.env.JWT_SECRET_KEY || 'ndexpress',
  },
  auspost: {
    apiUrl: process.env.AUSPOST_API_URL,
    username: process.env.AUSPOST_USERNAME,
    password: process.env.AUSPOST_PASSWORD,
    accountNumberApdi: process.env.AUSPOST_ACCOUNT_NUMBER_APDI,
  },
  space: {
    endpoint: process.env.SPACE_ENDPOINT,
    accessKey: process.env.SPACE_ACCESS_KEY,
    secretKey: process.env.SPACE_SECRET_KEY,
    bucketName: process.env.SPACE_BUCKET,
    region: process.env.SPACE_REGION,
    cdnUrl: process.env.SPACE_CDN_URL,
  },
};

export default (): Config => config;
