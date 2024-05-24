const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  emailUsuario: {
    type: String,
    required: true,
    unique: true,
  },
  nombreUsuario: {
    type: String,
    require: true,
    unique: true,
  },
  contrasenia: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    default: "user",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  idCart: Types.ObjectId,
  idFav: Types.ObjectId,
});

userSchema.methods.toJSON = function () {
  const { __V, contrasenia, ...usuario } = this.toObject();
  return usuario;
};

const userModel = model("users", userSchema);
module.exports = userModel;
