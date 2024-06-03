const { Schema, model, Types } = require("mongoose");

const CartSchema = new Schema({
  idUser: {
    type: Types.ObjectId,
  },
  products: [],
});

const CarritoModel = model("carritos", CartSchema);
module.exports = CarritoModel;
