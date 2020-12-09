import React, { useState,useEffect } from 'react';
import axios from 'axios';
import {Results} from '../components/Navbar';
import { Default } from 'react-spinners-css';

const Rnav = (props) => {

    const city = props.match.params.id 
    const[items,setItems] = useState([]);
    const[cat,setCat] = useState('room')
    const[fetching,setFetching] = useState(true)

    useEffect( () => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`https://aashraya.herokuapp.com/mates/${cat}`,{
                    params: {
                      city
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
                <input type="radio" name="options" id="hostel" data-action = "hostel" onClick = {categories} readOnly /> Hostels
            </label>

        </div>
        </div>
        
        {
            fetching ? 
            <div className="loading_loading">
                <Default color = "rgb(230, 43, 83)" size = {150} />
            </div>
            :
            <Results items = {items} 
            linkSlug = {`rdetails`}
            />    
        }

        {/* <RoomieResults items = {items} />        */}
        
        </>
    )
}


export default Rnav;