import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import mainRouter from "./routes";
import connectMongo from "./config/mongoconnect";
import cors from "cors"  

//////////////////

import path from 'path'


const app = express();

app.use(cors())

// Production enviroment
const isProduction = process.env.NODE_ENV === "production";
app.use(bodyParser.json())


//https debug
app.use(morgan("dev"));

//Connect Mongo
connectMongo();

//routes
app.use("/", mainRouter);


const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, './uploads')))

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on isProductions => ${isProduction}`);
  console.log(`Server is running on PORT ${PORT}`);
});


