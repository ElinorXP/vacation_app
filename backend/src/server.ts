import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import session from 'express-session';

// import dotenv from 'dotenv';
import * as dotenv from 'dotenv';
import {Router} from './routes/router';
//require("dotenv").config();

dotenv.config(); // creates an object

const app = express();

// app.use(session({
//   secret: 'some-secret',
//   resave: false,
//   saveUninitialized: false,
// }));

app.use(bodyParser.json({limit: '50mb'})); // כל בקשה כי אין תנאי (ראוט)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const router = Router.getRouter();
app.use('/api', router); // מה שמתחיל בסלאש אייפיאיי
// מידלוור מטפל בכל הבקשות - post, get, put
// get מטפל במה שרשמנו לו

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});