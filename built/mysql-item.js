"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMysqlItem = exports.updateMysqlItem = exports.createMysqlItem = exports.getMysqlItem = void 0;
const server_helpers_1 = require("./server-helpers");
const mysql_1 = require("./config/mysql");
/**
 * Get All or a single item
 *
 * @verb GET
 * @route [/postgresql-item/:id or /postgresql-item/]
 *
 * @param req.params.id
 * @returns an array of Items or a single Item
 */
async function getMysqlItem(req, res) {
    server_helpers_1.addHeadersToResponse(res);
    try {
        const client = await mysql_1.pool.getConnection();
        await client.query('CREATE TABLE IF NOT EXISTS "items" ("id" SERIAL PRIMARY KEY,"title" varchar(30),"content" varchar(30));');
        let queryResult;
        if (!req.params.id) {
            const toRet = await client.query('SELECT * from items');
            queryResult = toRet[1];
        }
        else {
            const toRet = await client.query('SELECT * from items WHERE id = $1', [req.params.id]);
            queryResult = toRet[1];
        }
        client.release();
        return res.status(200).json(queryResult);
    }
    catch (error) {
        return res.status(500).json('Error on getPostgresDbItem' + error);
    }
}
exports.getMysqlItem = getMysqlItem;
/**
 * Create a new Item
 *
 * @verb PUT
 * @route [/postgresql-item/]
 *
 * @body The body wihch contains the values, in JSON format
 * @returns the body to create the Item
 */
async function createMysqlItem(req, res) {
    server_helpers_1.addHeadersToResponse(res);
    try {
        const client = await mysql_1.pool.getConnection();
        await client.query('CREATE TABLE IF NOT EXISTS "items" ("id" SERIAL PRIMARY KEY,"title" varchar(30),"content" varchar(30));');
        await client.query('INSERT INTO items (title, content) VALUES ($1,$2)', [req.body.title, req.body.content]);
        await client.release();
        return res.status(201).json(req.body);
    }
    catch (error) {
        return res.status(500).json(error);
    }
}
exports.createMysqlItem = createMysqlItem;
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
async function updateMysqlItem(req, res) {
    server_helpers_1.addHeadersToResponse(res);
    try {
        const client = await mysql_1.pool.getConnection();
        await client.query('CREATE TABLE IF NOT EXISTS "items" ("id" SERIAL PRIMARY KEY,"title" varchar(30),"content" varchar(30));');
        await client.query(`UPDATE items SET title = $1 WHERE id = $2`, [req.body.title, req.params.id]);
        client.release();
        return res.status(200).json('Updated id ' + req.params.id);
    }
    catch (error) {
        return res.status(500).json('Error on deletePostgresDbItem' + error);
    }
}
exports.updateMysqlItem = updateMysqlItem;
/**
 * Delete an existing Item
 *
 * @verb DELETE
 * @route [/postgresql-item/:id]
 *
 * @param req.params.id
 * @returns the id of the Deleted Item
 */
async function deleteMysqlItem(req, res) {
    server_helpers_1.addHeadersToResponse(res);
    try {
        console.log(req.params.id);
        const client = await mysql_1.pool.getConnection();
        await client.query('CREATE TABLE IF NOT EXISTS "items" ("id" SERIAL PRIMARY KEY,"title" varchar(30),"content" varchar(30));');
        await client.query('DELETE from items WHERE id = $1', [req.params.id]);
        client.release();
        return res.status(200).json('Removed id ' + req.params.id);
    }
    catch (error) {
        return res.status(500).json('Error on deletePostgresDbItem' + error);
    }
}
exports.deleteMysqlItem = deleteMysqlItem;
//# sourceMappingURL=mysql-item.js.map