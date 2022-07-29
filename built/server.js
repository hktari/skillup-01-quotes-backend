"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const body_parser_1 = require("body-parser");
const local_user_1 = require("./local-user");
// Constants
const PORT = 8000;
const HOST = 'localhost';
// App handlers
const app = express();
const parser = body_parser_1.json();
app.get("/", (req, res) => {
    res.status(200).send("hello world!");
});
app.get("/ping", (req, res) => {
    res.status(200).send("pong");
});
app.get("/healthy", (req, res) => {
    res.status(200).send("healthy");
});
app.get('/users', parser, local_user_1.getAll);
app.post('/users', parser, local_user_1.createOne);
app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);
//# sourceMappingURL=server.js.map