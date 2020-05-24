const pgp = require('pg-promise');

const sql = pgp.utils.enumSql(__dirname, {recursive: true}, file => {
    return new pgp.QueryFile(file, {minify: true});
});

module.exports = sql