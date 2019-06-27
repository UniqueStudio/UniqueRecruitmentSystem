import { json, urlencoded } from 'express'; // doesn't need body-parser anymore

export const jsonParser = json({ limit: '1mb' });

export const urlencodedParser = urlencoded({ extended: true });
