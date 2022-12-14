import { emptyQuery } from 'pg-protocol/dist/messages'
import * as Sequelize from 'sequelize'
import { VoteState } from '../common/interface';
import db from '../util/database'

const Votes = db.define('votes', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    // userId: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: db.models.users,
    //         key: 'id'
    //     },
    //     unique: 'compositeIndex',
    // },
    // quoteId: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: db.models.quotes,
    //         key: 'id'
    //     },
    //     unique: 'compositeIndex',
    // },
    voteState: {
        type: Sequelize.INTEGER,
        allowNull: false,
        isIn: [[1, -1]],
    }
});

export default Votes;