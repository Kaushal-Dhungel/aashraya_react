import React from 'react';
import { connect } from 'react-redux';
import {NavLink} from "react-router-dom";
// import { isAuthenticated } from './Auth';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import HomeIcon from '@material-ui/icons/Home';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import PersonIcon from '@material-ui/icons/Person';

import roomieImg from '../imgs/roomie.svg';

const MainNav = ({isAuthenticated}) => {

    const navStyle = {
        color:"white",
        display:"flex",
        gap:"0.5rem"
    }

    return(
        <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <NavLink className="navbar-brand" exact to="/">
                <img src={roomieImg} alt="" height= "50px" width = "50px" 
                // style = {{
                //     filter: 'invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)'
                // }}
                />
            </NavLink>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto mr-5">
                    <li className="nav-item">
                        <NavLink className="nav-link" exact to="/"
                        activeStyle={navStyle}
                        >
                        Home 
                        <HomeIcon  
                            style = {{ fontSize : "30px"}}
                            />
                        <span className="sr-only">(current)</span></NavLink>
                    </li>
                    {
                        isAuthenticated?
                        
                        <li className="nav-item ">
                            <NavLink className="nav-link" exact to="/profile"
                            activeStyle={navStyle}
                            >Profile
                                <PersonIcon  
                                style = {{ fontSize : "30px"}}
                                />
                            </NavLink>
                        </li>
                        :
                        <li className="nav-item ">
                            <NavLink className="nav-link" exact to="/register"
                            activeStyle={navStyle}
                            >Login
                                <LockOpenIcon  
                                style = {{ fontSize : "30px"}}
                                />
                            </NavLink>
                        </li>     
                    }
                    
                    <li>
                        <NavLink className="nav-link" exact to="/cart"
                        activeStyle={navStyle}
                        >   Cart
                            <ShoppingCartIcon  
                            style = {{ fontSize : "30px"}}
                            />
                            </NavLink>
                    </li>
                    
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