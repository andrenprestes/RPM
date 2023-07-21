import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPeopleGroup, faBookMedical, faChartLine, faListCheck, faCircleInfo, faGears } from '@fortawesome/free-solid-svg-icons'

export const Sidebardata = [
    {
        title: "Patients",
        icon:  <FontAwesomeIcon icon={faPeopleGroup} style={{color: "#3881ff",}} />,
        link: "/patients"
    },
    {
        title: "Patient Overview",
        icon: <FontAwesomeIcon icon={faBookMedical} style={{color: "#3881ff",}}/>,
        link: "/overview"
    },
    {
        title: "Avaliable Sensors",
        icon: <FontAwesomeIcon icon={faListCheck} style={{color: "#3881ff",}}/>,
        link: "/sensors"
    }
]

export const Sidebarconf = [
    {
        title: "Settings",
        icon: <FontAwesomeIcon icon={faGears} style={{color: "#3881ff",}}/>,
        link: "/settings"
    }
]
