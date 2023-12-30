const express=require('express');
const app=express();
const port=3000;
const connectdb = require('./Db/connectDb');
const userRoutes=require('./routes/userRoute');
const adminRoutes=require('./routes/adminRoute')
require('dotenv/config');

app.use(express.json());

app.use('/api/v1/user',userRoutes)
app.use('/api/v1/admin',adminRoutes)


const start=async ()=>{
    try {
        await connectdb(process.env.url);
        app.listen(port,console.log(`Server Listening To The Port ${port}`));
    } catch (error) {
        console.log(error);
    }
}

start();