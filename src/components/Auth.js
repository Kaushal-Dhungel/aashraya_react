import axios from 'axios';

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

