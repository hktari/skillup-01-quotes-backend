"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.putItem = exports.listItems = exports.getItem = void 0;
const uuid = require("uuid");
const server_helpers_1 = require("./server-helpers");
const items = new Map();
function getItem(req, res) {
    server_helpers_1.addHeadersToResponse(res);
    if (req.query.itemId) {
        const toReturn = items.get(req.query.itemId);
        toReturn.itemId = req.query.itemId;
        return res.status(200).json(toReturn);
    }
    else {
        res.status(400).json("No itemId provided");
    }
}
exports.getItem = getItem;
// return the list of all items
function listItems(req, res) {
    server_helpers_1.addHeadersToResponse(res);
    const reducedItems = [];
    items.forEach((value, key) => {
        reducedItems.push(Object.assign({ itemId: key }, value));
    });
    res.status(200).send(reducedItems);
}
exports.listItems = listItems;
function putItem(req, res) {
    server_helpers_1.addHeadersToResponse(res);
    const body = req.body;
    const id = uuid.v4();
    items.set(id, {
        title: body.title,
        content: body.content
    });
    res.status(200).send({
        id: id,
        title: body.title,
        content: body.content,
    });
}
exports.putItem = putItem;
function updateItem(req, res) {
    server_helpers_1.addHeadersToResponse(res);
    const body = req.body;
    const id = req.params.id;
    if (!body || !id) {
        res.status(500).send();
    }
    else {
        items.set(id, {
            title: body.title,
            content: body.content
        });
        res.status(200).send();
    }
}
exports.updateItem = updateItem;
function deleteItem(req, res) {
    server_helpers_1.addHeadersToResponse(res);
    const body = req.body;
    const id = req.params.id;
    if (!body || !body.id) {
        res.status(500).send();
    }
    else {
        items.delete(body.id);
        res.status(200).send();
    }
}
exports.deleteItem = deleteItem;
//# sourceMappingURL=local-item.js.map