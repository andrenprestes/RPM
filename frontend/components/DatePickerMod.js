import { useState, } from "react";
import * as React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerMod({onSelect, label, views}) {
  const [startDate, setStartDate] = useState();
  
  return (
    <div style={{marginRight: "5%"}}>
    {label} :
    <LocalizationProvider dateAdapter={AdapterDayjs} >
        <DatePicker views={views} sx={{ height: "62%", svg: {color: "white"}, input: {color: "white", fontSize: 14, paddingLeft: "10%"}, label : {color: "white", fontWeight: "bold"}, borderRadius: "5px", marginRight: "5%", background: "linear-gradient(to right, #9198e5,#39C2EF)", display: "flex", flexDirection: "row"}} format="DD/MM/YYYY" formatDensity="spacious" value={startDate} onChange={(newValue) => {setStartDate(newValue); onSelect(newValue);}}/>
    </LocalizationProvider>
    </div>
  )
}

