import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import * as http from 'http';
import { mongooseConnection } from './src/config/mongoose';
import { cloudinaryConfig } from './src/utils/cloudinary';
import userRouter from './src/routes/userRouter';

process.loadEnvFile()



const app=express()
const server=http.createServer(app)

mongooseConnection();
cloudinaryConfig()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:4200',
  }))


app.use('/', userRouter);

const port = process.env.LISTENING_PORT;
server.listen(port, ()=>{
    console.log('the server is listening on: ', `http://localhost:${port}`);
})





