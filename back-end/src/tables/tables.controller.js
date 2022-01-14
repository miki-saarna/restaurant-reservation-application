const service = require('./tables.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')
const hasProperties = require('../errors/hasProperties');
const mergeSort = require('../utils/sorting/mergeSort');
const tableFormatValidator = require('../utils/validators/tableFormatValidator');
const { compareByTableName } = require('../utils/sorting/compare');

const REQUIRED_PROPERTIES = [
    'table_name',
    'capacity',
]

const hasRequiredProperties = hasProperties(...REQUIRED_PROPERTIES);

// function validProperties(req, res, next) {
//     const { data = {} } = req.body;
//     const invalidProperties = [];
//     Object.keys(data).forEach((property) => {
//         if (!REQUIRED_PROPERTIES.includes(property)) {
//             invalidProperties.push(property)
//         }
//     })
//     if (invalidProperties.length) {
//         return next({ status: 400, message: `Contains invalid properties: ${invalidProperties.join(', ')}`})
//     }
//     res.locals.data = data;
//     next();
// }

async function tableExists(req, res, next) {
    const { table_id } = req.params;
    const tableFound = await service(req.app.get('db')).read(table_id);
    if (!tableFound) return next({ status: 404, message: `Cannot find table with ID: '${table_id}'`});
    res.locals.table_id = table_id;
    res.locals.table = tableFound;
    next();
}

async function reservationExists(req, res, next) {
    const { data: { reservation_id } = {} } = req.body;
    if (!reservation_id) {
        return next({ status: 400, message: `reservation_id field is missing.`})
    }

    const foundReservation = await service(req.app.get('db')).findReservation(reservation_id);
    if (!foundReservation) {
        return next({ status: 404, message: `Reservation with ID '${reservation_id}' does not exist.`})
    }

    res.locals.foundReservation = foundReservation;
    next();
}

async function reservationNotSeated(req, res, next) {
    const foundReservation = res.locals.foundReservation;
    if (foundReservation.status === 'seated') {
        return next({ status: 400, message: `Cannot seat a reservations that is already seated.`})
    } 
    next();
}
    
function tableIsNotOccupied(req, res, next) {
    const table = res.locals.table;
    if (!table.reservation_id) return next({ status: 400, message: `Cannot unseat a table that is not occupied.`});
    res.locals.reservation_id = table.reservation_id
    next();
}

function tableIsOccupied(req, res, next) {
    const table = res.locals.table;
    if (table.reservation_id) return next({ status: 400, message: `Cannot delete a table that is occupied.`});
    next();
}

async function list(req, res) {
    const data = await service(req.app.get('db')).list();
    res.json({ data })
}

async function read(req, res) {
    const data = res.locals.foundReservation;
    res.json({ data })
}

async function create(req, res) {
    const data = res.locals.data
    const newTable = await service(req.app.get('db')).create(data);
    res.status(201).json({ data: newTable })
}

async function update(req, res, next) {
    const table = res.locals.table;
    const foundReservation = res.locals.foundReservation;

    // checking reservation size and table capacity
    if (foundReservation.people > table.capacity) return next({ status: 400, message: `This table's capacity of ${table.capacity} is not big enough to seat all ${foundReservation.people} guests for this reservation.`})

    // checking if currently selected table is occupied
    if (table.reservation_id) return next({ status: 400, message: `This table is currently occupied.`})

    const tableAssignedToReservation = await service(req.app.get('db')).update(table.table_id, foundReservation.reservation_id)
    res.json({ data: tableAssignedToReservation })
}


async function unseat(req, res) {
    const table_id = res.locals.table.table_id;
    const reservation_id = res.locals.reservation_id;
    const data = await service(req.app.get('db')).unseat(table_id, reservation_id);
    // error occures if not responding with data... initially used status code 204, but tests fail...
    // res.sendStatus(200);
    res.json({ data })
}

async function destroy(req, res) {
    const table_id = res.locals.table_id;
    await service(req.app.get('db')).destroy(table_id);
    res.sendStatus(204)
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [hasRequiredProperties, tableFormatValidator(), asyncErrorBoundary(create)],
    update: [asyncErrorBoundary(tableExists), asyncErrorBoundary(reservationExists), reservationNotSeated, asyncErrorBoundary(update)],
    unseat: [asyncErrorBoundary(tableExists), tableIsNotOccupied, asyncErrorBoundary(unseat)],
    read: [tableExists, asyncErrorBoundary(read)],
    destroy: [tableExists, tableIsOccupied, asyncErrorBoundary(destroy)],
}