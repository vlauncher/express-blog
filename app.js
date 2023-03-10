const express = require("express");
const dotenv = require("dotenv").config();

const app = express();


app.use(express.json());
app.use(express.urlencoded({
    extended:false
}));

const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts")

app.use("/auth",userRoutes);
app.use("/",postRoutes);

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server running on port : ${PORT}`)
});