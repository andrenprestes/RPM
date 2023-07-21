import { React, useState } from 'react'
import { useRouter } from 'next/router'
import Modal from 'react-modal'
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleMinus, faCircleXmark, faHeart, faTemperatureQuarter, faO, faGauge } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
const url = "http://35.199.85.72:8080/api";

const api = axios.create({
  baseURL: url
})


const iconSensors = 
  {
    Heat:<FontAwesomeIcon icon={faTemperatureQuarter} size='xl' style={{color: "#ff2424",}} />,
    Preassure: <FontAwesomeIcon icon={faGauge} style={{color: "#005eff",}} />,
    SOp2: <FontAwesomeIcon icon={faO} style={{color: "#005eff",}} />,
    Heart: <FontAwesomeIcon icon={faHeart} style={{color: "#ff2424",}} />
  }

const iconStatus = 
  {
    working:<FontAwesomeIcon icon={faCircleCheck} style={{color: "#4ee458",}} />,
    stoped: <FontAwesomeIcon icon={faCircleXmark} style={{color: "#ff2424",}} />,
    malfunction: <FontAwesomeIcon icon={faCircleMinus} style={{color: "#dbbe00",}} />
  }

export default function SensorList({input, user, onClick}) {
    const customStyles = { overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)' }, content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)' } }
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [id, setId] = useState()
    const [data, setData] = useState([]);
    const [first, setFist] = useState(true);
    const [esp, setEsp] = useState("");

    if (first){
        api.get("/sensors/sensorlist")
            .then(response=>{
                console.log(response.data.sensorData)
                setData(response.data.sensorData)
            })
        setFist(false)
    }
    const filteredData = data.filter((el) => {
        if (input === '') {
            return el;
        } else {
            return el.text.toLowerCase().includes(input)
        }
    })

    const selectPatient = ( id, esp)=>{
        setId(id)
        setEsp(esp)
        setIsOpen(true)
      }
    return (
        <>
        <ul className='SidebarList'>
            {filteredData.map((item) => (
                <li key={item.id} className='row' onClick={()=>{selectPatient(item.id, item.especification)}}>
                    <div id='icon2' >{iconSensors[item.label.split(" ")[0]]}</div>{" "}
                    <div id='name'>{item.label}</div>{" "}
                    <div id='sex' >{item.age}</div>{" "}
                    <div id='age' >{iconStatus[item.status]}</div>
                </li>
            ))}
        </ul>
        <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} style={customStyles}>
        <h1>ID: {id} ,Especification: {esp}</h1>
        <Button variant="contained" sx={{backgroundColor: '#75ACE0', width: '50%', borderRadius: '20px', marginLeft: "25%", marginTop: "10%"}} 
                                    onClick={() =>  setIsOpen(false)}>Close</Button>
      </Modal>
      </>
    )
}