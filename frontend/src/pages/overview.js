import { useState } from "react";
import * as React from 'react';
import TextField from "@mui/material/TextField";
import SideNavbar from "../../components/Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faRulerVertical, faUser, faVenusMars, faWeightScale, faHeart, faTemperatureQuarter, faO, faGauge, faLayerGroup, faCalendarDay, faCalendarWeek  } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'

import LineChartMod from "../../components/LineChartMod";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SingleSelect from "../../components/SingelSelect";

import Multiselect from 'multiselect-react-dropdown';
import axios from "axios";
const url = "http://35.199.85.72:8080/api";

const api = axios.create({
  baseURL: url
})


const borcolors = {Heat: "rgb(62,149,205)", Preassure:"rgb(60,186,159)",  SOp2:"rgb(255,165,0)", Heart: "rgb(196,88,80)"}
const backcolors = {Heat: "rgb(62,149,205,0.1)", Preassure:"rgb(60,186,159,0.1)",  SOp2:"rgb(255,165,0,0.1)", Heart: "rgb(196,88,80,0.1)"}

const iconSensors = 
  {
    Heat:<FontAwesomeIcon icon={faTemperatureQuarter} size='xl' style={{color: "#ff2424",}} />,
    Preassure: <FontAwesomeIcon icon={faGauge} style={{color: "#005eff",}} />,
    SOp2: <FontAwesomeIcon icon={faO} style={{color: "#005eff",}} />,
    Heart: <FontAwesomeIcon icon={faHeart} style={{color: "#ff2424",}} />
  }


const optionsTime = [
  {
    id: "All",
    label: "All",
    icon: <FontAwesomeIcon icon={faLayerGroup} style={{color: "#005eff",}} />
  },
  {
    id: "Year",
    label: "Year",
    icon: <FontAwesomeIcon icon={faCalendar} style={{color: "#005eff",}} />
  },
  
  {
    id: "Month",
    label: "Month",
    icon: <FontAwesomeIcon icon={faCalendarDays} style={{color: "#005eff",}} />
  }
];



export default function () {
  const router = useRouter();
  const name = router.query.name;
  const id = router.query.id;
  const patient = router.query.patient;
  const idPatient = router.query.idPatient;
  
  const [dataSensors, setdataSensors] = useState([]);
  const [dates, setdates] = useState([]);
  const [months, setmonths] = useState([]);
  const [years, setyears] = useState([]);
  const [selection, setSelection] = useState([]);
  const [multi, setMulti] = useState([]);
  const [endDate, setEndDate] = useState([]);
  const [startDate, setStartDate] = useState([]);
  const [month, setMonth] = useState([]);
  const [year, setYear] = useState([]);
  const [first, setFirst] = useState(true)
  const [patientData, setpatientData] = useState({})
  const [time, setTime] = useState(1)

  React.useEffect(function () {
    const timeout = setTimeout(function () {
        setTime(time+1)
    }, 5000)
    
    return function ()  {
        clearTimeout(timeout)
    }
  }, [dataSensors, patientData])

  React.useEffect(()=>{
      api.post("/patients/patientById", {idPatient: parseInt(idPatient), id: parseInt(id)})
      .then(response=>{
        setpatientData(response.data)
      })
      api.post("/sensors/sensordata", {idPatient: parseInt(idPatient)})
        .then(response=>{
            setdataSensors(response.data.sensorData);
            if (dataSensors[0] != undefined){
              if (dataSensors[0].id == 1){
                setdates(dataSensors[0].dates["systolic"].map((value)=>{return {label:value.split("T")[0].split('-')[2]+"-"+value.split("T")[0].split('-')[1]+"-"+value.split("T")[0].split('-')[0]}}))
                setmonths(dates.map((a)=>{return {label: a.label.split("-")[1]+'-'+a.label.split("-")[2]}}).filter((value, index, self) =>index === self.findIndex((t) => (t.label === value.label))))
                setyears(dates.map((a)=>{return {label: a.label.split("-")[2]}}).filter((value, index, self) =>index === self.findIndex((t) => ( t.label === value.label))))
                if (first){
                  var a = [dataSensors[0]]
                  setSelection(a)
                  setFirst(false)
                }
              } else{
                setdates(dataSensors[0].dates.map((value)=>{return {label:value.split("T")[0].split('-')[2]+"-"+value.split("T")[0].split('-')[1]+"-"+value.split("T")[0].split('-')[0]}}))
                setmonths(dates.map((a)=>{return {label: a.label.split("-")[1]+'-'+a.label.split("-")[2]}}).filter((value, index, self) =>index === self.findIndex((t) => (t.label === value.label))))
                setyears(dates.map((a)=>{return {label: a.label.split("-")[2]}}).filter((value, index, self) =>index === self.findIndex((t) => ( t.label === value.label))))
                if (first){
                  setSelection([dataSensors[0]])
                  setFirst(false)
                }
              }
            }
      })
  }, [time])

  const [type, setType] = useState([
    {
      id: "Interval",
      label: "Interval",
      icon: <FontAwesomeIcon icon={faLayerGroup} style={{color: "#005eff",}} />
    }
  ]);
  const [selectionTime, setSelectionTime] = useState([{
    id: "All",
    label: "All",
    icon: <FontAwesomeIcon icon={faLayerGroup} style={{color: "#005eff",}} />
  }]);

  const [alignment, setAlignment] = React.useState('line');

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  var age = "50 y/o";
  var sex = "Male";
  var hei = "170 cm";
  var we = "80 kg";

  React.useEffect(()=>{}, [selection, type, multi, startDate, endDate, month, year])

  const [string, setString] = useState("");
  const [string2, setString2] = useState("");
  const [string3, setString3] = useState("");
  const [string4, setString4] = useState("");
    
  function createString(){
      var s = '';
      if(selection[0] != undefined){
        selection.forEach(element => {
          if (element.id != 1){
            s+=element.label+"; ";
          } else{
            s+="Preassure;"
          }
        });
        setString(s);
      }
  }
  function createString2(){
      var s = '';
      if(multi[0] != undefined){
        multi.forEach(element => {
            s+=element.label+"; ";
        });
        setString2(s);
      }
  }

  function createString3(){
      var s = '';
      if(month[0] != undefined){
        month.forEach(element => {
            s+=element.label+"; ";
        });
        setString3(s);
      }
  }
  function createString4(){
    var s = '';
    if(year[0] != undefined){
      year.forEach(element => {
          s+=element.label+"; ";
      });
      setString4(s);
    }
  }
    React.useEffect(()=>{
        createString()
        createString2()
        createString3()
        createString4()
    }, [selection, year, month, multi])

  function updateData(){
    if(selectionTime[0].label == "All"){
      return selection;
    }else if(selectionTime[0].label == "Year"){
      if (year[0] != undefined){
        var listY = year.map((value)=>value.label)

        var a = selection.map((value)=>{
          var da = value.dates.map((value2, index)=>{          
            if (listY.includes(value2.split("-")[0])){
              return [value.data[index],value2]
            }
          })
          da = da.filter((e)=>{
            return e != undefined
          })
          return {
            data: da.map((v)=>v[0]),
            dates: da.map((v)=>v[1]),
            id: value.id,
            label: value.label,
            status: value.status,
            icon: value.icon
          }
        })
        return a
      }else
        return selection;
    }else if(selectionTime[0].label == "Month"){
      if(month[0] != undefined){
        var listM = month.map((value)=>value.label)

        var a = selection.map((value)=>{
          var da = value.dates.map((value2, index)=>{          
            if (listM.includes(value2.split("-")[1]+"-"+value2.split("-")[0])){
              return [value.data[index],value2]
            }
          })
          da = da.filter((e)=>{
            return e != undefined
          })
          return {
            data: da.map((v)=>v[0]),
            dates: da.map((v)=>v[1]),
            id: value.id,
            label: value.label,
            status: value.status,
            icon: value.icon
          }
        })
        return a
      }else
        return selection;

    }else if(selectionTime[0].label == "Day"){
      if(startDate[0] != undefined && endDate[0] != undefined){
        if (type.length>0 && type[0].label == "Interval"){

          var minDate = new Date(startDate[0].label.split('-')[2], startDate[0].label.split('-')[1], startDate[0].label.split('-')[0])
          var maxDate = new Date(endDate[0].label.split('-')[2], endDate[0].label.split('-')[1], endDate[0].label.split('-')[0])

          var a = selection.map((value)=>{
            var da = value.dates.map((value2, index)=>{
              var dateR = new Date(value2.split('-')[0], value2.split('-')[1], value2.split("-")[2].split("T")[0])          
              if (minDate <= dateR && maxDate >= dateR){
                return [value.data[index],value2]
              }
            })
            da = da.filter((e)=>{
              return e != undefined
            })
            return {
              data: da.map((v)=>v[0]),
              dates: da.map((v)=>v[1]),
              id: value.id,
              label: value.label,
              status: value.status,
              icon: value.icon
            }
          })
          return a

        }else{
          if (multi[0] != undefined){
            var listD = multi.map((value)=>value.label)
            var a = selection.map((value)=>{
              var da = value.dates.map((value2, index)=>{      
                if (listD.includes(value2.split("-")[2].split("T")[0]+"-"+value2.split("-")[1]+"-"+value2.split("-")[0])){
                  return [value.data[index],value2]
                }
              })
              da = da.filter((e)=>{
                return e != undefined
              })
              return {
                data: da.map((v)=>v[0]),
                dates: da.map((v)=>v[1]),
                id: value.id,
                label: value.label,
                status: value.status,
                icon: value.icon
              }
            })
            return a
          }else
            return selection;
        }
      }else
        return selection;
    }
  }
  
  return (
    <div className="App">
    <SideNavbar name={name} id={id} patient={patient} idPatient={idPatient}/>
    <div className="main">
        <div className="patientInfo">
            <div className="t">
            <div style={{width: "100%", fontWeight: "bold", paddingTop:"10%", color: "white", fontSize: 28, display: "flex", alignContent: "center", justifyContent: "center"}} >{patient}</div>
            <div className="img" style={{height: "20%", width: "45%", marginLeft: "27.5%",position: "absolute", top: "13%"}}>
            <img className="cover"  width="100%" height="100%" src="/person-icon.png"/>
            </div>
            </div>
            <div style={{marginTop: "12%"}}>
              <div className="inf">
                <div id='icon'><FontAwesomeIcon icon={faUser} style={{color: "#3881ff",}}/></div>{" "}
                <div id='title' >{patient}</div>
              </div>
              <div className="inf">
              <div id='icon'><FontAwesomeIcon icon={faCalendar} style={{color: "#3881ff",}}/></div>{" "}
                <div id='title' >{"age" in patientData? patientData.age+" y/o" : "Loading"}</div>
              </div>
              <div className="inf">
              <div id='icon'><FontAwesomeIcon icon={faVenusMars} style={{color: "#3881ff",}}/></div>{" "}
                <div id='title' >{"sex" in patientData? patientData.sex : "Loading"}</div>
              </div>
              <div className="inf">
              <div id='icon'><FontAwesomeIcon icon={faRulerVertical} style={{color: "#3881ff",}}/></div>{" "}
                <div id='title' >{"height" in patientData? patientData.height+" m" : "Loading"}</div>
              </div>
              <div className="inf">
              <div id='icon'><FontAwesomeIcon icon={faWeightScale} style={{color: "#3881ff",}}/></div>{" "}
                <div id='title' >{"weight" in patientData? patientData.weight+" kg" : "Loading"}</div>
              </div>
              <div className="inf">
                <TextField
                
                  id="outlined-multiline-static"
                  label="Notes"
                  multiline
                  rows={10}
                  style={{width:"100%"}}
                />
              </div>
            </div>
        </div>
        <div className="patientEsp">
          <div style={{height: "100%", borderRadius: '10px', border: "1px solid #39C2EF", width: "100%", backgroundColor:"white"}}>
          <div className="menus">
            <div style={{ width: "20%", height: "100%", marginTop: "1%", marginRight: "2%"}}>
                <Multiselect
                    displayValue="label"
                    onKeyPressFn={function noRefCheck(){}}
                    onRemove={(value)=>{ setSelection(value); createString();}}
                    onSearch={function noRefCheck(){}}
                    onSelect={(value)=>{setSelection(value); createString();}}
                    options={dataSensors}
                    placeholder={selection.length == 0 ? "Sensors" : string }
                    hideSelectedList
                    showArrow={true}
                    showCheckbox
                    selectedValues={[dataSensors[0]]}
                />
            </div>
            <SingleSelect options={optionsTime} placeholder={"Interval"} onSelect={setSelectionTime}  props={{width: "10%"}}/>
            { selectionTime.length>0 && selectionTime[0].label == "Month"?<div style={{ width: "20%", height: "100%", marginTop: "1%", marginRight: "2%"}}>
                                                                              <Multiselect
                                                                                  displayValue="label"
                                                                                  onKeyPressFn={function noRefCheck(){}}
                                                                                  onRemove={(value)=>{ setMonth(value); createString3();}}
                                                                                  onSearch={function noRefCheck(){}}
                                                                                  onSelect={(value)=>{setMonth(value); createString3();}}
                                                                                  options={months}
                                                                                  placeholder={month.length == 0 ? "Months" : string3 }
                                                                                  hideSelectedList
                                                                                  showArrow={true}
                                                                                  showCheckbox
                                                                                  selectedValues={[months[0]]}
                                                                              />
                                                                          </div> 
            : selectionTime.length>0 && selectionTime[0].label == "Year" ? <div style={{ width: "20%", height: "100%", marginTop: "1%", marginRight: "2%"}}>
                                                                              <Multiselect
                                                                                  displayValue="label"
                                                                                  onKeyPressFn={function noRefCheck(){}}
                                                                                  onRemove={(value)=>{ setYear(value); createString4();}}
                                                                                  onSearch={function noRefCheck(){}}
                                                                                  onSelect={(value)=>{setYear(value); createString4();}}
                                                                                  options={years}
                                                                                  placeholder={year.length == 0 ? "Years" : string4 }
                                                                                  hideSelectedList
                                                                                  showArrow={true}
                                                                                  showCheckbox
                                                                                  selectedValues={[years[0]]}
                                                                              />
                                                                          </div> 
            :null}
          </div>
          
           <LineChartMod dataSensor={updateData()} type={alignment}/>
          </div>
        </div>
      </div>
    </div>
  )
}

