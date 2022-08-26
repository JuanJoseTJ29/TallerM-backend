//Importamos la libreria mysql
const mysql = require('mysql');
//Delcaramos el pormisify
const { promisify }= require('util');
//Traemos la credenciales del keys
const { database } = require('./keys');
//Creamos el pool
const pool = mysql.createPool(database);
//Se crea la conexion
pool.getConnection((err, connection) => {

    //Codicional de la conexion
    if (connection) connection.release();
//Retorno de la conexion
    return true;
  });


  // Promisify Pool Querys, determinando la query para la bd
pool.query = promisify(pool.query);
//Se exporta el pool
module.exports = pool;
