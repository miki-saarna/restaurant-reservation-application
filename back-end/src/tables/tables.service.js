const knex = require('../db/connection');

async function list() {
    return knex('tables')
        .select('*');
}

async function create(newTable) {
    return knex('tables')
        .insert(newTable)
        .returning('*');
}

module.exports = {
    list,
    create
}