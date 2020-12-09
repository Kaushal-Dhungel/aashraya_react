import React, { useState,useEffect } from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';

import HomeIcon from '@material-ui/icons/Home';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

const Navbar = ({city}) => {

    const[items,setItems] = useState([]);
    const[cat,setCat] = useState('room')

    useEffect( () => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`https://aashraya.herokuapp.com/items/${cat}`,{
                    params: {
                      city
                    }
                  });
                // console.log(res.data)
                setItems(res.data);
  
            } catch (error) {
                // console.log(error)
            }
        }
  
        fetchData();
    },[cat,city]);
 

    const categories = (e) => {
        // console.log(e.target.dataset.action);
        // setItems(e.target.dataset.action);
        setCat(e.target.dataset.action)
    }

    return (
        <>
        <div className="categories">
        <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className="btn btn-outline-dark active">
                <input type="radio" name="options" id="room" checked data-action = "room" onClick = {categories} readOnly /> Rooms
            </label>
            <label className="btn btn-outline-dark">
                <input type="radio" name="options" id="flat" data-action = "flat" onClick = {categories} readOnly /> Flats
            </label>
            <label className="btn btn-outline-dark">
                <input type="radio" name="options" id="house" data-action = "house" onClick = {categories} readOnly /> Homes
            </label>
            <label className="btn btn-outline-dark">
                <input type="radio" name="options" id="hostel" data-action = "hostel" onClick = {categories} readOnly /> Hostels
            </label>
            <label className="btn btn-outline-dark">
                <input type="radio" name="options" id="land" data-action = "land" onClick = {categories} readOnly /> Lands
            </label>
        </div>
        </div>
        

        <Results items = {items} 
        linkSlug = {`items/details`}
        />       
        
        </>
    )
}

export const Results = ({items,linkSlug}) => {
   

    const GetBlogs = () => {
        let list = [];
        let result = [];
        
        items === undefined ? 
        <h2> Loading </h2>
        :
        items.map(item => {
            return list.push(
                <div className="card" >
                {
                    item.images.length === 0 ?
                <img className="card-img-top" src={`https://images.unsplash.com/photo-1606474165573-2fa973b42c21?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80`} alt = "" />
                    :
                <img className="card-img-top" src={`https://aashraya.herokuapp.com${item.images[0].image}`} alt = "" height = "300px"  />
                }
                <div className="card-body">
                    <span className="card_location">
                        <LocationOnIcon />
                       <p>{item.city}</p> 
                    </span>

                    <span className="card_location">
                        <HomeIcon />
                        <p>{item.category}</p>
                    </span>

                    <span className="card_location">
                        <AttachMoneyIcon />
                        <p>{item.price? item.price : item.price_range}</p>
                    </span>
                    <h4 className="card-title"> {item.headline} </h4>
                    <Link to= {`/${linkSlug}/${item.slug}`} className="btn btn-primary">See Details</Link>
                </div>
            </div>
            );
        });

        for ( let i = 0 ; i < list.length ; i+=3)
        {
            result.push(
                <div key = {i} className = "custom_row">
                        {list[i]}

                        {list[i+1] ? list[i+1] : null}
                        {list[i+2] ? list[i+2] : null}
                </div>
            )
        }
        return result.length === 0 ? 
        <div className="not_available" style = {{height: "40vh"}}>
        <h2 style = {{marginTop: "10vh",textAlign : "center"}}> No items posted</h2>
        </div> :
        result
        // return list
        
    }


    return (
        <>

    {
        
        GetBlogs()
    }
    </>
    )
    
}

export default Navbar;