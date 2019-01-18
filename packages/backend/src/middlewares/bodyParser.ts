import bodyParser from 'body-parser';

export const jsonParser = bodyParser.json({ limit: '1mb' });

export const urlencodedParser = bodyParser.urlencoded({ extended: true });
