import mongoose from "mongoose"

const connect = async (): Promise<mongoose.Mongoose> => {
  const db = await mongoose.connect('mongodb://127.0.0.1:27017/imagine');
  return db
}

export default connect