import { Model, NativeError, ObjectId, Schema } from "mongoose";
import bcrypt from "bcrypt";
import mongoose from "../database/mongodb";

type NextFunction = (err?: NativeError, result?: any) => void;

export interface IUser extends Document {
  _id: ObjectId;
  username: string;
  password: string;
  comparePassword: (password: string, next: NextFunction) => void;
  animals: ObjectId[];
}

const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
  animals: [
    {
      type: Schema.Types.ObjectId,
      ref: "animal",
    },
  ],
});

function updatePassword(user: IUser, next: (err?: NativeError) => void) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
}

userSchema.pre("save", function (next) {
  updatePassword(this, next);
});

userSchema.methods.comparePassword = function (
  password: string,
  next: (err?: NativeError, result?: any) => void
) {
  bcrypt.compare(
    password,
    this.password,
    function (err: NativeError, isMatch: boolean) {
      if (err) return next(err);

      return next(null, isMatch);
    }
  );
};

export const User: Model<IUser> = mongoose.model("user", userSchema);
