const service = require('./tables.service');

async function list(req, res) {
    const data = await service.list();
    res.json({ data })
}

async function create(req, res) {
    const { data } = req.body;
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
    create,
    update,
}