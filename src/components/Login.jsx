import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { useHistory } from "react-router-dom";

// import {authSignup} from './Auth';
// import { loginFuction,FbLogin } from './Auth';

import FacebookLogin from 'react-facebook-login';

import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';


const Login = ({onAuthLogin,onFBLogin,onAuthSignup}) => {
    const [myclass, setMyclass] = useState(false)
    let history = useHistory()

    const myFunc = () => {
        myclass ? setMyclass(false) : setMyclass(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(e.target)
        const form = new FormData(e.target);
        const name = form.get("username");
        const email = form.get("email");
        const password1 = form.get("password1");
        const password2 = form.get("password2");

        console.log(name,password1,password2)
        
        //for sign Up
        if (password2 === null)
        {
            console.log(name,password1)
            // loginFuction(name,password1)
            onAuthLogin(name,password1);
            history.push('/profile');
        }       
        else
           { 
            console.log(name,password1,password2) 
            console.log(document.cookie)
            // authSignup(name,email,password1,password2) 
            onAuthSignup(name,email,password1,password2);
            // history.push('/profile');

            }
      }

    const responseFacebook = (response) => {
        console.log("this is to be done first");
        console.log(response);
        onFBLogin(response.accessToken);
        history.push('/profile');

    }

    return(
        <>
                <FacebookLogin
                        appId="710285926273589"
                        fields="name,email,picture"
                        callback={responseFacebook} />

            <div className={myclass? `container contact right-panel-active` : 'container contact'} id="container">
                <div className="form-container sign-up-container">
                    <form onSubmit={handleSubmit} className = "contact_form" action="#">
                        <h1>Create Account</h1>
                        <span className = "span_class">or use your email for registration</span>
                        <input name = 'username' className = "form_input" type="text" placeholder="Userame" autoComplete = 'off' />
                        <input name = 'email' className = "form_input" type="email" placeholder="Email" autoComplete = 'off' />
                        <input name = 'password1' className = "form_input" type="password" placeholder="Password" autoComplete = 'off'/>
                        <input name = 'password2' className = "form_input" type="password" placeholder="Confirm Password" autoComplete = 'off'/>
                        <button className = "contact_button">Sign Up</button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form onSubmit={handleSubmit}  action="#">
                        <h1>Sign in</h1>
                        <span className = "span_class">or use your account</span>
                        <input name = 'username' className = "form_input" type="text" placeholder="Userame" autoComplete = 'off'/>
                        <input name = 'password1' className = "form_input" type="password" placeholder="Password" autoComplete = 'off'/>
                        <Link className = "a" to="/">Forgot your password?</Link>
                        <button className = "contact_button">Sign In</button>

                    </form>

                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p className = "contact_p">To keep connected with us please login with your personal info</p>
                            <button className="ghost" id="signIn" onClick = {myFunc}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p className = "contact_p">Enter your personal details and start journey with us</p>
                            <button className="ghost" id="signUp" onClick = {myFunc}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

const mapDispatchToProps =(dispatch) => {
    return {
        onAuthLogin: (username, password) => dispatch(actions.authLogin(username, password)),
        onFBLogin : (accesstoken) => dispatch(actions.FbLogin(accesstoken)),
        onAuthSignup: (username,email, password1,password2) => dispatch(actions.authSignup(username,email, password1,password2))

    }
}
const NewLogin = connect(null,mapDispatchToProps)(Login)
// export default MyContact
export default NewLogin;