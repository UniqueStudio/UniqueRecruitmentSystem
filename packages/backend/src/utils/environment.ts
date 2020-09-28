import { ENV_DEV, ENV_PROD } from '@config/consts';

export const isDev = () => process.env.NODE_ENV === ENV_DEV;
export const isProd = () => process.env.NODE_ENV === ENV_PROD;
