import mongoose from 'mongoose';

const recintoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  },
  direccion: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  localidad: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  aforoMaximo: {
    type: Number
  }
});

const Recinto = mongoose.model('recintos', recintoSchema);

export default Recinto;
