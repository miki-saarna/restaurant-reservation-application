function compareByTableName(left, right) {
    return left.table_name.toLowerCase() < right.table_name.toLowerCase() ? -1 : 1;
}

module.exports = compareByTableName;