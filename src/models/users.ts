import * as Sequelize from 'sequelize'
import db from '../util/database'

const User = db.define('users', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    username:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    userProfileImg:{
        type: Sequelize.STRING,
        allowNull: true
    }
})

export default User;