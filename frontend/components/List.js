import { React, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

const url = "http://35.199.85.72:8080/api";

const api = axios.create({
  baseURL: url
})

export default function List({input, name, idDoc}) {
    const [data, setData] = useState([]);
    
    const router = useRouter()
    var filteredData;
    useEffect(()=>{if ((idDoc!= undefined)){
        api.post("/patients/patientlist", {id: idDoc})
            .then(response=>{
                setData(response.data.patientsList)
            })
    }}, [])
    if (data[0]== undefined){
        api.post("/patients/patientlist", {id: idDoc})
            .then(response=>{
                setData(response.data.patientsList)
            })
    }
    console.log(data)
    if (data != undefined){
        filteredData = data.filter((el) => {
            if (input === '') {
                return el;
            } else {
                return el.name.toLowerCase().includes(input)
            }
        })
    }
    else{
        filteredData = []
    }
    const selectPatient = (text, id)=>{
        router.push({pathname: "/overview", query: {name: name, id: idDoc, patient: text, idPatient: id}})
      }
    return (
        <ul className='SidebarList'>
            {filteredData.map((item) => (
                <li key={item.id} className='row' onClick={()=>{selectPatient(item.name, item.id)}}>
                    <div id='name'>{item.name}</div>{" "}
                    <div id='sex' >{item.sex}</div>{" "}
                    <div id='age' >{item.age}</div>
                </li>
            ))}
        </ul>
    )
}