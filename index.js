const express = require('express');
const cors = require('cors');
const app = express();
const userRoute = require('./route/userRoute')

const corsOptions = {
    origin: 'http://localhost:3000',
};
app.use(cors(corsOptions));

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use('/',userRoute);

app.listen(5000, () => {
    console.log("Server Started Running on the port 5000");
})
