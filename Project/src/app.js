import express from 'express';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

import userRouter from "./routes/user.js";
app.use('/api/users', userRouter);


mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => {
        console.log('connection to mongo successfull');
        app.listen(process.env.PORT, () => {
            console.log(`listening on port ${process.env.PORT}`);
        })
    })