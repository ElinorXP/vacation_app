import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import session from 'express-session';

import * as dotenv from 'dotenv';
import {Router} from './routes/router';

dotenv.config();

const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const router = Router.getRouter();
app.use('/api', router);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});