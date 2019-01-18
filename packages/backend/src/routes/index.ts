import express from 'express';
import { candidate } from './candidate';
import { form } from './form';
import { recruitment } from './recruitment';
import { sms } from './sms';
import { user } from './user';
const app = express();

app.use('/candidate', candidate);
app.use('/form', form);
app.use('/sms', sms);
app.use('/recruitment', recruitment);
app.use('/user', user);

export const routes = app;
