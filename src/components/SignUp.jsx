import React, { useState, useEffect } from "react";
import * as actions from "../store/actions/auth";
import { connect } from "react-redux";
import FacebookLogin from "react-facebook-login";
import { Link } from "react-router-dom";
import { Facebook } from "react-spinners-css";
import {Redirect} from 'react-router-dom';


function Signup({ onAuthSignup }) {
  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get("username");
    const email = form.get("email");
    const password1 = form.get("password1");
    const password2 = form.get("password2");

    onAuthSignup(name, email, password1, password2);
  }

  return (
    <>
      <div className="container box-element">
        <form onSubmit={handleSubmit} className="contact_form" action="#">

          <input name="username" className="form_input" type="text"
            placeholder="Username" autoComplete="off" required/>

          <input name="email" className="form_input" type="email"
            placeholder="Email" autoComplete="off" required/>

          <input name="password1" className="form_input" type="password"
            placeholder="Password" autoComplete="off"required/>
          <input name="password2" className="form_input" type="password"
            placeholder="Confirm Password" autoComplete="off" required/>

          <button className="btn btn-secondary">Signup</button>
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

const Registration = connect(
  mapStateToPropsFacebook,
  mapDispatchToPropsFacebook
)(Register);
export default Registration;
