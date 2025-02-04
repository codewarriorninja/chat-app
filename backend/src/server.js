import express from "express"
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { connect } from "./lib/db.js"
import cookieParser from "cookie-parser"
import messageRoute from "./routes/message.route.js"
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());  

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connect();
})