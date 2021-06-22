import { Schema, Document, ObjectId, Model } from "mongoose";
import mongoose from "../database/mongodb";

export interface IAnimal extends Document {
  //_id: ObjectId;
  type: string;
  name: string;
  owner: ObjectId;
}

export const animalSchema: Schema<IAnimal> = new Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

export const Animal: Model<IAnimal> = mongoose.model("animal", animalSchema);
