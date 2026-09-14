import 'dotenv/config';

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: Number(getEnvVar('PORT')),
  nodeEnv: getEnvVar('NODE_ENV'),
  databaseUrl: getEnvVar('DATABASE_URL'),
  jwtSecret: getEnvVar('JWT_SECRET'),
  jwtExpiresIn: getEnvVar('JWT_EXPIRES_IN'),
  corsOrigin: getEnvVar('CORS_ORIGIN'),
};