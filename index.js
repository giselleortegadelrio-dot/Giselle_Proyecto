import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import recintosRouter from './routes/recintos.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventos';

// Middleware para procesar cuerpos en formato JSON
app.use(express.json());

// Rutas
app.use('/recintos', recintosRouter);

// Conexión a la base de datos MongoDB y puesta en marcha del servidor
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Conectado a la base de datos MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor en ejecución en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error.message);
  });

export default app;

