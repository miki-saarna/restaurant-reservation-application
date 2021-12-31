const knex = require('../db/connection');

// order by right here!!!
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
        .returning('*')
        .then((updatedTable) => updatedTable[0]);
}

function unseat(table_id) {
    return knex('tables')
        .update('reservation_id', null)
        .where({ table_id })
        .returning('*')
        .then(unseatedTable => unseatedTable[0])
}

async function findReservation(reservation_id) {
    return knex('reservations')
        .select('*')
        .where({ reservation_id })
        .then(reservationFound => reservationFound[0])
}

async function read(table_id) {
    return knex('tables')
        .select('*')
        .where({ table_id })
        .then((tableFound) => tableFound[0])
}

async function destroy(table_id) {
    
}

async function join() {
    return knex("tables as t")
        .join("reservations as r", "t.reservation_id", "r.reservation_id")
        .select("t.*", "r.*");
}

module.exports = {
    list,
    create,
    update,
    findReservation,
    read,
    destroy,
    join,
    unseat
}