import * as express from "express";
import { json } from "body-parser";
import sequelize from './util/database'

import { deleteDynamoDbItem, getDynamoDbItem, putDynamoDbItem, updateDynamoDbItem } from "./dynamodb-item";
import { deletePostgresItem, getPostgresDbItem, createPostgresDbItem, updatePostgresItem  } from "./postgresdb-item";
import { deleteItem, getItem, putItem, updateItem, listItems } from "./local-item";
import { createMysqlItem, deleteMysqlItem, getMysqlItem, updateMysqlItem } from "./mysql-item";

import usersController from "./controllers/users-controller"

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

// App handlers
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req:any, res:any) => {
  res.status(200).send("hello world!");
});

app.get("/ping", (req:any, res:any) => {
  res.status(200).send("pong");
});

app.get("/healthy", (req:any, res:any) => {
  res.status(200).send("healthy");
});

app.use('/users', usersController);


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