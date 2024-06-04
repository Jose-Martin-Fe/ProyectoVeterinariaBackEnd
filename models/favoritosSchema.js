const { Schema, model, Types } = require("mongoose");

const FavsSchema = new Schema({
  idUser: {
    type: Types.ObjectId,
  },
  products: [],
});

const FavoritoModel = model("favoritos", FavsSchema);
module.exports = FavoritoModel;
