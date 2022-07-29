"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItem = exports.listItems = exports.deleteItem = exports.updateItem = exports.createItem = exports.getUserData = void 0;
const AWS = require("aws-sdk");
const ddbClient = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();
function getUserData(req) {
    const jwtToken = req.header('authorization').split(' ');
    var auth_params = {
        AccessToken: jwtToken[1]
    };
    return cognito.getUser(auth_params).promise().then(function (data) {
        const userAttr = new Map(data.UserAttributes.map(i => [i.Name, i.Value]));
        return userAttr.get('sub');
    }).catch(function (err) {
        console.log(err);
        throw err;
    });
}
exports.getUserData = getUserData;
function createItem(userId, itemId, title, content) {
    const params = {
        TableName: process.env.TABLE_NAME,
        // Item contains the following attributes:
        // - userId: authenticated user id from Cognito Identity pool
        // - itemId: a unique uuid for the item
        // - title: title of Item
        // - content: content of Item
        // - createdAt: current timestamp
        Item: {
            userId: userId,
            itemId: itemId,
            title: title,
            content: content,
            createdAt: Date.now()
        }
    };
    return ddbClient.put(params).promise();
}
exports.createItem = createItem;
function updateItem(userId, itemId, title, content) {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            "userId": userId,
            "itemId": itemId
        },
        UpdateExpression: "set info.title = :t, info.content=:c",
        ExpressionAttributeValues: {
            ":t": title,
            ":c": content,
        }
    };
    return ddbClient.update(params).promise();
}
exports.updateItem = updateItem;
function deleteItem(userId, itemId) {
    return ddbClient.delete({
        TableName: process.env.TABLE_NAME,
        Key: {
            "userId": userId,
            "itemId": itemId,
        }
    }).promise();
}
exports.deleteItem = deleteItem;
function listItems(userId) {
    const params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId
        }
    };
    return ddbClient.query(params).promise();
}
exports.listItems = listItems;
function getItem(userId, itemId) {
    return ddbClient.get({
        TableName: process.env.TABLE_NAME,
        Key: {
            "userId": userId,
            "itemId": itemId,
        }
    }).promise();
}
exports.getItem = getItem;
//# sourceMappingURL=aws-helpers.js.map