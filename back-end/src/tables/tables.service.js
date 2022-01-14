module.exports = db => {

function list() {
    return db('tables')
        .select('*')
        .orderBy('table_name')
}

function create(newTable) {
    return db('tables')
        .insert(newTable)
        .returning('*')
        .then((createdTable) => createdTable[0]);
}

function update(table_id, reservation_id) {
    return db.transaction(function(trx) {
        db('tables')
            .update({ reservation_id })
            .where({ table_id })
            .transacting(trx)
            .then(() => {
                return db('reservations')
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
    return db.transaction(function(trx) {
        db('tables')
            .update('reservation_id', null)
            .where({ table_id })
            .transacting(trx)
            .then(() => {
                return db('reservations')
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
    return db('reservations')
        .select('*')
        .where({ reservation_id })
        .then(reservationFound => reservationFound[0])
}

function read(table_id) {
    return db('tables')
        .select('*')
        .where({ table_id })
        .then((tableFound) => tableFound[0])
}

async function destroy(table_id) {
    return db('tables')
        .del()
        .where({ table_id })
}

return {
    list,
    create,
    update,
    findReservation,
    read,
    unseat,
    destroy
}

}