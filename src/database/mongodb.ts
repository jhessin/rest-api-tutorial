import mongoose from "mongoose";

const { MONGODB_PATH, MONGODB_USER, MONGODB_PASS } = process.env;
const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_PATH}`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

export default mongoose;
