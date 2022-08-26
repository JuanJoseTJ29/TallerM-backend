// Framework de nodejs

const express = require('express')
// Definicion del router/*
const router = express.Router()

//const path =require('path');
//const app = express();
//Cloudinary

const cloudinary =  require("cloudinary").v2
const fileUpload = require("express-fileupload")
//const app = express();

router.use(fileUpload({
  useTempFiles: true,
  limits:{ fileSize: 50 * 2024 * 1024 }
}));



function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}


cloudinary.config({ 
  cloud_name: 'dosagd7cz', 
  api_key: '895824937963234', 
  api_secret: 'kb8oqgk7OxpY4MLwt5wfQ_5bq0Q' 
});



// conexion a la BD
const pool = require('../src/database')

router.post('/incidencias',  

async  (req, res, next) =>  {
 // if(file) {
  let { titulo, lugar, categoria, descripcion, id_usuario: id_usuarios } = req.body
  const file = req.files.image 

  const resulta = await cloudinary.uploader.upload(file.tempFilePath, {
    public_id: `${Date.now}`,
    resource_type: "auto",
    folder: between(10, 2000)
})

  let fotoo = `${resulta.url}`

  let newIncidencia = {
    titulo,
    lugar,
    categoria,
    descripcion,
    foto:fotoo,
    id_usuarios
  }
  console.log(newIncidencia)
  try {
    const a = await pool.query('INSERT INTO incidencias set ? ', newIncidencia)
    res.status(200).json({
      a
    })

    // Manejo de errro
    // EMpezamos con el catch
  } catch (err) {
    // Envio a middleware
    next(err)
  }
//}
}
)
//router.get('/images', (req, res) => {});
router.get('/incidencias/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const incidencias = await pool.query('SELECT * FROM incidencias WHERE id_usuarios = ?', [id])
    res.status(200).json({
      incidencias
    })

    // Manejo de errror
    // EMpezamos con el catch
  } catch (err) {
    // Envio a middleware
    next(err)
  }
})

// Metodo get para eliminar la unica incidencia.
router.delete('/incident/:id', async (req, res, next) => {
  const { id } = req.params
  console.log(id)
  try {
    let incidencia = await pool.query('DELETE FROM incidencias WHERE id_incidencias = ?', [id])
    res.status(200).json({
      incidencia
    })
  } catch (err) {
    next(err)
  }
})

// Modificamos las incidencias
router.put('/incident/:id', async (req, res, next) => {
  const { id } = req.params

  const { titulo, lugar, categoria, descripcion, foto } = req.body

  try {
    // Actualizar el la situacion de los alumnos en la tabla curso_usario, dependiendo del curso y usuario.
    await pool.query('UPDATE incidencias SET titulo = ?, lugar = ?, categoria = ?, descripcion = ?, foto = ? WHERE id_incidencias = ?', [titulo, lugar, categoria, descripcion, foto, id])
    // Se guarda en una variable los datos de la tabla curso_usuario depeniendo el curso_id y usuario_id.
    const mostrarIncidenciaActualizada = await pool.query('SELECT * FROM incidencias WHERE id_incidencias = ?', [id])
    // Se manda la variable sobre como se encuentra actualizada
    // Respuesta a la peticion
    res.status(200).json(mostrarIncidenciaActualizada)
    // Manejo de errror
    // EMpezamos con el catch
  } catch (err) {
    // Envio a middleware
    next(err)
  }
})

module.exports = router
