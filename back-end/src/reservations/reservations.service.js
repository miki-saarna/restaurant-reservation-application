module.exports = db => {

async function list() {
    return db('reservations')
        .select('*')
        .whereIn('status', ['booked', 'seated'])
        // .orderBy("reservation_date")
        // .orderBy("reservation_time")
}

async function readByDate(date) {
    return db('reservations')
        .select('*')
        .where('reservation_date', date)
        .whereIn('status', ['booked', 'seated'])
        .orderBy("reservation_time")
}

async function readByNumber(mobile_number) {
    return db('reservations')
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date")
}

async function readByReservationId(reservation_id) {
    return db('reservations')
        .where({ reservation_id })
        .returning('*')
        .then(foundReservation => foundReservation[0])
}

async function read(reservation_id) {
    return db('reservations')
        .select('*')
        .where({ reservation_id })
        .then((foundReservation) => foundReservation[0])
}

async function create(newReservation) {
    return db('reservations')
        .insert(newReservation)
        .returning('*')
        .then(createdReservation => createdReservation[0])
}

async function destroy(id) {
    return db('reservations')
        .del()
        .where('reservation_id', id)
}

async function updateStatus(reservation_id, status) {
    return db('reservations')
        .update({ status })
        .where({ reservation_id })
        .returning('*')
        .then(updatedReservation => updatedReservation[0])
}

async function edit(edittedReservation) {
    return db('reservations')
        .update(edittedReservation, '*')
        .where('reservation_id', edittedReservation.reservation_id)
        .returning('*')
        .then((editted) => editted[0])

}

return {
    list,
    readByDate,
    readByNumber,
    readByReservationId,
    read,
    create,
    destroy,
    updateStatus,
    edit
}

}