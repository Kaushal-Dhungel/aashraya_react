import React, { useState,useEffect } from 'react';
import axios from 'axios';

import RoomIcon from '@material-ui/icons/Room';
import HotelIcon from '@material-ui/icons/Hotel';
import HouseIcon from '@material-ui/icons/House';
import LandscapeIcon from '@material-ui/icons/Landscape';
import SchoolIcon from '@material-ui/icons/School';
import { Default } from 'react-spinners-css';

import Results from '../components/Results';

const Navbar = ({city,minPrice,maxPrice}) => {

    const[items,setItems] = useState([]);
    const[cat,setCat] = useState('room')
    const[fetching,setFetching] = useState(true)

    useEffect( () => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/items/${cat}`,{
                    params: {
                      city,
                      minPrice,
                      maxPrice
                    }
                  });
                setItems(res.data);
                setFetching(false)
  
            } catch (error) {
            setFetching(false)
            }
        }
  
        fetchData();
    },[cat,city,minPrice,maxPrice]);
 
    // it sets what is clicked, maybe room, maybe flat etc and is then used to render the corresponding data
    const categories = (e) => {
        setCat(e.target.dataset.action)
    }

    return (
        <div className = "box-element mt-5">
            <div className="categories">
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <label className="btn btn-outline-dark active">
                        <input type="radio" name="options" id="room" checked data-action = "room" onClick = {categories} readOnly /> Rooms <HotelIcon />
                    </label>

                    <label className="btn btn-outline-dark">
                        <input type="radio" name="options" id="flat" data-action = "flat" onClick = {categories} readOnly /> Flats <RoomIcon />
                    </label>

                    <label className="btn btn-outline-dark">
                        <input type="radio" name="options" id="house" data-action = "house" onClick = {categories} readOnly /> Homes <HouseIcon />
                    </label>

                    <label className="btn btn-outline-dark">
                        <input type="radio" name="options" id="hostel" data-action = "hostel" onClick = {categories} readOnly /> Hostels <SchoolIcon />
                    </label>
                    
                    <label className="btn btn-outline-dark">
                        <input type="radio" name="options" id="land" data-action = "land" onClick = {categories} readOnly /> Lands <LandscapeIcon />
                    </label>
                </div>
            </div>
        
            {
                fetching ? 
                <div className="loading_loading">
                    <Default color = "#343a40" size = {150} />
                </div>
                :
                <Results items = {items} 
                linkSlug = {`items/details`}
                btnText = "Add To"
                />    
            }
        </div>
    )
}

export default Navbar;