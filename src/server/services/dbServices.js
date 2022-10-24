const { pool } = require('../db/connect.js')

/*const getMembers = async () => {
    try {
        const queryResult = await pool.query(`SELECT a.*, b.* FROM _a_gestion_projet.membres a LEFT JOIN _a_gestion_projet.v_membres_metrics b ON a.id_membre = b.id_membre`)
        if (queryResult.rows[0] === undefined) {
            throw new Error(`Aucun membre n'a été trouvé`)
        }
        return queryResult
    } catch (e) {
        throw new Error(e.message)
    }
}*/

module.exports = {
    //getMembers,
}