const request = require("supertest");
const app = require("../src");
const mongoose = require("mongoose");

describe("Endpoints de Libros", () => {

  test("Debería obtener una lista de libros", async () => {
      const res = await request(app).get("/libros");
      
      expect(res.statusCode).toEqual(200);
      
      expect(Array.isArray(res.body)).toBe(true); 
      
  });
  test("Debería crear un nuevo libro", async () => {
      const res = await request(app)
          .post("/libros")
          .send({ titulo: "Libro prueba", autor: "Autor prueba" });
      
      expect(res.statusCode).toEqual(200);
      
      expect(res.body.titulo).toEqual("Libro prueba")
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
        await mongoose.connection.close()
    });
});