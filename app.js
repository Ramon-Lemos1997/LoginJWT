require('dotenv').config();
const express = require('express');
const app = express();
const userRouter = require('./routes/userRouter');
const adminRouter= require('./routes/adminRouter')
const mongoose = require('mongoose');

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to database');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

connectToDatabase();

app.use('/user', express.json(), userRouter,);
app.use('/admin', express.json(), adminRouter)

app.listen(process.env.PORT, () => {
  console.log('Server running');
});
