// const request = require("supertest");
// const app = require("../src");
// const mongoose = require("mongoose");

// describe("Endpoints de Libros", () => {

//   test("Debería obtener una lista de libros", async () => {
//       const res = await request(app).get("/libros");
      
//       expect(res.statusCode).toEqual(200);
      
//       expect(Array.isArray(res.body)).toBe(true);
      
//   });
//   test("Debería crear un nuevo libro", async () => {
//       const res = await request(app)
//           .post("/libros")
//           .send({ titulo: "Libro prueba", autor: "Autor prueba" });
      
//       expect(res.statusCode).toEqual(200);
      
//       expect(res.body.titulo).toEqual("Libro prueba")
//   });
    
//     test("Debería obtener un libro específico por ID", async () => {
//       const libro = new Libro({ titulo: "Libro de prueba", autor: "Autor de prueba" });
//       await libro.save();

//       const res = await request(app).get(`/libros/${libro._id}`);
//       expect(res.statusCode).toEqual(200);
//       expect(res.body).toHaveProperty('_id', libro._id.toString());
//       expect(res.body).toHaveProperty('titulo', libro.titulo);
//       expect(res.body).toHaveProperty('autor', libro.autor);
//   });


//   test("Debería eliminar un libro específico por ID", async () => {
//       const libro = new Libro({ titulo: "Libro de prueba", autor: "Autor de prueba" });
//       await libro.save();

//       const res = await request(app).delete(`/libros/${libro._id}`);
//       expect(res.statusCode).toEqual(204);

//       const libroInDb = await Libro.findById(libro._id);
//       expect(libroInDb).toBeNull();
//   });


    
//     afterAll(async () => {
//         await mongoose.connection.close()
//     });
// });

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Libro = mongoose.model('Libro');

beforeAll(async () => {
  const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/testdb';
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Libro.deleteMany({});
});

describe("Endpoints de Libros", () => {

  test("Debería crear un nuevo libro", async () => {
    const res = await request(app)
      .post("/libros")
      .send({ titulo: "Libro prueba", autor: "Autor prueba" });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.titulo).toEqual("Libro prueba");
    expect(res.body.autor).toEqual("Autor prueba");
  });

  test("Debería traer un listado de todos los libros", async () => {
    await new Libro({ titulo: "Libro 1", autor: "Autor 1" }).save();
    await new Libro({ titulo: "Libro 2", autor: "Autor 2" }).save();

    const res = await request(app).get("/libros");

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test("Debería obtener un libro específico por ID", async () => {
    const libro = new Libro({ titulo: "Libro de prueba", autor: "Autor de prueba" });
    await libro.save();

    const res = await request(app).get(`/libros/${libro._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', libro._id.toString());
    expect(res.body).toHaveProperty('titulo', libro.titulo);
    expect(res.body).toHaveProperty('autor', libro.autor);
  });


  test("Debería eliminar un libro específico por ID", async () => {
    const libro = new Libro({ titulo: "Libro de prueba", autor: "Autor de prueba" });
    await libro.save();

    const res = await request(app).delete(`/libros/${libro._id}`);
    expect(res.statusCode).toEqual(204);

    const libroInDb = await Libro.findById(libro._id);
    expect(libroInDb).toBeNull();
  });


afterAll(async () => {
  await mongoose.connection.close();
});
