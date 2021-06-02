import axios from 'axios';
import swal from 'sweetalert';

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