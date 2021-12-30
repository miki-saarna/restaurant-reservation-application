const service = require('./tables.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')
const hasProperties = require('../errors/hasProperties');
const mergeSort = require('../utils/mergeSort');

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

function tableFormatValidation(req, res, next) {
    const { data } = req.body;
    
    if (data.table_name.length < 2) {
        return next({ status: 400, message: `The 'table_name' must contain at least 2 characters.` })
    } 

    if (typeof data.capacity !== 'number') {
        return next({ status: 400, message: `The date type of capacity should be a number.`})
    }

    next()
    res.locals.data = data;
}

function compareByTableName(left, right) {
    return left.table_name.toLowerCase() < right.table_name.toLowerCase() ? -1 : 1;
}

async function list(req, res) {
    const data = await service.list();
    const sortedData = mergeSort(compareByTableName, data);
    res.json({ data: sortedData })
}

async function create(req, res) {
    const data = res.locals.data
    const newTable = await service.create(data);
    res.status(201).json({ data: newTable })
}

async function update(req, res, next) {
    const { table_id } = req.params;
    const { data: { reservation_id } } = req.body;

    // move to validator function...
    if (!reservation_id) {
        return next({ status: 400, message: `reservation_id field is missing.`})
    }

    const foundReservation = await service.findReservation(reservation_id);
    
    if (!foundReservation) {
        return next({ status: 400, message: `Reservation with ID '${reservation_id}' does not exist.`})
    }

    const tableAssignedToReservation = await service.update(table_id, reservation_id)
    res.json({ data: tableAssignedToReservation })
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [hasRequiredProperties, tableFormatValidation, asyncErrorBoundary(create)],
    update: asyncErrorBoundary(update),
}