import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://rohit:r02012004@cluster0.cqg71.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let cached = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
