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

module.exports = {
    list,
    create,
}