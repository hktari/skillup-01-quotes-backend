const Sequelize = require('sequelize')

console.debug(`database: ${process.env.PGHOST}:5432 ${process.env.PGDATABASE}\tuser: ${process.env.PGUSER}:${process.env.PGPASSWORD}`)

const sequelizeInstance = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASSWORD,
    {
        host: process.env.PGHOST,
        dialect: 'postgres',
    },
)
export default sequelizeInstance