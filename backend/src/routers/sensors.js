const express = require("express");
let sensorAvaliable = require('./sensorAvaliable.json');
const {Router} = express;
const router = new Router();
var cors = require('cors');
router.use(cors());

const fs = require("./firebase")
const db = fs.firestore();

const sensorsAvaliableDb = db.collection('sensorsAvaliable');  
const sensorsDataDb = db.collection('sensorsData');  

// router.post("/fill", async (req, res)=>{
//   const sensorAvaliable = require("./sensorAvaliable.json")
//   sensorAvaliable.map(async (el)=>{
//         await sensorsAvaliableDb.doc(el.id.toString()).set({...el})
//     })
//     res.json({message: "foi?"})
// })

// router.post("/fill", async (req, res)=>{
//   const sensorData = require("./sensorData.json")
//   sensorData.map(async (el)=>{
//         await sensorsDataDb.doc(el.id.toString()).set({...el})
//     })
//     res.json({message: "foi?"})
// })

var idSen = sensorAvaliable.length

// router.post("/addsensor", (req, res)=>{
//     const {label, type, especification} = req.body;
//     sensors.push({id: idSen, data: [], dates: [], label: label, status: "working", especification: especification});
//     idSen++;
//     res.json({created: true})
// })

router.get("/sensorlist", async (req, res)=> {
  const list1 = await db.collection("sensorsAvaliable").get()
    if (!list1.empty){
      var list = []
      list1.forEach((el)=>{
        list.push(el.data())
      })
      res.json({sensorData: list});
    }else
      res.json({sensorData: []});
})

router.post("/sensordata", async (req, res)=> {
    const {idPatient} = req.body;
    const list = [];
    const listPatient = await db.collection("sensorsData").where("idPatient", "==", parseInt(idPatient)).get()
    const aux = {}
    listPatient.forEach(el=>{
      if (el.data().idSensor in aux){
        if (el.data().idSensor == 1){
          if(el.data().label.includes("_systolic")){
            aux[el.data().idSensor]["data"]["systolic"].push(el.data().data)
            aux[el.data().idSensor]["dates"]["systolic"].push(el.data().dates)
            aux[el.data().idSensor]["label"]["systolic"] = el.data().label
            aux[el.data().idSensor]["label"] = "Preassure"
            aux[el.data().idSensor]["id"] = el.data().idSensor
          }else{
            aux[el.data().idSensor]["data"]["diastolic"].push(el.data().data)
            aux[el.data().idSensor]["dates"]["diastolic"].push(el.data().dates)
            aux[el.data().idSensor]["label"]["diastolic"] = el.data().label
            aux[el.data().idSensor]["label"] = "Preassure"
            aux[el.data().idSensor]["id"] = el.data().idSensor
          }
        } else{
          aux[el.data().idSensor]["data"].push(el.data().data)
          aux[el.data().idSensor]["dates"].push(el.data().dates)
          aux[el.data().idSensor]["label"] = el.data().label
          aux[el.data().idSensor]["id"] = el.data().idSensor
        }
      }else{
        if (el.data().idSensor == 1){
          if(el.data().label.includes("_systolic")){
            aux[el.data().idSensor]={}
            aux[el.data().idSensor]["data"]={}
            aux[el.data().idSensor]["dates"]={}
            aux[el.data().idSensor]["label"]={}
            aux[el.data().idSensor]["id"]={}
            aux[el.data().idSensor]["data"]["systolic"]=[el.data().data]
            aux[el.data().idSensor]["dates"]["systolic"]=[el.data().dates]
            aux[el.data().idSensor]["label"]["systolic"] = el.data().label
            aux[el.data().idSensor]["id"]["systolic"] = el.data().idSensor

            aux[el.data().idSensor]["data"]["diastolic"]=[]
            aux[el.data().idSensor]["dates"]["diastolic"]=[]
          }else{
            aux[el.data().idSensor]={}
            aux[el.data().idSensor]["data"]={}
            aux[el.data().idSensor]["dates"]={}
            aux[el.data().idSensor]["label"]={}
            aux[el.data().idSensor]["id"]={}
            aux[el.data().idSensor]["data"]["diastolic"]=[el.data().data]
            aux[el.data().idSensor]["dates"]["diastolic"]=[el.data().dates]
            aux[el.data().idSensor]["label"]["diastolic"] = el.data().label
            aux[el.data().idSensor]["id"]["diastolic"] = el.data().idSensor

            aux[el.data().idSensor]["data"]["systolic"]=[]
            aux[el.data().idSensor]["dates"]["systolic"]=[]
          }
        } else{
          aux[el.data().idSensor]={}
          aux[el.data().idSensor]["data"]=[el.data().data]
          aux[el.data().idSensor]["dates"]=[el.data().dates]
          aux[el.data().idSensor]["label"] = el.data().label
          aux[el.data().idSensor]["id"] = el.data().idSensor
        }
      }
    })
    if(Object.keys(aux).length !== 0){
      for (const key in aux){
        list.push(aux[key])
      }
    }
    res.json({sensorData: list});
})

module.exports = router;