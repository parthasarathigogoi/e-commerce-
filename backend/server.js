require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI; // Ensure this is not undefined
if (!mongoURI) {
    console.error("MongoDB URI is missing. Check your .env file.");
    process.exit(1); // Exit the process if no URI is found
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));
