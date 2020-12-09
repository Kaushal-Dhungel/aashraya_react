import axios from 'axios';
// import Cookies from 'js-cookie'

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// ------------- check if the user is authenticated or not ------------
export const isAuthenticated = () => {
    if (localStorage.getItem('token')) 
        return true
    
    else 
        return false
}


// ----------------- re logs in user after a certain time ---------------- 
export const checkAuthTimeout = expirationTime => {
    console.log("gone to the timeout")
    setTimeout(() => {
        // logout();
        console.log("relogin to be done")

        reLogin();

    }, 36000 * 1000)
}

// ------- logout a user -----------------------
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');  
    localStorage.removeItem('refresh_token');  

} 

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



//  ---- this part is repeated continuously --------------------------
const repeatedFunc = res => {
    const expires = parseInt(res.data.expires_in);
    console.log(expires)
    const expirationDate = new Date(new Date().getTime() + expires * 1000);
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    localStorage.setItem('expirationDate', expirationDate);
    // authSuccess(token);
    checkAuthTimeout(expires);
}


// ------------------ checks if the token of a user has expired or not -------------
export const authCheckState = () => {
    const token = localStorage.getItem('refresh_token');
    // console.log(token)
    if (token !== null){
        const expirationDate = new Date(localStorage.getItem('expirationDate'));
        if ( expirationDate <= new Date() ) {
            reLogin();
        } else {
            
            checkAuthTimeout( (expirationDate.getTime() - new Date().getTime()) / 1000) ;
        }
    }
}

// -------------- plain login------------------------------------
export const loginFuction = (username,password) => {

    axios.post('http://127.0.0.1:8000/auth/token/', {
        grant_type : 'password',
        username: username,
        password: password,
        client_id : '7GaNfuodxtkhUeVKHqE4ZAapgPwD4SwE0BQ5F9T0',
        client_secret : '2Zt7tpt6R6osAgVlC5iRxgo7rUVT31PgOkcxfGENl1BJ29x4KGs0PvWmvPbd6edHB0JFlb2BaFhXcuYT6kEJav1bBHWQJwcFYhURpgoghpMuPlffveCsARTN9vhGtaKi',
    })
    .then(res => {
        console.log('LOGIN SUCCESSFUL')
        console.log(res)
        repeatedFunc(res);

    })
    .catch(err => {
        console.log("sorry no login")
        console.log(err)
    })
}


// --------- re logs a user ---------------
const reLogin = () => {

     axios.post('http://127.0.0.1:8000/auth/token', {
        refresh_token : localStorage.getItem('refresh_token'),
        grant_type : 'refresh_token',
        client_id : '7GaNfuodxtkhUeVKHqE4ZAapgPwD4SwE0BQ5F9T0',
        client_secret : '2Zt7tpt6R6osAgVlC5iRxgo7rUVT31PgOkcxfGENl1BJ29x4KGs0PvWmvPbd6edHB0JFlb2BaFhXcuYT6kEJav1bBHWQJwcFYhURpgoghpMuPlffveCsARTN9vhGtaKi',
    
        })
        .then(res => {
            console.log('LOGIN SUCCESSFUL')
            console.log(res)
            repeatedFunc(res);
        })
        .catch(err => {
            console.log(err)
        })
}
   

// ------------- signup a user --------------------------- 
export const authSignup = (username, email, password1,password2) => {
    const csrftoken = getCookie('_xsrf');
    console.log(csrftoken);
    const axiosConfig = {
        headers: {
            "X-CSRFToken": csrftoken
        }
      };
      
    axios.post('http://127.0.0.1:8000/auth/authorize', {
            username: username,
            email: email,
            password1: password1,
            password2: password2,
        },axiosConfig)

        .then(res => {
            console.log('SIGNUP SUCCESSFUL')

            repeatedFunc(res);

        })
        .catch(err => {
            console.log(err)
        })
    }


// ---- logging a user with facebook account ---------------------
export const FbLogin = (accesstoken) => {
    axios.post('http://127.0.0.1:8000/auth/convert-token', {
    token : accesstoken,
    backend : 'facebook',
    grant_type : 'convert_token',
    client_id : '7GaNfuodxtkhUeVKHqE4ZAapgPwD4SwE0BQ5F9T0',
    client_secret : '2Zt7tpt6R6osAgVlC5iRxgo7rUVT31PgOkcxfGENl1BJ29x4KGs0PvWmvPbd6edHB0JFlb2BaFhXcuYT6kEJav1bBHWQJwcFYhURpgoghpMuPlffveCsARTN9vhGtaKi',

    })
    .then(res => {
        console.log('LOGIN SUCCESSFUL')
        console.log(res)
        repeatedFunc(res);
    })
    .catch(err => {
        console.log(err)
    })
}