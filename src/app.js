const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const mongoUri = process.env.MMONGODB_URI;
try {
  mongoose.connect("mongodb+srv://victorsantana25:a1b2c3d4e5@cluster0.se3wvql.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  console.log("Conectado a MongoDB");
} catch (error) {
  console.error("Error de conexión", error);
}
const libroSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
});
const Libro = mongoose.model("Libro", libroSchema);

// Crear nuevo libro

app.post("/libros", async (req, res) => {
  const libro = new Libro({
    titulo: req.body.titulo,
    autor: req.body.autor,
  });
  try {
    await libro.save();
    res.json(libro);
  } catch (error) {
    res.status(500).send("Error al guardar el libro");
  }
});

//Traer un listado de todos los libros
app.get("/libros", async (req, res) => {
  try {
    const libros = await Libro.find();
    res.json(libros);
  } catch (error) {
    res.status(500).send("Error al obtener los libros", error);
  }
});

// Obtener un libro específico por ID

app.get("/libros/:id", async (req, res) => {
    try {
      const libro = await Libro.findById(req.params.id);
      if (libro) {
        res.json(libro);
      } else {
        res.status(404).send("Libro no encontrado");
      }
    } catch (error) {
      res.status(500).send("Error al buscar el libro", error);
    }
});
  
// Eliminar un libro específico por ID
 app.delete("/libros/:id", async (req, res) => {
    try {
      const libro = await Libro.findByIdAndDelete(req.params.id);
      if (libro) {
        res.status(204).send();
      } else {
        res.status(404).send("Libro no encontrado");
      }
    } catch (error) {
      res.status(500).send("Error al eliminar el libro", error);
    }
  });

module.exports = app;