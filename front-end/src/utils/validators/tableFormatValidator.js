export default function tableFormatValidator(setFrontendValidationError, table) {
    const { table_name, capacity } = table;

    // if table name is less than 2 characters in length
    if (table_name.length < 2) {
        setFrontendValidationError({ message: `The 'table_name' must contain at least 2 characters` })
        return true;
    } 
    // if table capacity is not a number
    if (capacity < 1 || !Number.isInteger(capacity)) {
        setFrontendValidationError({ message: 'The table\'s capacity must be a positive integer' })
        return true;
    }
}