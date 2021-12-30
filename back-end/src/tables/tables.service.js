const knex = require('../db/connection');

async function list() {
    return knex('tables')
        .select('*');
}

async function create(newTable) {
    return knex('tables')
        .insert(newTable)
        .returning('*')
        .then((createdTable) => createdTable[0]);
}

async function update(table_id, reservation_id) {
    return knex('tables')
        .update({ reservation_id })
        .where({ table_id })
        .returning('*');
}

async function findReservation(reservation_id) {
    return knex('reservations')
        .select('*')
        .where({ reservation_id })
        .then(reservationFound => reservationFound[0])
}

module.exports = {
    list,
    create,
    update,
    findReservation,
}