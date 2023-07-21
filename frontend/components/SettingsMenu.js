import { React, useState } from 'react'
import { useRouter } from 'next/router'
import Modal from 'react-modal'
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleMinus, faCircleXmark, faHeart, faTemperatureQuarter, faO, faGauge, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const data = [
    {
        "id": 1,
        "text": "Devpulse",
        "icon": <FontAwesomeIcon icon={faArrowRightFromBracket}/>,
        "action": "/"
    },
] 

export default function SettingsMenu({input}) {
    const customStyles = { overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)' }, content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)' } }
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [id, setId] = useState()
    const filteredData = data.filter((el) => {
        if (input === '') {
            return el;
        } else {
            return el.text.toLowerCase().includes(input)
        }
    })

    const selectPatient = (text, id)=>{
        setId(id)
        setIsOpen(true)
      }
    return (
        <>
        <ul className='SidebarList'>
            {filteredData.map((item) => (
                <li key={item.id} className='row' onClick={()=>{router.push({pathname: item.action})}}>
                    <div id='icon2' >{item.icon}{"  "}{item.text}</div>
                </li>
            ))}
        </ul>
      </>
    )
}