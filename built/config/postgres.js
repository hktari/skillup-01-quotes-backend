"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    host: process.env.PG_HOST || '0.0.0.0',
    port: parseInt(process.env.PG_PORT || '5432'),
    user: process.env.PG_USERNAME || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    database: process.env.PG_DATABASE || 'postgres',
});
//# sourceMappingURL=postgres.js.map