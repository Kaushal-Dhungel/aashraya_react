import React,{ useState,useEffect } from 'react';
import * as actions from '../store/actions/auth';
import { connect } from 'react-redux';
// import { useHistory } from "react-router-dom";
import FacebookLogin from 'react-facebook-login';
import {Link} from "react-router-dom";
import { Facebook } from 'react-spinners-css';

function Signup ({onAuthSignup}) {


    function handleSubmit (e) {
        e.preventDefault();
        const form = new FormData(e.target);
        const name = form.get("username");
        const email = form.get("email");
        const password1 = form.get("password1");
        const password2 = form.get("password2");

        // console.log(name,password1,password2) 
        // console.log(document.cookie)
        onAuthSignup(name,email,password1,password2);
        // history.push('/profile');

        
      }

    return (
        <>
            <div className="container">
            <form onSubmit={handleSubmit} className = "contact_form" action="#">
                <input name = 'username' className = "form_input" type="text"  placeholder="Username" autoComplete = 'off' />
                <input name = 'email' className = "form_input" type="email"  placeholder="Email" autoComplete = 'off'/>
                <input name = 'password1' className = "form_input" type="password"  placeholder="Password" autoComplete = 'off'/>
                <input name = 'password2' className = "form_input" type="password"  placeholder="Confirm Password" autoComplete = 'off'/>
                <button className = "contact_button">Signup</button>
            </form>
            </div>

        </>
    )
} 


function Login ({onAuthLogin}) {

    function handleSubmit (e) {
        e.preventDefault();
        const form = new FormData(e.target);
        const name = form.get("username");
        const password = form.get("password");
        
        // console.log(name,password)
        onAuthLogin(name,password);
        // history.push('/profile');
    }

    return (
        <>
            <div className="container">
            <form onSubmit={handleSubmit} className = "contact_form" action="#">
                <input name = 'username' className = "form_input" type="text"  placeholder="Username" autoComplete = 'off' />
                <input name = 'password' className = "form_input" type="password"  placeholder="Password" autoComplete = 'off'/>
                <button className = "contact_button">Sign In</button>
            </form>
            </div>

        </>
    )
} 

const mapDispatchToProps =(dispatch) => {
    return {
        onAuthLogin: (username, password) => dispatch(actions.authLogin(username, password)),
        onAuthSignup: (username,email, password1,password2) => dispatch(actions.authSignup(username,email, password1,password2))
    }
}
const NewSignup = connect(null,mapDispatchToProps)(Signup)
const NewLogin = connect(null,mapDispatchToProps)(Login)



const Register = ({errormsg,isLoading,onFBLogin,clearError}) => {

    const[whichRender, setWhichRender] = useState('signup')

    useEffect(() => {
        clearError();
    },[clearError])


    const responseFacebook = (response) => {
        // console.log("this is to be done first");
        // console.log(response);
        onFBLogin(response.accessToken);
        
    }

    return (
        <>
        
        <div className="container mt-3">
            <div className="categories_profile">
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <label className="btn btn-outline-dark active">
                        <input type="radio" name="options" checked 
                        onClick = {() => {
                            setWhichRender('signup');
                            clearError();
                            }} readOnly /> Signup
                    </label>
                    <label className="btn btn-outline-dark">
                        <input type="radio" name="options" onClick = {() => {
                            setWhichRender('login');
                            clearError();
                            }} readOnly /> Login
                    </label>
                </div>
            </div>
        </div>
        {
            isLoading? 
                <div className="loading_loading">
                    <Facebook color = "rgb(230, 43, 83)" size = {200} />
                </div>
        :
        <>
        <div className="register_messages ">
            {
                errormsg !== null?
                <p>
                    {errormsg}
                </p>
                :
                <>
                <p> Registration Successful. Please visit your profile to provide some informations. </p>
                <Link to = '/profile' className = "btn btn-primary">Visit Profile </Link>
                </>
            }
        </div>

        <div className="register_area container">
            {
                whichRender === "signup" ? <NewSignup /> : <NewLogin />
            }
            <div className="social_login">
                
                <FacebookLogin
                    appId="710285926273589"
                    fields="name,email,picture"
                    callback={responseFacebook} 
                />
            </div>
            

        </div>
        </>
        }
        </>
    )
}

const mapDispatchToPropsFacebook =(dispatch) => {
    return {
        onFBLogin : (accesstoken) => dispatch(actions.FbLogin(accesstoken)),
        clearError : () => dispatch(actions.removeError()),
    }
}

const mapStateToPropsFacebook = (state) => {
    return{
        errormsg : state.error,
        isAuthenticated : state.token !== null,
        isLoading : state.loading
    }
}

const Registration = connect(mapStateToPropsFacebook,mapDispatchToPropsFacebook)(Register)
export default Registration;