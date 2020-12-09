import React, { useState,useEffect } from 'react';
import axios from 'axios';
import {Results} from '../components/Navbar';

const Rnav = (props) => {

    const city = props.match.params.id 
    const[items,setItems] = useState([]);
    const[cat,setCat] = useState('room')

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
                <input type="radio" name="options" id="hostel" data-action = "hostel" onClick = {categories} readOnly /> Hostels
            </label>

        </div>
        </div>
        

        {/* <RoomieResults items = {items} />        */}
        <Results items = {items} 
        linkSlug = {`rdetails`}
        />
        
        </>
    )
}


export default Rnav;