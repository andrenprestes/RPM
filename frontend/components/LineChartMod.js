import { useEffect, useState } from "react"
import { Chart } from "chart.js";

const borcolors = {Heat: "rgb(62,149,205)", Preassure:"rgb(60,186,159)",  SOp2:"rgb(255,165,0)", Heart: "rgb(196,88,80)"}
const backcolors = {Heat: "rgb(62,149,205,0.1)", Preassure:"rgb(60,186,159,0.1)",  SOp2:"rgb(255,165,0,0.1)", Heart: "rgb(196,88,80,0.1)"}

export default function LineChartMod({dataSensor, type}) {
    var [sizeD, setsizeD] = useState(0);
    var [sizeDA, setsizeDA] = useState(sizeDate);
    var [sizeDate, setsizeDate] = useState(0);
    var [sizeDateA, setsizeDateA] = useState(sizeDate);
    
    if (dataSensor[0] != undefined){
        
    }
    var [sizeT, setsizeT] = useState(type);
    var [sizeTA, setsizeTA] = useState(sizeT);

    const generateDateset = ()=>{
        var list = []
        for (let i = 0; i <dataSensor.length; i++){
            if (dataSensor[i].id != 1){
                list.push({data: dataSensor[i].data, label: dataSensor[i].label, borderColor: borcolors[dataSensor[i].label.split(" ")[0]], backgroundColor: backcolors[dataSensor[i].label.split(" ")[0]]})
            }else{
                list.push({data: dataSensor[i].data["systolic"], label: dataSensor[i].label+"_systolic", borderColor: borcolors[dataSensor[i].label.split(" ")[0]], backgroundColor: backcolors[dataSensor[i].label.split(" ")[0]]})
                list.push({data: dataSensor[i].data["diastolic"], label: dataSensor[i].label+"_diastolic", borderColor: borcolors[dataSensor[i].label.split(" ")[0]], backgroundColor: backcolors[dataSensor[i].label.split(" ")[0]]})
            }
        }
        return list
    }

    const generateLabels = ()=>{
        var list =  dataSensor[0].dates.map((value)=>{return value.split("T")[0].split('-')[2]+"-"+value.split("T")[0].split('-')[1]+"-"+value.split("T")[0].split('-')[0]+" "+value.split("T")[1].split(':')[0]+":"+value.split("T")[1].split(':')[1].split("Z")[0]})
        console.log(list)
        return list
    }

    useEffect(() => {
        if (dataSensor[0] != undefined){
            setsizeD(dataSensor.length);
            setsizeDA(sizeD);
            setsizeDate(dataSensor[0].dates.length);
            setsizeDateA(sizeDate);
            var ctx = document.getElementById('myChart').getContext('2d');
    
            var myChart = new Chart(ctx, {
                type: type,
                data: {
                    labels: generateLabels(),
                    datasets: generateDateset()
                },
            });
            
            
        }
    }, [])

    

    useEffect(()=>{
        setsizeD(dataSensor.length)
        if (dataSensor[0] != undefined){
            setsizeD(dataSensor.length);
            setsizeDA(sizeD);
            setsizeDateA(sizeDate);
            setsizeDate(dataSensor[0].dates.length)
        }else{
            setsizeDate(0)
        }
        setsizeT(type)
        if((sizeD != sizeDA || sizeDate != sizeDateA || sizeT != sizeTA) && sizeD != 0 && sizeDate !=0 ){
            setsizeDA(sizeD)
            setsizeDateA(sizeDate)
            setsizeTA(sizeT)
            var ctx = document.getElementById('myChart').getContext('2d');
    
            var myChart = new Chart(ctx, {
                type: type,
                data: {
                    labels: generateLabels(),
                    datasets: generateDateset()
                },
            });
        } else{
            setsizeDA(sizeD)
            setsizeDateA(sizeDate)
            setsizeTA(sizeT)
        }
    })

    


    return (
            <div style={{marginTop: "2%"}}>
                <canvas id='myChart'></canvas>
            </div>
    )
}
