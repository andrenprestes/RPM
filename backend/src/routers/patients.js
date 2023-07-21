const express = require("express");
const {Router} = express;

const router = new Router(); 
var cors = require('cors');
router.use(cors());

const fs = require("./firebase")
const db = fs.firestore();

const patientsDb = db.collection('patients');  

// router.post("/fill", async (req, res)=>{
//     const patients = require("./patients.json")
//     patients.map(async (el)=>{
//         await patientsDb.doc(el.id.toString()).set({...el})
//     })
//     res.json({message: "foi?"})
// })

router.post("/patientById", async (req, res)=>{
  const {id, idPatient} = req.body;

  const patient1 = await db.collection("patients").where("id", "==", parseInt(idPatient), "&&", "idDocs", 'array-contains', parseInt(id) ).get()
  if (!patient1.empty){
    patient1.forEach((el)=>{
        res.json({...el.data()})
    })
  }
})

router.post("/addpatient", async (req, res)=>{
    const {name, age, gender, height, weight, sensorIds, idDocs} = req.body;

    const size = (await db.collection("patients").get()).size
    await patientsDb.doc(size.toString()).set({id: size, name: name, age: age, sex: gender, height: height, weight: weight, sensorIds: sensorIds, idDocs: idDocs})
    res.json({created: true, idPatient: size})
})

// router.post("/addnotes", (req, res)=>{
//     const {idPat, idDoc, notes} = req.body;
//     const patientIndex = patients.findIndex(element =>{element.id == idPat});
//     if (patients[patientIndex].some(element => {
//         if (element.id === idDoc) 
//           return true;
//         return false;
//       })){
//         const docIndex = patients[patientIndex].findIndex(element =>{element.id == idDoc});
//         patients[patientIndex][docIndex] = notes;
//       }else
//         patients[patientIndex][idDoc] = notes;
//     res.json({added: true});
// })

router.post("/patientlist", async (req, res)=>{
    const {id} = req.body;
    const patient1 = await db.collection("patients").where( "idDocs", 'array-contains', parseInt(id) ).get()
    if (!patient1.empty){
      var list = []
      patient1.forEach((el)=>{
        list.push( el.data())
      })
      res.json({patientsList: list});
    }else
      res.json({patientsList: []});
})

module.exports = router;