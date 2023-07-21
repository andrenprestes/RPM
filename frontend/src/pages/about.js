import React from "react"
import SideNavbar from "../../components/Navbar";
import { useRouter } from 'next/router'

export default function (props) {
  const router = useRouter();
  const name = router.query.name;
  const id = router.query.id;
  const patient = router.query.patient;
  const idPatient = router.query.idPatient;
  return (
    <div className="App">
    <SideNavbar name={name} id={id} patient={patient} idPatient={idPatient}/>
    </div>
  )
}