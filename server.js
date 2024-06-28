import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { check } from './src/config/connectDB.js';

import initRouter from './src/routers/index.js';
dotenv.config();


const app = express();

app.use(cors({
    credentials: true,
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  }));

app.get('/',(req,res)=>{
    res.send('server is running');
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initRouter(app);

check()
  .then(() => {
    const hostname = process.env.HOST;
    const port = process.env.PORT;
    app.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
      });
  })
  .catch(error => {
    console.error('Error connecting to database:', error);
    process.exit(1); // Exit the process if database connection fails
  });