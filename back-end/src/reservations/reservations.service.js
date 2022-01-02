const knex = require('../db/connection');

async function list() {
    return knex('reservations').select('*');
}

async function readByDate(date) {
    return knex('reservations').select('*').where('reservation_date', date)
}

async function readByNumber(mobile_number) {
    return knex('reservations')
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date")
}

async function readByReservationId(reservation_id) {
    return knex('reservations')
        .where({ reservation_id })
        .returning('*')
        .then(foundReservation => foundReservation[0])
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

async function updateStatus(reservation_id, status) {
    return knex('reservations')
        .update({ status })
        .where({ reservation_id })
        .returning('*')
        .then(updatedReservation => updatedReservation[0])
}

async function edit(edittedReservation) {
    return knex('reservations')
        .update(edittedReservation, '*')
        .where('reservation_id', edittedReservation.reservation_id)
        .then((editted) => editted[0])

}

module.exports = {
    list,
    readByDate,
    create,
    destroy,
    read,
    updateStatus,
    readByNumber,
    readByReservationId,
    edit
}