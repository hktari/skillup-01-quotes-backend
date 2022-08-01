import * as express from "express";
import { json } from "body-parser";
import sequelize from './util/database'

import usersController from "./controllers/users-controller"
import quotesController from './controllers/quotes-controller'
import authController from './controllers/auth-controller'
import { authenticateToken } from './util/auth'

import setupRelations from './models/relations'
setupRelations()

import { config, config as configEnvVars } from 'dotenv'
const configReadin = configEnvVars();

if (configReadin.error) {
  console.error('Error reading environment variables', configReadin.error);
}


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App handlers
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req: any, res: any) => {
  res.status(200).send("hello world!");
});

app.get("/ping", (req: any, res: any) => {
  res.status(200).send("pong");
});

app.get("/healthy", (req: any, res: any) => {
  res.status(200).send("healthy");
});

app.use(authController);

app.use('/users', authenticateToken, usersController);
app.use('/quotes', authenticateToken, quotesController);

const start = async () => {
  try {
    await sequelize.sync(
      { force: false } // Reset db every time
    );

    app.listen(PORT, HOST);
    console.log(`Running on http://${HOST}:${PORT}`);
  } catch (error) {
    console.log(error);
  }
};

start();