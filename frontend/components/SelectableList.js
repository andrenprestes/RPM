import { React, useState } from 'react'
import { useRouter } from 'next/router'
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

export default function SelectableList({input, setSelectedSensor, selectedSensor}) {
    const router = useRouter()
    const [data, setData] = useState([]);
    const [first, setFist] = useState(true);
    const [esp, setEsp] = useState("");

    if (first){
        api.get("/sensors/sensorlist")
            .then(response=>{
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
    return (
        <ul className='SidebarList'>
            {filteredData.map((item) => (
                <li key={item.id} id={selectedSensor.includes(item.id)?"active":null} className='row' 
                    onClick={()=>{!selectedSensor.includes(item.id)?setSelectedSensor([...selectedSensor, item.id]):setSelectedSensor(selectedSensor.filter(id => id !== item.id))}}>
                    <div id='icon2' >{iconSensors[item.label.split(" ")[0]]}</div>{" "}
                    <div id='name'>{item.label}</div>{" "}
                    <div id='sex' >{item.age}</div>{" "}
                    <div id='age' >{iconStatus[item.status]}</div>
                </li>
            ))}
        </ul>
    )
}