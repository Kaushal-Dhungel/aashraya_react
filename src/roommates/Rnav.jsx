import React, { useState,useEffect } from 'react';
import axios from 'axios';
import {Results} from '../components/Navbar';
import { Default } from 'react-spinners-css';
import RoomIcon from '@material-ui/icons/Room';
import HotelIcon from '@material-ui/icons/Hotel';
import SchoolIcon from '@material-ui/icons/School';

const Rnav = (props) => {

    const city = props.match.params.id 
    const[items,setItems] = useState([]);
    const[cat,setCat] = useState('room')
    const[fetching,setFetching] = useState(true)
    const[priceRange, setPriceRange] = useState(0)

    useEffect( () => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/mates/${cat}`,{
                    params: {
                      city,
                      priceRange
                    }
                  });
                // console.log(res.data)
                setItems(res.data);
                  setFetching(false)
            } 
            catch (error) {
                    setFetching(false)
                // console.log(error)
            }
        }
  
        fetchData();
    },[cat,city,priceRange]);
 

    const categories = (e) => {
        setCat(e.target.dataset.action)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const form = new FormData(e.target);
        let priceRange = form.get("price_range");

        if (priceRange === "" || priceRange === undefined)
            priceRange = 0

        setPriceRange(priceRange);
    }
    return (
        <>
            <div className="container" style = {{marginTop : "10vh"}}>

                <div className="box-element">

                    <div className="price_filter">
                        <form onSubmit={handleSubmit} className="filter_form" action="#">

                            <select name="price_range" className = "form_input" >
                            <option value="">Select Price Range</option>
                                <option value="0-5000">0-5000</option>
                                <option value="5001-10,000">5001-10,000</option>
                                <option value="10001-15000">10001-15000</option>
                                <option value="15001-20000">15001-20000</option>
                                <option value="20000+">20000+</option>
                            </select>

                            <button className = "btn btn-primary">Apply</button>
                        </form>
                    </div>
                </div>
            </div>

        <div className="categories">
        <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className="btn btn-outline-dark active">
                <input type="radio" name="options" id="room" checked data-action = "room" onClick = {categories} readOnly /> Rooms <HotelIcon />
            </label>
            <label className="btn btn-outline-dark">
                <input type="radio" name="options" id="flat" data-action = "flat" onClick = {categories} readOnly /> Flats <RoomIcon />
            </label>

            <label className="btn btn-outline-dark">
                <input type="radio" name="options" id="hostel" data-action = "hostel" onClick = {categories} readOnly /> Hostels <SchoolIcon />
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
            linkSlug = {`rdetails`}
            btnText = "Add To"

            />    
        }
        
        </>
    )
}


export default Rnav;