import { React, useState } from "react";
import TextField from "@mui/material/TextField";
import SideNavbar from "../../components/Navbar";
import SettingsMenu from "../../components/SettingsMenu";
import { useRouter } from 'next/router'

export default function () {
  const [inputText, setInputText] = useState("");
  const router = useRouter();
  const name = router.query.name;
  const id = router.query.id;
  const patient = router.query.patient;
  const idPatient = router.query.idPatient;
  
  let inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };
  return (
    <div className="App">
      <SideNavbar name={name} id={id} patient={patient} idPatient={idPatient}/>
      
      <div className="main">
        <div className="search">
            <TextField
              id="outlined-basic"
              onChange={inputHandler}
              variant="outlined"
              fullWidth
              label="Search Patient"
            />
        </div>
        <div className="resultP2">
          <SettingsMenu input={inputText}/>
        </div>
      </div>
    </div>
  )
}