import React, {useState,useEffect} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
// import { checkUser } from './Auth';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

import { Default } from 'react-spinners-css';

import Modal from 'react-modal';
import CancelIcon from '@material-ui/icons/Cancel';
import {addCart} from '../components/Auth';

import ReactMapGL ,{ Marker } from 'react-map-gl';
import mapboxgl from "mapbox-gl"; // This is a dependency of react-map-gl even if you didn't explicitly install it

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;



Modal.setAppElement('#root');
const Rdetail = (props)=> {

    const[item,setItem] = useState({});
    const[id,setId] = useState();
    const[fetching,setFetching] = useState(true);

    const[showPic, setShowPic] = useState(false);
    const [popupImg, setPopupImg] = useState();

    const [viewport, setViewport] = useState({
        width: 400,
        height: 400,    
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8
      });

    const token = `${process.env.REACT_APP_MAPBOX_TOKEN}`;

    const slug = props.match.params.id 

    useEffect( () => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/mates/details/${slug}`);
                setItem(res.data);
                setViewport((prevValue)=> {
                    return {
                        ...prevValue,
                        latitude:parseFloat(res.data.longitude),
                        longitude:parseFloat(res.data.latitude)
                    }
                 })
                setFetching(false);
  
            } catch (error) {
                setFetching(false);
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
               setId(res.data.id)
    
            } catch (error) {
                // console.log(error)
            }
    
    }

        fetchData();
        checkUser();
    },[slug]);

    const imgFunc = (e) => {
        setPopupImg(e.target.src)
        setShowPic(true)
    }

    return (
        <>
            {
                fetching ? 
                    <div className="loading_loading">
                        <Default color = "#343a40" size = {200} />
                    </div>
                :
                <>
                    {
                        item !== undefined ? 
                        <>
                            <Modal 
                            isOpen = {showPic}
                            style={{
                                overlay: {
                                backgroundColor: 'rgba(17, 13, 14, 0.507)',

                                },
                                content: {
                                top :'50%',
                                left :'50%',
                                right : 'auto',
                                bottom : 'auto',
                                marginRight : '-50%',
                                transform : 'translate(-50%, -50%)',
                                }
                            }}
                            >   
                                <div className="modal_img_wrapper" >
                                    <img src={popupImg} alt=".." srcSet=""/>
                                    <div className="close_btn" style = {{display:"flex",alignItems:"center",justifyContent:"center"}}>
                                        <CancelIcon style = {{fontSize: 40, cursor:'pointer'}} onClick = {()=> setShowPic(false)} />
                                    </div>
                                </div>

                            </Modal> 

                            <div className="container img_slider_wrapper">
                                {   
                                    item.images !== undefined ?
                                        item.images.map((imgs,index) => {
                                                return(
                                                    <img key = {index} onClick = {imgFunc}
                                                    src={`${imgs.image}`} alt="First slide"/>
                                                )
                                            })
                                        : null
                                }
                            </div>

                            <div className="details_of_items container">
                                <div className="details_left">
                                    <span className="location_icon">
                                        <LocationOnIcon />
                                        <h5> {item.location.split(",")[0]} </h5>
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
                                        <>
                                            {
                                                id === item.profile?
                                                <>
                                                    <Link to= {`/profile`} className="btn btn-primary">See Profile</Link>
                                                    <Link to= {`/rdetails/edit/${slug}`} className="btn btn-primary">Edit Post</Link>
                                                </>
                                                :
                                                <Link to= {`/items/profile/${item.profile_slug}`} className="btn btn-primary">See Profile</Link>
                                                
                                            }
                                        </>

                                        <button onClick = {addCart} className="btn btn-secondary"
                                        data-set= "roomie"
                                        data-id = {`${item.id}`}
                                        data-action = "add"
                                        >Add To Cart</button>
                                    </div>
                            
                                    <div className="map_area">
                                        <ReactMapGL
                                            {...viewport}
                                            mapboxApiAccessToken = {token}
                                            width = "290px"
                                            height = "300px"
                                            mapStyle = 'mapbox://styles/kaushal023/cklgwa17c009a18rxu3mdies2'
                                            onViewportChange={(viewport) => setViewport(viewport)}
                                            >
                                                <Marker
                                                latitude = {viewport.latitude}
                                                longitude = {viewport.longitude}
                                                >
                                                    <LocationOnIcon
                                                    style = {{fontSize: 40 }}
                                                    color="secondary"
                                                    />
                                                </Marker>
                                        </ReactMapGL>
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
    )}

export default Rdetail;
