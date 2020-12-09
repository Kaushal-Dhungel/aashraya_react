import React  from 'react';
import Navbar from './Navbar';
// import {Rnav} from '../roommates'
import {Link} from 'react-router-dom';

const Item = (props) => {
    const city = props.match.params.id 
    return (
        <>
        <div className="container" style = {{marginTop : "10vh"}}>
        <h2> This page doesn't display the result of Roommates. Click below to see the roommates from {city}.</h2>
            <Link to = {`/rnav/${city}`} className = "btn btn-primary" > See Roommates </Link>

        </div>
        {/* <Rnav /> */}
        <Navbar city = {city}/>
        </>
    )
}

export default Item;