function hasProperties(...properties) {
    return function(req, res, next) {
        const { data = {} } = req.body;

        // can I and should I simply this to NOT use try/catch?
        try {
            properties.forEach((property) => {
                if (!data[property]) {
                    const error = new Error(`A '${property}' is required.`)
                    error.status = 400;
                    throw error;
                }
            })
            next();
        } catch (error) {
            next(error)
        }
    }
}

module.exports = hasProperties