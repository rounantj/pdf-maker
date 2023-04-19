import mongoose from 'mongoose';

const connectToMongo = async () => {
  try {
    const mongoUri = process.env.MONGO ?? '';
    console.log({mongoUri})
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:');
  }
};

export default connectToMongo;
