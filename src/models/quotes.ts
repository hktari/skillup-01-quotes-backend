import { emptyQuery } from 'pg-protocol/dist/messages'
import * as Sequelize from 'sequelize'
import db from '../util/database'

const Quotes = db.define('quotes', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    text:{
        type: Sequelize.STRING
    },
    voteCount:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
})



export default Quotes;