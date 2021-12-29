const knex = require('../db/connection');

async function list() {
    return knex('reservations').select('*');
}

async function readByDate(date) {
    return knex('reservations').select('*').where('reservation_date', date)
}

async function read(reservation_id) {
    return knex('reservations').select('*').where({ reservation_id }).then((foundReservation) => foundReservation[0])
}

async function create(newReservation) {
    return knex('reservations')
        .insert(newReservation)
        .returning('*')
        .then(createdReservation => createdReservation[0])
}

async function destroy(id) {
    return knex('reservations')
        .del()
        .where('reservation_id', id)
}

module.exports = {
    list,
    readByDate,
    create,
    destroy,
    read,
}