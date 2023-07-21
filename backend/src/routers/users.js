const express = require("express");
const {Router} = express;
const fs = require("./firebase")
const db = fs.firestore();

const router = new Router();
var cors = require('cors');
router.use(cors());

const usersDb = db.collection('users');  

// router.post("/fill", async (req, res)=>{
//     const users = require("./users.json")
//     users.map(async (el)=>{
//         await usersDb.doc(el.id.toString()).set({...el})
//     })
//     res.json({message: "foi?"})
// })

router.post("/checkuser", async(req, res)=>{
    const {username, password} = req.body;

    const users1 = await db.collection("users").where("username", "==", username, "&&", "password", "==", password ).get()

    if (users1.empty){
        res.json({loggedIn: false, name: "username", message:"username or password incorrect!"})
    }else{
        users1.forEach((el)=>{
            console.log(el.data())
            res.json({loggedIn: true, message:{...el.data()}})
        })
    }
})

router.post("/adduser", async (req, res)=>{
    const {username, name, password} = req.body;

    const users1 = await db.collection("users").where("username", "==", username).get()

    if (users1.empty){
        const size = (await db.collection("users").get()).size
        await usersDb.doc(size.toString()).set({id: size, username: username, name: name, password: password})
        res.json({loggedIn: true, message: {id: size, username: username, name: name, password: password}})
    }else
        res.json({loggedIn: false, name: "username", message:"username already exists!"})
});

module.exports = router;