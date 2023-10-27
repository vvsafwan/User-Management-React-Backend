const express = require('express');
const userRoute = express();
const usercontroller = require('../controller/userController');

userRoute.get("/loadData",usercontroller.loadData);
userRoute.get("/loadUser",usercontroller.loadUser);

userRoute.post("/adduser",usercontroller.saveUser);
userRoute.post("/updateuser",usercontroller.updateuser);
userRoute.post("/deleteUser",usercontroller.deleteUser);

module.exports = userRoute;