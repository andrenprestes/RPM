import React, {useEffect, useState} from 'react';
import { Sidebardata, Sidebarconf } from './Sidebardata';
import { useRouter } from 'next/router'
import Modal from 'react-modal'
import Button from '@mui/material/Button';

export default function SideNavbar({name, id, patient, idPatient}) {
  const [pathname, setPathname] = useState();
  const [isOpen, setIsOpen] = useState(false)
  const customStyles = { overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)' }, content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)' } }
  const router = useRouter()
  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);
  return (
   <div className='side-navbar'>
    <div className="t" style={{height:"17%", borderTopRightRadius: "0px", borderTopLeftRadius: "0px"}}>
            <div className="img" style={{height: "14%", width: "45%", marginLeft: "27.5%",position: "absolute", top: "8.5%"}}>
            <img className="cover"  width="100%" height="100%" src="/logo.png"/>
            </div>
            </div>
    <div className='name' style={{marginTop:"20%" ,fontWeight: 'bold', color: "#696969" }}>
      {name == null ? "???????" : name}
    </div>
    <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} style={customStyles}>
      <h1>Please select a patient to continue!</h1>
      <Button variant="contained" sx={{backgroundColor: '#75ACE0', width: '50%', borderRadius: '20px', marginLeft: "25%", marginTop: "10%"}} 
                                  onClick={() =>  setIsOpen(false)}>Close</Button>
    </Modal>
    <ul className='SidebarList'>
      {Sidebardata.map((val, key) => {
        return(
          <li key={key} className='row' 
            id={pathname == val.link ? "active" : ""}
            onClick={()=>{
              patient!=null || val.link == "/patients"? router.push({pathname: val.link, query: {name: name, id: id, patient: patient, idPatient: idPatient}}):setIsOpen(true)
            }}> 
            <div id='icon'>{val.icon}</div>{" "}
            <div id='title' style={{ fontWeight: 'bold' }}>{val.title}</div>
          </li>
        )
      })}
    </ul>
    <div className='a'>
    <ul className='SidebarList2'>
      {Sidebarconf.map((val, key) => {
        return(
          <li key={key} className='row'
            id={pathname == val.link ? "active" : ""}
            onClick={()=>{
              patient!=null || val.link == "/patients"? router.push({pathname: val.link, query: {name: name, id: id, patient: patient, idPatient: idPatient}}):setIsOpen(true)
          }}> 
            <div id='icon'>{val.icon}</div>{" "}
            <div id='title' style={{ fontWeight: 'bold' }}>{val.title}</div>
          </li>
        )
      })}
    </ul>
    </div>
   </div>
  );
}