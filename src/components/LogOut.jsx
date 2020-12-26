import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import {Redirect} from 'react-router-dom';

import * as actions from '../store/actions/auth';


const Logout = ({isAuthenticated,onAuthLogout}) => {

    const history = useHistory();

    const logoutFunc = () => {

        onAuthLogout();
        history.push('/');
    }
    return (
        <>
        {
            isAuthenticated?
            <div className="container logout_page">
                <h2> Click the button below to Log Out</h2>
                <button className = "btn btn-primary" onClick = {logoutFunc}>Log Out</button>
            </div>
            :
            <Redirect to = "/"/>
        }
        </>

    )
}

const mapStateToProps = (state) => {
    return {
      isAuthenticated: state.token !== null,
    };
  };

const mapDispatchToProps =(dispatch) => {
    return {
        onAuthLogout: () => dispatch(actions.logout()),
        
    }
}

export default connect(mapStateToProps,mapDispatchToProps) (Logout);