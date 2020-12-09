import React, {useState,useEffect} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import {Results} from './Navbar'

import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';

const UserProfile = ()=> {

    const[item,setItem] = useState({});
    const[roomiePost,setRoomiePost] = useState();
    const[condn,setCondn] = useState(false)

    useEffect( () => {
        const fetchData = async () => {
            
            const token = localStorage.getItem('token');

            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
            }
            }
        
            try {
                const res = await axios.get(`https://aashraya.herokuapp.com/profile/`,config);
                // console.log(res.data)
                setItem(res.data);
  
            } catch (error) {
                // console.log(error)
            }
        }
  
        fetchData();
    },[]);

    const fetchRoomie = async() => {
        
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
        }
        }
    
        try {
            const res = await axios.get(`https://aashraya.herokuapp.com/mates/`,config);
            // console.log(res.data)
            setRoomiePost(res.data)
            // setItem(res.data);

        } catch (error) {
            // console.log(error)
        }
    }

    const showPosts = (e) => {
        // console.log(e.target.dataset.action);
        const abc = e.target.dataset.action;
        if (abc === 'items') {
            setCondn(false)
        }
        else {
            fetchRoomie();
            setCondn(true);
        }
    }


    return (
        <>
            {
                item === undefined ?
                <h2> Loading </h2>
                :
                <>
                {
                    item.phone ? null : 
                    <h4 style = {
                        {
                            marginTop : '5vh',
                            textAlign :'center',
                            color:'#e96443',
                        }  
                    }> || Please edit your profile to provide some required informations || </h4>
                }
                <div className="container ">
                <div className="row py-5 px-4">
                        <div className="col-md-5 mx-auto">
                            <div className="bg-white shadow rounded overflow-hidden">
                                <div className="px-4 pt-0 pb-4 cover">
                                    <div className="media align-items-end profile-head">
                                        <div className="profile mr-3">
                                            <img src={`https://aashraya.herokuapp.com${item.avatar}`} alt="..." width="130" className="rounded mb-2 img-thumbnail"/>
                                            <Link to="/profile/edit" className="btn btn-outline-dark btn-sm btn-block" >Edit profile</Link>
                                            </div>
                                        <div className="media-body mb-5 text-white">
                                            <h4 className="mt-0 mb-0"> {
                                                item.first_name && item.last_name? `${item.first_name} ${item.last_name}`: 
                                            item.get_username
                                            } 
                                            </h4>
                                            <p className="small mb-4"> <i className="fas fa-map-marker-alt mr-2"></i> @{item.get_username} </p>
                                            
                                        </div>
                                    </div>
                                </div>

                                {/* do not remove this div */}
                                <div className="bg-light p-4 d-flex justify-content-end text-center"></div>


                                <div className="px-4 py-3">
                                <Link to="/logout" className="btn btn-outline-dark btn-sm btn-block" >Logout</Link>

                                    <h5 className="mb-0">Contact</h5>

                                    <div className="p-4 rounded shadow-sm bg-light">

                                        <span className = "contact_info">
                                            <PhoneIcon fontSize="large" style={{ color: '#d8223b' }} /> 
                                            <p className="font-italic mb-0"> - {item.phone? item.phone : `not provided`} </p>
                                        </span>

                                        <span className = "contact_info">
                                            <EmailIcon fontSize="large" style={{ color: '#d8223b' }} /> 
                                            <p className="font-italic mb-0"> - {item.email} </p>
                                        </span>

                                        <span className="contact_info_social">
                                            <Link to = {item.facebook_link? item.facebook_link : `#`} > 
                                            <FacebookIcon fontSize="large" style={{ color: '#d8223b', }} />
                                            </Link>

                                            <Link to = {item.twitter_link? item.twitter_link : `#`} > 
                                            <TwitterIcon fontSize="large" style={{ color: '#d8223b', }} />
                                            </Link>

                                            <Link to = {item.instagram_link? item.instagram_link : '#'} > 
                                            <InstagramIcon fontSize="large" style={{ color: '#d8223b', }}/>
                                            </Link>

                                        </span>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                

                <div className=" container">
                    <div className="categories_profile">
                        <div className="btn-group btn-group-toggle" data-toggle="buttons">
                            <label className="btn btn-outline-dark active">
                                <input type="radio" name="options" id="room" checked data-action = "items" onClick = {showPosts} readOnly /> Items
                            </label>
                            <label className="btn btn-outline-dark">
                                <input type="radio" name="options" id="flat" data-action = "roomie" onClick = {showPosts} readOnly /> Roomie
                            </label>
                        </div>
                    </div>

                    {
                        condn ? 
                        <Results items = {roomiePost} 
                        linkSlug = {`rdetails`}
                        />
                        :
                        <Results items = { item.item_model}
                        linkSlug = {`items/details`}
                        />
                    }

                </div>

                </>
            }


        </>
    )
}

export default UserProfile;