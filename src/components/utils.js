import axios from 'axios';
import swal from 'sweetalert';

import LocationOnIcon from '@material-ui/icons/LocationOn';
import HotelIcon from '@material-ui/icons/Hotel';
import HouseIcon from '@material-ui/icons/House';
import LandscapeIcon from '@material-ui/icons/Landscape';
import SchoolIcon from '@material-ui/icons/School';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';


export const addCart = (e) => {

    const token = localStorage.getItem('token');
    if (token === null || token === undefined){
        swal("Sorry!","You need to be logged in to perform this action","error")
        return
    }

    let url = `${process.env.REACT_APP_HEROKU_URL}/items/cartview`

    if (e.target.dataset.set === "roomie"){
        url = `${process.env.REACT_APP_HEROKU_URL}/mates/roomiecart`
    }

    const data = {
        action : e.target.dataset.action,
        id : e.target.dataset.id
    }
    const config = {
        headers: {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${token}`
        }
    }
    
    axios.post(url, data,config)
    .then(res => {
        console.log(res.data)
        if (res.data[0] === "Already exists")
            swal("Warning!!","Item Already Exists","warning")

        else if (res.data[0] === "Removal Successful") {
            swal("Deleted!", "The item has been deleted!", "success")
            .then (abc=> {
                window.location.reload();
            })
        }   
        else
        swal("Success!!","Addition Successful","success")

    })
    .catch(err => {
        swal("Sorry!","Something went wrong. Please Try Again","error")

    })

}


export const searchPlaces = (value) => {
    return new Promise((resolve,reject) => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/`;
        const token = `${process.env.REACT_APP_MAPBOX_TOKEN}`;
    
        const fullUrl = url + value + '.json?access_token=' + token;
        axios.get(fullUrl)
        .then((res) => {
             resolve (res.data.features)
        })
        .catch((err)=> {
            reject (err)
        })
    }) 
}


const iconStyle = {
    color : "white",
    fontSize : 80,
    borderRadius : "60px"
}

export const servicesData = [
    {
        'service' :  "Rooms",
        'icon' : <HotelIcon  style={iconStyle}/> ,
        'data' : `Thinking of living somewhere away from your home??. We know how hard it is to leave your home. Worry not.
        We'll help you find the best rooms that would feel like your own home.`
    },
    {
        'service' :  "Apartments",
        'icon' : <LocationOnIcon style={iconStyle} /> ,
        'data' : `Tired of looking for an apartment?? Do not worry. We'll help you find the best apartments in your favourite city at the cheapest price.`
    },
    {
        'service' :  "Homes",
        'icon' : <HouseIcon style={iconStyle} /> ,
        'data' : `Want to live in your own house with your sweet family?? Yeah, we know how tiresome it could be to find that perfect house. But guess what,
        not anymore because we are here to help you.`
    },
    {
        'service' :  "Hostel",
        'icon' : <SchoolIcon style={iconStyle} /> ,
        'data' : `Hey buddy!! Do you want to live in a peaceful environment where you could achieve utmost academic growth?? If "yes" is the answer then
        you are at the right place. We will assist you to find the best hostels near your colleges.`
    },
    {
        'service' :  "Lands",
        'icon' : <LandscapeIcon style={iconStyle} /> ,
        'data' : `Looking for some land to farm?? Or to build a house?? Oh, you want to start your own real estate business. That's great. 
        Now let us help you to find the best lands at the reasonable price.
        `
    },
    {
        'service' :  "Roommates",
        'icon' : <PeopleAltIcon style={iconStyle} /> ,
        'data' : `Need a partner to live together with?? It is really important to find a compatible roommate. Afterall you are inviting
        someone to become a part of your life. Let us help you find the best partners with whom you could create the best memories.`
    },
]