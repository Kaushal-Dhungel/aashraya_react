import React, { useEffect } from 'react';
import {Home,Item,ItemDetail,Profile,Additem,MainNav,UserProfile,
    Logout,ProfileEdit,DetailsEdit,Footer,Registration, CartView} from './components';

import {Rnav,Rdetail,RDetailsEdit,addRoomie} from './roommates';
import { BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

import * as actions from './store/actions/auth'

import { connect } from 'react-redux';


const App = ({onTryAutoSignup}) => {

    useEffect(()=> {
        onTryAutoSignup();
    },[onTryAutoSignup])

    return (
        <>
        
        <BrowserRouter >
        <MainNav />
        <Switch>
            <Route exact path = '/' component = {Home}/>
            <Route exact path = '/items/:id' component = {Item}/>
            <Route exact path = '/items/details/:id' component = {ItemDetail}/>
            <Route exact path = '/items/profile/:id' component = {Profile}/>
            <Route exact path = '/additem' component = {Additem}/>
            {/* <Route exact path = '/login' component = {Login}/> */}
            <Route exact path = '/register' component = {Registration}/>
            <Route exact path = '/profile' component = {UserProfile}/>
            <Route exact path = '/logout' component = {Logout}/>
            <Route exact path = '/profile/edit' component = {ProfileEdit}/>
            <Route exact path = '/details/edit/:id' component = {DetailsEdit}/>

            <Route exact path = '/rnav/:id' component = {Rnav}/>
            <Route exact path = '/rdetails/:id' component = {Rdetail}/>
            <Route exact path = '/rdetails/edit/:id' component = {RDetailsEdit}/>
            <Route exact path = '/addroomie' component = {addRoomie}/>

            <Route exact path = '/cart' component = {CartView}/>



            <Redirect to  ="/" />
        </Switch>
        </BrowserRouter>
        <Footer />
        </>
    )
}


const mapDispatchToProps = dispatch => {
    return {
      onTryAutoSignup: ()=> dispatch(actions.authCheckState())
    }
  }
  
export default connect(null,mapDispatchToProps) (App);
