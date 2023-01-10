import { useEffect, useState } from "react";
import Axios from "axios";
import { BACKEND_URL } from './Constants';
import { getLocalItem } from "./Helpers";


function useDevices() {
    const [devices, setDevices] = useState({});

    return [devices, setDevices];
}

function useAreas() {
    const [areas, setAreas] = useState({});

    return [areas, setAreas];
}

const Devices = ( { setDevices, setAreas, setSelectedDevice, setSelectedArea }) => {

    useEffect(() => {
        Axios.get(`${BACKEND_URL}/devices`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('JWT')}` }
        })
            .then((res) => {
                const devs = res.data
                setDevices(devs)

                // Build area list and area/ID map from device list
                // Device names must be formatted as "Area - Name"
                let areas = {};
                let arealist = [];
                for (var i = 0; i < devs.length; i++) {
                    let n = devs[i].name;
                    let s = n.split('-');
                    if (s.length >= 2) {
                        let area = s[0];
                        let idlist = [];
                        if (areas.hasOwnProperty(area)) {
                            idlist = areas[area];
                        }
                        idlist.push(devs[i].id);
                        areas[area] = idlist;
                        arealist.push(area);
                    }
                }
                setAreas(areas);

                // pick the first device if none stored
                let selDev = getLocalItem("selectedDevice", devs[0].id);
                setSelectedDevice(selDev);

                // pick the first area if none stored
                let selArea = getLocalItem("selectedArea", arealist[0]);
                setSelectedArea(selArea);
            })
            .catch((err) => console.log(err));

    }, [setDevices, setAreas, setSelectedDevice, setSelectedArea] )

    return null;
}


const findAreaForDevice = (id, areas) => {
    for (const area in areas) {
        const ids = areas[area];
        if (ids.includes(id)) {
            return (area);
        }
    }
    return null;
}

const lookupDevice = (id, devices) => {
    for (var i = 0; i < devices.length; i++) {
        if (devices[i].id === id)
            return devices[i].name;
    }
    return "";
}

const getSelectedAreaIds = (selectedArea, areas) => {
    if (areas.hasOwnProperty(selectedArea)) {
        return areas[selectedArea];
    }
    return [];
}


export { useDevices, useAreas, Devices, findAreaForDevice, lookupDevice, getSelectedAreaIds };