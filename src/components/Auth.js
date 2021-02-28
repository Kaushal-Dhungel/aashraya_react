import axios from 'axios';
import swal from 'sweetalert';

// ---------- related to updating and adding items ------------

export const addItemFunc = (url,form) => {
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${token}`
    }
    }
    

    axios.post(url, form,config)

    .then(res => {
        console.log('Added')
        console.log(res)


    })
    .catch(err => {
        console.log("sorry no addition")
        console.log(err)
    })
}

export const updateItemFunc = (url,form) => {
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${token}`
    }
    }
    

    axios.patch(url, form,config)

    .then(res => {
        console.log('Item has been updated')
        console.log(res)


    })
    .catch(err => {
        console.log("sorry no updating")
        console.log(err)
    })
}

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
