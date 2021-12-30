function tableFormatValidator() {
    return function(req, res, next) {
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
}

module.exports = tableFormatValidator;