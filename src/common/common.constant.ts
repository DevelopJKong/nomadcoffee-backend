import { join } from 'path';
export const PORT = process.env.PORT || 5000;
export const BACKEND_URL = process.env.BACKEND_URL;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
export const fileFolder = join(process.cwd(), `./files`);
export const PUB_SUB = 'PUB_SUB';
export const NEW_MESSAGE = 'NEW_MESSAGE';