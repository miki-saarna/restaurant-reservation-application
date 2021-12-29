const service = require('./tables.service');

const REQUIRED_PROPERTIES = [
    'table_name',
    'capacity',
]

function validProperties(req, res, next) {
    const { data = {} } = req.body;
    const invalidProperties = [];
    Object.keys(data).forEach((property) => {
        if (!REQUIRED_PROPERTIES.includes(property)) {
            invalidProperties.push(property)
        }
    })
    if (invalidProperties.length) {
        return next({ status: 400, message: `Contains invalid properties: ${invalidProperties.join(', ')}`})
    }
    res.locals.data = data;
    next();
}

function correctFormat(req, res, next) {
    const { table_name, capacity } = res.locals.data;
    console.log(table_name.length)
    if (table_name.length < 2) {
        return next({ status: 400, message: `The 'table_name' must contain at least 2 characters.` })
    } 
    if (typeof capacity !== 'number') {
        return next({ status: 400, message: `The date type of capacity should be a number.`})
    }
    next()
}

function hasRequiredProperties(properties) {
    return function (req, res, next) {
        const { data } = req.body;
        try {
            properties.forEach((property) => {
                if (!data[property]) {
                    const error = new Error(`A '${property}' property is required.`)
                    error.status = 400;
                    throw error;
                }
            })
            next()
        } catch(error) {
            next(error)
        }
    }
}

async function list(req, res) {
    const data = await service.list();
    // below line doesn't work for alphabetical sort... 
    const sortedData = data.sort((tableA, tableB) => tableA.table_name - tableB.table_name)
    res.json({ data: sortedData })
}

async function create(req, res) {
    // const { data } = req.body;
    const data = res.locals.data
    const newTable = await service.create(data);
    res.status(201).json({ data: newTable })
}

async function update(req, res) {
    const { table_id } = req.params;
    const { data: { reservation_id } } = req.body;
    const tableAssignedToReservation = await service.update(table_id, reservation_id)
    res.json({ data: tableAssignedToReservation })
}

module.exports = {
    list,
    create: [validProperties, hasRequiredProperties(REQUIRED_PROPERTIES), correctFormat, create],
    update,
}