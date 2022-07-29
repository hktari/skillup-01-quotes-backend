"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDynamoDbItem = exports.updateDynamoDbItem = exports.putDynamoDbItem = exports.getDynamoDbItem = void 0;
const aws_helpers_1 = require("./aws-helpers");
const server_helpers_1 = require("./server-helpers");
const uuid = require("uuid");
async function getDynamoDbItem(req, res) {
    server_helpers_1.addHeadersToResponse(res);
    let promise;
    const body = req.body;
    if (!!req.body) {
        promise = aws_helpers_1.getItem("SYSTEM", body.itemId);
    }
    else {
        promise = aws_helpers_1.listItems("SYSTEM");
    }
    promise.then(function (data) {
        res.status(200).send(data);
    })
        .catch(function (err) {
        console.log(err);
        res.status(500).send();
    });
}
exports.getDynamoDbItem = getDynamoDbItem;
async function putDynamoDbItem(req, res) {
    const body = req.body;
    server_helpers_1.addHeadersToResponse(res);
    aws_helpers_1.createItem("SYSTEM", uuid.v4(), body.title, body.content)
        .then(function (data) {
        res.status(200).send();
    })
        .catch(function (err) {
        console.log(err);
        res.status(500).send();
    });
}
exports.putDynamoDbItem = putDynamoDbItem;
async function updateDynamoDbItem(req, res) {
    const body = req.body;
    server_helpers_1.addHeadersToResponse(res);
    aws_helpers_1.createItem("SYSTEM", body.itemId, body.title, body.content)
        .then(function (data) {
        res.status(200).send();
    })
        .catch(function (err) {
        console.log(err);
        res.status(500).send();
    });
}
exports.updateDynamoDbItem = updateDynamoDbItem;
async function deleteDynamoDbItem(req, res) {
    const body = req.body;
    server_helpers_1.addHeadersToResponse(res);
    aws_helpers_1.createItem("SYSTEM", uuid.v4(), body.title, body.content)
        .then(function (data) {
        res.status(200).send();
    })
        .catch(function (err) {
        console.log(err);
        res.status(500).send();
    });
}
exports.deleteDynamoDbItem = deleteDynamoDbItem;
//# sourceMappingURL=dynamodb-item.js.map