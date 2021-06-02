import React, { useEffect } from 'react';

import { Home,SearchResults,Navbar,Footer,Registration,CartView } from './components';
import { Profile, ProfileEdit,UserProfile } from './profile';    
import { Rnav,Rdetail,RDetailsEdit,addRoomie } from './roommates';
import { Additem,ItemDetail,DetailsEdit } from './items';

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
            <Navbar />
            <Switch>
                <Route exact path = '/' component = {Home}/>
                <Route exact path = '/additem' component = {Additem}/>
                <Route exact path = '/register' component = {Registration}/>
                <Route exact path = '/cart' component = {CartView}/>

                <Route exact path = '/profile' component = {UserProfile}/>
                <Route exact path = '/profile/edit' component = {ProfileEdit}/>

                <Route exact path = '/details/edit/:id' component = {DetailsEdit}/>
                <Route exact path = '/items/:id' component = {SearchResults}/>
                <Route exact path = '/items/details/:id' component = {ItemDetail}/>
                <Route exact path = '/items/profile/:id' component = {Profile}/>

                <Route exact path = '/rnav/:id' component = {Rnav}/>
                <Route exact path = '/rdetails/:id' component = {Rdetail}/>
                <Route exact path = '/rdetails/edit/:id' component = {RDetailsEdit}/>
                <Route exact path = '/addroomie' component = {addRoomie}/>

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
