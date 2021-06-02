import React, { useState, useEffect, useRef } from "react";
import * as actions from "../store/actions/auth";
import { connect } from "react-redux";
import FacebookLogin from "react-facebook-login";
import { Link } from "react-router-dom";
import { Facebook } from "react-spinners-css";
import {Redirect} from 'react-router-dom';
import axios from 'axios';

function Signup({ onAuthSignup }) {

  const [emailExists, setEmailExists] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  // const [userpassword, setUserpassword] = useState('');
  const [passwordMissMatch, setPasswordMissMatch] = useState(false);
  const passwordRef = useRef();
  const confpasswordRef = useRef();

  const pStyle = {
    color : "red"
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get("username");
    const email = form.get("email");
    const password1 = form.get("password1");
    const password2 = form.get("password2");

    onAuthSignup(name, email, password1, password2);
  }

  function handleChange(e) {
    const whichField = e.target.dataset.item;
    const value = e.target.value;

    if (whichField === "username") {
      // setUsername(value)
      axios.get(`${process.env.REACT_APP_HEROKU_URL}/core/checkuser/`, {
        params: {
          username: value,
          email : ''
        }
      })

      .then(res => {
        if (res.data[0] === "True") {
          setUsernameExists(true);
      }

      else {
        setUsernameExists(false)
      }
      })
      .catch(err => {
        console.log(err);
      })
    }

    else if (whichField === "username") {
      axios.get(`${process.env.REACT_APP_HEROKU_URL}/core/checkuser/`, {
        params: {
          username: '',
          email : value
        }
      })

      .then(res => {
        if (res.data[0] === "True") {
          setEmailExists(true);
      }

      else {
        setEmailExists(false)
      }
      })
      
      .catch(err => {
        console.log(err);
      })
    }

    else {
      const pass1 = passwordRef.current.value;
      const pass2 = confpasswordRef.current.value;

      if (pass1 === pass2 || pass1 === "" || pass2 === "" ){
        setPasswordMissMatch(false)
        return
      }

      if (pass1 !== pass2){
        setPasswordMissMatch(true);
        return
      }

    }
  }

  return (
    <>
      <div className="container box-element">
        <form onSubmit={handleSubmit} className="contact_form" action="#">

          <input name="username" className="form_input" type="text"
            placeholder="Username" autoComplete="off" required
            // value = {username}
            data-item = "username"
            onChange = {handleChange}
            />
            { usernameExists ? <p style = {pStyle}> Username already taken </p> : null}

          <input name="email" className="form_input" type="email"
            placeholder="Email" autoComplete="off" required
            // value = {useremail}
            data-item = "useremail"
            onChange = {handleChange}
            />
            { emailExists ? <p style = {pStyle}> Email already taken</p> : null}
          

          <input name="password1" className="form_input" type="password"
            placeholder="Password" autoComplete="off"required
            data-item = "password"
            ref = {passwordRef}
            onChange = {handleChange}
            />

          <input name="password2" className="form_input" type="password"
            placeholder="Confirm Password" autoComplete="off" required
            data-item = "confirmPass"
            ref = {confpasswordRef}
            onChange = {handleChange}
            />

            {passwordMissMatch ? <p style = {pStyle}> Password and Confirm Password must be same</p>: null }

          <button className="btn btn-secondary" disabled = {emailExists || usernameExists || passwordMissMatch}>Signup</button>
        </form>
      </div>
    </>
  );
}

function Login({ onAuthLogin }) {
  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get("username");
    const password = form.get("password");

    onAuthLogin(name, password);
  }

  return (
    <>
      <div className="container box-element">
        <form onSubmit={handleSubmit} className="contact_form" action="#">
          <input name="username" className="form_input" type="text"
            placeholder="Username" autoComplete="off"/>

          <input name="password" className="form_input" type="password"
            placeholder="Password" autoComplete="off"/>

          <button className="btn btn-secondary">Sign In</button>
        </form>
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAuthLogin: (username, password) =>
      dispatch(actions.authLogin(username, password)),
    onAuthSignup: (username, email, password1, password2) =>
      dispatch(actions.authSignup(username, email, password1, password2)),
  };
};
const NewSignup = connect(null, mapDispatchToProps)(Signup);
const NewLogin = connect(null, mapDispatchToProps)(Login);

const Register = ({
  errormsg,
  isAuthenticated,
  isLoading,
  onFBLogin,
  clearError,
}) => {
  const [whichRender, setWhichRender] = useState("signup");

  useEffect(() => {
    clearError();
  }, [clearError]);

  const responseFacebook = (response) => {
    onFBLogin(response.accessToken);
  };

  return (
      <>
    {
    isAuthenticated ?
    <Redirect to = '/' />
    :
    <>
      <div className="container mt-3">
        <h4 className = "testi_heading"> Register Here </h4>

        <div className="categories_profile">
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className="btn btn-outline-dark active">
              <input type="radio" name="options" checked
                onClick={() => {
                  setWhichRender("signup");
                  clearError();
                }}
                readOnly/> Signup </label>

            <label className="btn btn-outline-dark">
              <input type="radio" name="options"
                onClick={() => {
                  setWhichRender("login");
                  clearError();
                }}
                readOnly/> Login </label>
          </div>
        </div>
      </div>

      {isLoading ?
        <div className="loading_loading">
          <Facebook color="#343a40" size={200} />
        </div>
      :
        <>
          <div className="register_messages ">
              {
                errormsg !== null ?
                <p>{errormsg}</p>
                :
                <>
                  <p>
                    Registration Successful. Please visit your profile to provide
                    some informations.
                  </p>

                  <Link to="/profile" className="btn btn-primary">
                    Visit Profile
                  </Link>
                </>
              }
          </div>

          <div className="register_area container">
            {
              whichRender === "signup" ? <NewSignup /> : <NewLogin />
            }
            <div className="social_login">
              <FacebookLogin
                appId={`${process.env.REACT_APP_FB_APP_ID}`}
                fields="name,email,picture"
                callback={responseFacebook}
              />
            </div>
          </div>
        </>
      }
    </>
}
</>
  );
};

const mapDispatchToPropsFacebook = (dispatch) => {
  return {
    onFBLogin: (accesstoken) => dispatch(actions.FbLogin(accesstoken)),
    clearError: () => dispatch(actions.removeError()),
  };
};

const mapStateToPropsFacebook = (state) => {
  return {
    errormsg: state.error,
    isAuthenticated: state.token !== null,
    isLoading: state.loading,
  };
};

export default connect(mapStateToPropsFacebook,mapDispatchToPropsFacebook) (Register);
