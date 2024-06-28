export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export interface Config {
  environment: Environment;
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  security: SecurityConfig;
  auspost: AuspostConfig;
  space: SpaceConfig;
}

export interface NestConfig {
  port: number;
  path: string;
}

export interface CorsConfig {
  enabled: boolean;
  origins: string[];
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
  jwtSecretKey: string;
}

export interface AuspostConfig {
  apiUrl: string;
  username: string;
  password: string;
  accountNumberApdi: string;
}

export interface SpaceConfig {
  endpoint: string;
  accessKey: string;
  secretKey: string;
  bucketName: string;
  region: string;
  cdnUrl: string;
}
