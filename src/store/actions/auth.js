import axios from 'axios';
import * as actions from './actionCreators';


//-------------- action creators ----------------------------
export const authStart = () => {
    return {
        type: actions.AUTH_START
    }
}

export const authSuccess = token => {
    return {
        type: actions.AUTH_SUCCESS,
        token: token
    }
}

export const authFail = error => {
    return {
        type: actions.AUTH_FAIL,
        error: error
    }
}

export const removeError = () => {
    return {
        type : actions.CLEAR_ERROR
    }
}

export const hideModal = () => {
    return {
        type: actions.CLOSE_MODAL
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('refresh_token');
    return {
        type: actions.AUTH_LOGOUT
    };
}


// ------- these are the functions that invoke/dispatch action creators which in turn update the state --------------------
//  they themselves aren't the action creator but they call action creators to update the state

const repeatedFunc = res => {
    return dispatch => {    
        const expires = parseInt(res.data.expires_in);
        const token = res.data.access_token;
        // console.log(expires)
        const expirationDate = new Date(new Date().getTime() + expires * 1000);
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(authSuccess(token)); // call the action creator which updates the state
        dispatch(checkAuthTimeout(expires));
    }
}

const reLogin = () => {
return dispatch => 
   { 
       axios.post( `${process.env.REACT_APP_HEROKU_URL}/auth/token`, {
       refresh_token : localStorage.getItem('refresh_token'),
       grant_type : 'refresh_token',
       client_id : `${process.env.REACT_APP_CLIENT_ID}`,
       client_secret : `${process.env.REACT_APP_CLIENT_SECRET}`,

       })
       .then(res => {
        //    console.log('LOGIN SUCCESSFUL')
        //    console.log(res)
           dispatch(repeatedFunc(res));
       })
       .catch(err => {
        //    console.log(err)
           dispatch(authFail(err))
       })
    }
}


export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        // console.log("timeout started");
        setTimeout(() => {
            // dispatch(logout());
            dispatch(reLogin());
        }, 36000 * 1000)
    }
}


export const authLogin = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(`${process.env.REACT_APP_HEROKU_URL}/auth/token/`, {
            grant_type : 'password',
            username: username,
            password: password,
            client_id : `${process.env.REACT_APP_CLIENT_ID}`,
            client_secret : `${process.env.REACT_APP_CLIENT_SECRET}`,
        })
        .then(res => {
            // console.log('LOGIN SUCCESSFUL')
            // console.log(res)
            dispatch(repeatedFunc(res));
    
        })
        .catch(err => {
            // console.log("sorry no login")
            // console.log(err.response.data.error_description)
            const msg = err.response.data

            dispatch(authFail(`Login Failed. ${msg.error_description}`))

        })
    }
}


export const authSignup = (username, email, password1,password2) => {
    return dispatch => {

        dispatch(authStart());

          
        axios.post(`${process.env.REACT_APP_HEROKU_URL}/registeruser/`, {
                username: username,
                email: email,
                password1: password1,
                password2: password2,
                client_id : `${process.env.REACT_APP_CLIENT_ID}`,
                client_secret : `${process.env.REACT_APP_CLIENT_SECRET}`,    
            },)
    
            .then(res => {
                // console.log('SIGNUP SUCCESSFUL')
                // console.log(res.data)
                
                dispatch(repeatedFunc(res));
                
            })
            .catch(err => {
                // console.log(err.response.data)
                dispatch(authFail(err.response.data))

            })
    }
}

export const authCheckState = () => {
    return dispatch => {
        const refresh_token = localStorage.getItem('refresh_token');
        const token = localStorage.getItem('token');

        if (refresh_token !== null){
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if ( expirationDate <= new Date() ) {
                dispatch(reLogin());
            } else {
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout( (expirationDate.getTime() - new Date().getTime()) / 1000)) ;
            }
        }
    }
}

export const FbLogin = (accesstoken) => {

return dispatch =>{    
        axios.post(`${process.env.REACT_APP_HEROKU_URL}/auth/convert-token`, {
        token : accesstoken,
        backend : 'facebook',
        grant_type : 'convert_token',
        client_id : `${process.env.REACT_APP_CLIENT_ID}`,
        client_secret : `${process.env.REACT_APP_CLIENT_SECRET}`,

        })
        .then(res => {
            // console.log('LOGIN SUCCESSFUL')
            // console.log(res)
            dispatch(repeatedFunc(res));
        })
        .catch(err => {
            // console.log(err)
            dispatch(authFail('Unable To Log In Using Facebook. Please Try Later.'))
        })
    }
}