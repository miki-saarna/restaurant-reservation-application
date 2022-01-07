const knex = require('../db/connection');

function list() {
    return knex('tables')
        .select('*')
        .orderBy('table_name')
}

function create(newTable) {
    return knex('tables')
        .insert(newTable)
        .returning('*')
        .then((createdTable) => createdTable[0]);
}

function update(table_id, reservation_id) {
    return knex.transaction(function(trx) {
        knex('tables')
            .update({ reservation_id })
            .where({ table_id })
            .transacting(trx)
            .then(() => {
                return knex('reservations')
                    .update('status', 'seated')
                    .where({ reservation_id })
            })
            .then(trx.commit)
            .catch(trx.rollback);
    })
    .catch(function(error) {
        console.error(error);
    })
}


function unseat(table_id, reservation_id) {
    return knex.transaction(function(trx) {
        knex('tables')
            .update('reservation_id', null)
            .where({ table_id })
            .transacting(trx)
            .then(() => {
                return knex('reservations')
                    .update('status', 'finished')
                    .where({ reservation_id });
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
    .catch(function(error) {
        console.error(error);
    })
}

function findReservation(reservation_id) {
    return knex('reservations')
        .select('*')
        .where({ reservation_id })
        .then(reservationFound => reservationFound[0])
}

function read(table_id) {
    return knex('tables')
        .select('*')
        .where({ table_id })
        .then((tableFound) => tableFound[0])
}

async function destroy(table_id) {
    return knex('tables')
        .del()
        .where({ table_id })
}




module.exports = {
    list,
    create,
    update,
    findReservation,
    read,
    unseat,
    destroy
}