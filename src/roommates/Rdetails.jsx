import React, {useState,useEffect} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
// import { checkUser } from './Auth';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import mapImg from '../imgs/gmap.png';

import { Default } from 'react-spinners-css';

const Rdetail = (props)=> {

    const[item,setItem] = useState({});
    const[id,setId] = useState();
    const[fetching,setFetching] = useState(true);
    const slug = props.match.params.id 

    useEffect( () => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/mates/details/${slug}`);
                // console.log(res.data)
                setItem(res.data);
                setFetching(false);
  
            } catch (error) {
                setFetching(false);
                // console.log(error)
            }
        }

        const checkUser = async () => {
            
            const token = localStorage.getItem('token');
    
            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
            }
            }
        
            try {
                const res = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/profile/`,config);
                // console.log(res.data)
               setId(res.data.id)
    
            } catch (error) {
                // console.log(error)

            }
    
    }

        fetchData();
        checkUser();
    },[slug]);


    return (
        <>
        {
            fetching ? 
            <div className="loading_loading">
                <Default color = "rgb(230, 43, 83)" size = {200} />
            </div>
            :
        <>
        {
          
        item !== undefined ? 

        <>

        <div className=" details_carousel container">
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                    {   item.images !== undefined ?
                        item.images.map((imgs,index) => {
                            return(
                                <div key = {index} className={`carousel-item ${index===0 ?'active': '' }`}>
                                <img style = {{height:'600px',}}
                                className="d-block w-100" src={`${process.env.REACT_APP_HEROKU_URL}${imgs.image}`} alt="First slide"/>
                                </div>
                            )
                        })
                        : null
                    }

                    
                </div>
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
                </div>
        </div>

        <div className="details_of_items container">
            <div className="details_left">
                <span className="location_icon">
                    <LocationOnIcon />
                    <h5> {item.city} </h5>
                </span>

                <span className="location_icon">
                    <AttachMoneyIcon />
                    <p> <strong> {item.price_range} </strong>  </p>
                </span>
                <p>
                    Sex Preference :- <strong> {item.sex_pref} </strong>  <br/>
                    Age Preference :- <strong> {item.age_pref} </strong> 
                </p>
                <h3> {item.headline} </h3>
                <p>
                    {item.details}
                </p>

            </div>

            <div className="details_right">
                <div className="above_map">
                    {
                    id === item.profile?
                    <>
                    <Link to= {`/profile`} className="btn btn-primary">See Profile</Link>
                    <Link to= {`/rdetails/edit/${slug}`} className="btn btn-primary">Edit Post</Link>
                    </>
                    :
                    <Link to= {`/items/profile/${item.profile_slug}`} className="btn btn-primary">See Profile</Link>
                        
                    }
                </div>
                    
                <div className="map_area">
                    <img src={mapImg} alt="" height = "300px" width = "300px" />
                </div>

            </div>


        </div>

        </>
                : 
                <h4> Undefined </h4>
                }
                
        </>
    }
    </>
    )
}

export default Rdetail;
