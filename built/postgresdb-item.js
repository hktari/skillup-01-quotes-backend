"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostgresItem = exports.updatePostgresItem = exports.createPostgresDbItem = exports.getPostgresDbItem = void 0;
const server_helpers_1 = require("./server-helpers");
const postgres_1 = require("./config/postgres");
/**
 * Get All or a single item
 *
 * @verb GET
 * @route [/postgresql-item/:id or /postgresql-item/]
 *
 * @param req.params.id
 * @returns an array of Items or a single Item
 */
async function getPostgresDbItem(req, res) {
    server_helpers_1.addHeadersToResponse(res);
    try {
        const client = await postgres_1.pool.connect();
        await client.query('CREATE TABLE IF NOT EXISTS "items" ("id" SERIAL PRIMARY KEY,"title" varchar(30),"content" varchar(30));');
        let queryResult;
        if (!req.params.id) {
            const toRet = await client.query('SELECT * from items');
            queryResult = toRet.rows;
        }
        else {
            const toRet = await client.query('SELECT * from items WHERE id = $1', [req.params.id]);
            queryResult = toRet.rows[0];
        }
        client.release();
        return res.status(200).json(queryResult);
    }
    catch (error) {
        return res.status(500).json('Error on getPostgresDbItem' + error);
    }
}
exports.getPostgresDbItem = getPostgresDbItem;
/**
 * Create a new Item
 *
 * @verb PUT
 * @route [/postgresql-item/]
 *
 * @body The body wihch contains the values, in JSON format
 * @returns the body to create the Item
 */
async function createPostgresDbItem(req, res) {
    server_helpers_1.addHeadersToResponse(res);
    try {
        const client = await postgres_1.pool.connect();
        await client.query('CREATE TABLE IF NOT EXISTS "items" ("id" SERIAL PRIMARY KEY,"title" varchar(30),"content" varchar(30));');
        await client.query('INSERT INTO items (title, content) VALUES ($1,$2)', [req.body.title, req.body.content]);
        await client.release();
        return res.status(201).json(req.body);
    }
    catch (error) {
        return res.status(500).json(error);
    }
}
exports.createPostgresDbItem = createPostgresDbItem;
/**
 * Update an existing Item
 *
 * @verb POST
 * @route [/postgresql-item/:id]
 *
 * @body The body wihch contains the updated values, in JSON format
 * @param req.params.id
 * @returns the id of the Updated Item
 */
async function updatePostgresItem(req, res) {
    server_helpers_1.addHeadersToResponse(res);
    try {
        const client = await postgres_1.pool.connect();
        await client.query('CREATE TABLE IF NOT EXISTS "items" ("id" SERIAL PRIMARY KEY,"title" varchar(30),"content" varchar(30));');
        await client.query(`UPDATE items SET title = $1 WHERE id = $2`, [req.body.title, req.params.id]);
        client.release();
        return res.status(200).json('Updated id ' + req.params.id);
    }
    catch (error) {
        return res.status(500).json('Error on deletePostgresDbItem' + error);
    }
}
exports.updatePostgresItem = updatePostgresItem;
/**
 * Delete an existing Item
 *
 * @verb DELETE
 * @route [/postgresql-item/:id]
 *
 * @param req.params.id
 * @returns the id of the Deleted Item
 */
async function deletePostgresItem(req, res) {
    server_helpers_1.addHeadersToResponse(res);
    try {
        console.log(req.params.id);
        const client = await postgres_1.pool.connect();
        await client.query('CREATE TABLE IF NOT EXISTS "items" ("id" SERIAL PRIMARY KEY,"title" varchar(30),"content" varchar(30));');
        await client.query('DELETE from items WHERE id = $1', [req.params.id]);
        client.release();
        return res.status(200).json('Removed id ' + req.params.id);
    }
    catch (error) {
        return res.status(500).json('Error on deletePostgresDbItem' + error);
    }
}
exports.deletePostgresItem = deletePostgresItem;
//# sourceMappingURL=postgresdb-item.js.map