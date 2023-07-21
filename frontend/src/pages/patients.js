import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import SideNavbar from "../../components/Navbar";
import List from "../../components/List";
import SelectableList from "../../components/SelectableList";
import Button from '@mui/material/Button';
import { useRouter } from 'next/router'
import InputAdornment from "@mui/material/InputAdornment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faGears, faMagnifyingGlass, faRefresh, faRulerVertical, faUser, faVenusMars, faWeightScale } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
const url = "http://35.199.85.72:8080/api";

const api = axios.create({
  baseURL: url
})

export default function () {
  const [inputText, setInputText] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputAge, setInputAge] = useState("");
  const [inputGender, setInputGender] = useState("");
  const [inputHeight, setInputHeight] = useState("");
  const [inputWeight, setInputWeight] = useState("");
  const [newPatient, setNewPatient] = useState(false);

  
  const router = useRouter();
  const name = router.query.name;
  const id = router.query.id;
  const patient = router.query.patient;
  const idPatient = router.query.idPatient;

  const [selectedSensor, setSelectedSensor] = useState([]);
  
  let inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  let submitHandler=()=>{
    api.post("/patients/addpatient", {name: inputName, age: inputAge, gender: inputGender, height: inputHeight, weight: inputWeight, sensorIds: selectedSensor, idDocs:[parseInt(id)]})
        .then(response=>{
            if (response.data.created){
              router.push({pathname: "/patients", query: {name: name, id: id}})
            }
        })
  }
  return (
    <div className="App">
      <SideNavbar name={name} id={id} patient={patient} idPatient={idPatient}/>
      {newPatient?
      <div className="main">
        <div className="patientInfo" style={{height: "85.5%"}}>
            <div className="t"><div className="img" style={{height: "20%", width: "45%", marginLeft: "27.5%",position: "absolute", top: "13%"}}>
            <img className="cover"  width="100%" height="100%" src="/person-icon.png"/>
            </div>
            </div>
            <div style={{marginTop: "15%"}}>
            <div className="search">
              <TextField
                id="outlined-basic"
                onChange={(e)=>{setInputName(e.target.value)}}
                variant="outlined"
                fullWidth
                label="Name"
              />
            </div>
            <div className="search">
              <TextField
                id="outlined-basic"
                onChange={(e)=>{setInputAge(e.target.value)}}
                variant="outlined"
                fullWidth
                label="Age"
              />
            </div>
            <div className="search">
              <TextField
                id="outlined-basic"
                onChange={(e)=>{setInputGender(e.target.value)}}
                variant="outlined"
                fullWidth
                label="Gender"
              />
            </div>
            <div className="search">
              <TextField
                id="outlined-basic"
                onChange={(e)=>{setInputHeight(e.target.value)}}
                variant="outlined"
                fullWidth
                label="Height"
              />
            </div>
            <div className="search">
              <TextField
                id="outlined-basic"
                onChange={(e)=>{setInputWeight(e.target.value)}}
                variant="outlined"
                fullWidth
                label="Weight"
              />
            </div>
            </div>
        </div>
        <div className="patientEsp2">
          <div className="search">
              <IconTextField
                id="outlined-basic"
                onChange={inputHandler}
                variant="outlined"
                fullWidth
                label="Search Sensor"
                iconEnd={<FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#3881ff",}}/>}
              />
          </div>
          <div className="resultP">
            <SelectableList input={inputText} user={name} setSelectedSensor={setSelectedSensor} selectedSensor={selectedSensor}/>
          </div>
        </div>
        <Button variant="contained" sx={{backgroundColor: '#75ACE0', width: '30%', borderRadius: '20px', position: "absolute", bottom: "3%", right: "10%"}} 
                                  onClick={submitHandler}>Add Patient</Button>

        <Button variant="contained" sx={{backgroundColor: '#75ACE0', width: '30%', borderRadius: '20px', position: "absolute", bottom: "3%", marginLeft: "25%", left: 0}} 
                                          onClick={() => {setNewPatient(false)}}>Back</Button>
      </div>
      :
      <div className="main">
        <div className="search">
              <IconTextField
                id="outlined-basic"
                onChange={inputHandler}
                variant="outlined"
                fullWidth
                label="Search Patient"
                iconEnd={<FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#3881ff",}}/>}
              />
        </div>
        <div className="resultP">
          <List input={inputText} name={name} idDoc={id}/>
        </div>
        <Button variant="contained" sx={{backgroundColor: '#75ACE0', width: '30%', borderRadius: '20px'}} 
                                  onClick={() => {setNewPatient(true)}}>Add New Patient</Button>
      </div>}
    </div>
  )
}

const IconTextField = ({ iconEnd, InputProps, ...props }) => {
  return (
    <TextField
      {...props}
      InputProps={{
        ...InputProps,
        endAdornment: iconEnd ? (
          <><InputAdornment position="end">{iconEnd}</InputAdornment>
          </>
        ) : null
      }}
    />
  );
};