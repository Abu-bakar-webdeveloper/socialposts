import express from 'express';
import dotenv from "dotenv"
import connectDB from "./db/index.js"


const app = express();


dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 3001, () => {
        console.log("Server started on port", process.env.PORT);
    })
})
.catch((err) => {
    console.log("Mongodb connection failed !!! ", err);
})

app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});