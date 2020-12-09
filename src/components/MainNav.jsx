import React from 'react';
import { connect } from 'react-redux';
import {Link} from "react-router-dom";
// import { isAuthenticated } from './Auth';
import roomieImg from '../imgs/roomie.svg';

const MainNav = ({isAuthenticated}) => {
    return(
        <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">
            <img src={roomieImg} alt="" height= "50px" width = "50px"/>
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ">
                <li className="nav-item active">
                    <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                </li>
              {
                  isAuthenticated?
                <li className="nav-item ">
                    <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                :
                <li className="nav-item ">
                <Link className="nav-link" to="/register">Login</Link>
                </li>                
                }

                </ul>
            </div>
        </nav>
        </>
    )
}

const mapStateToProps = (state) => {
    return{
        isAuthenticated : state.token !== null,
    }
}

export default connect (mapStateToProps,null) (MainNav);