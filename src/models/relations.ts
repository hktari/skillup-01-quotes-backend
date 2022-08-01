import Quotes from './quotes'
import Users from './users'
import Votes from './votes'

export default function setupRelations() {
    Users.hasMany(Votes);
    Votes.belongsTo(Users);

    Quotes.hasMany(Votes);
    Votes.belongsTo(Quotes);

    Quotes.belongsTo(Users);
    Users.hasMany(Quotes);
}
