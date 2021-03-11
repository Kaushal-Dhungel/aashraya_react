import React, { useState } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import { connect } from 'react-redux';
import { Facebook } from 'react-spinners-css';

export const UpdateRoomie =({url}) => {

    const [imgs,setImgs] = useState([]);
    const [location,setLocation] = useState('');
    const [suggestions,setSuggestions] = useState([]);
    const [done, setDone] = useState({
        isSuccess : false,
        slug : "",
        isLoading : false,
        isError : false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        setDone(() => {
            return {
                isSuccess:false,
                slug:"",
                isLoading: true,
                isError: false
            }
        })

        const form = new FormData(e.target);

        const coordinates = suggestions.filter(item => item.place_name === location)

        form.append("latitude",coordinates[0].center[0])
        form.append("longitude",coordinates[0].center[1])

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
        }
        }
        
    
        axios.post(url, form,config)
    
        .then(res => {
            e.target.reset();
            setImgs([]);
            setDone(() => {
                return {
                    isSuccess : true,
                    slug : res.data.slug,
                    isLoading : false,
                    isError :false,
                }

            } );
            
        })
        .catch(err => {
            setImgs([]);
            setDone((prevstate)=> {
                return{
                    ...prevstate,
                    isLoading : false,
                    isError: true
                }
            } )
        })
    

    }

    const imgChange = (e) => {

        setImgs([]);  // this clears the previously selected imgs

        if (e.target.files){
            const fileArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
            // console.log(fileArray);
            setImgs((prevImgs) => prevImgs.concat(fileArray));

            Array.from(e.target.files).map(
                (file) => URL.revokeObjectURL(file)
            );
        }
    }


    const renderImgs = (source) => {
        return source.map((photo) => {
            return (
            <img src={photo} key = {photo} alt=""  />
            )
        })
    }

    const searchPlaces = (value) => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/`;
        const token = `pk.eyJ1Ijoia2F1c2hhbDAyMyIsImEiOiJja2w4N2c4YWIyeTNzMnBxbzVtZGQwZGpyIn0.wneZVDJgjz_WlJQ40guy_Q`;

        const fullUrl = url + value + '.json?access_token=' + token;

        axios.get(fullUrl)
        .then((res) => {
            console.log(res)
            setSuggestions(res.data.features)
        })
        .catch((err)=> {
            console.log(err)
        })
    }

    const getLocation = (e) => {
        searchPlaces(e.target.value)
        setLocation(e.target.value);
    }


    return (
       <>
        {
            done.isLoading?  
                <div className="loading_loading">
                    <Facebook color = "rgb(230, 43, 83)" size = {200} />
                </div>
            :
            <>
                {
                    done.isSuccess ? 
                    <div className="container" >
                        <h3> Addition successful </h3>
                        <Link className = "btn btn-primary" to = {`rdetails/${done.slug}`} >See the post</Link>
                    </div>:
                    null   
                }

                {
                    done.isError?
                    <div className="container">
                        <h3 style= {{textAlign:'center',margin: "4vh 0vh"}}> An unknown error occured. Please try later. </h3>
                    </div>:
                    null   
                }
                <div className="container mt-5">
                    <form onSubmit={handleSubmit} className = "contact_form" action="#">
                        <select name="category" className = "form_input">
                            <option value="room">Room</option>
                            <option value="flat">Flat</option>
                            <option value="house">House</option>
                            <option value="hostel">Hostel</option>
                            <option value="land">Land</option>
                        </select>
                        <input name = 'headline' className = "form_input" type="text" placeholder="Headline" autoComplete = 'off' />

                        <input name = 'location' className = "form_input" type="text" placeholder="District" 
                            value = {location} onChange = {getLocation} list = "location" autoComplete = 'off' />
                            <datalist id="location">
                                {
                                    suggestions.map((item,index) => {
                                        return(
                                            <option key = {index} value={item.place_name} />
                                        )
                                    })
                                }
                            </datalist>

                        <select name="price_range" className = "form_input" >
                            <option value="0-5000">0-5000</option>
                            <option value="5001-10,000">5001-10,000</option>
                            <option value="10001-15000">10001-15000</option>
                            <option value="15001-20000">15001-20000</option>
                            <option value="20000+">20000+</option>
                        </select>

                        <select name="sex_pref" className = "form_input" >
                            <option value="male">male</option>
                            <option value="female">female</option>
                            <option value="male/female">male/female</option>
                        </select>

                        <select name="age_pref" className = "form_input" >
                            <option value="15-20">15-20</option>
                            <option value="21-25">21-25</option>
                            <option value="26-30">26-30</option>
                            <option value="31-35">31-35</option>
                            <option value="36-40">36-40</option>
                            <option value="40+">40+</option>
                        </select>

                        <textarea name="details" className = "form_input" cols="30" rows="10" placeholder ="Details"></textarea>

                        <label htmlFor="photos">Add Pictures:</label>
                        <input type="file" name="photos" className = "form_input" multiple onChange = {imgChange}  />

                        <div className="pics">
                            {
                                renderImgs(imgs)
                            }
                        </div>

                        <button className = "contact_button mt-3">Add</button>
                    </form>
                    
                    <br/> <br/> <br/> <br/> <br/> <br/> <br/>

                </div>
            </>
        }
    </>
    )
}

const addRoomie = ({isAuthenticated}) => {
    return (
        <>
        {
            isAuthenticated?
            <UpdateRoomie 
            url = {`${process.env.REACT_APP_HEROKU_URL}/mates/`}
            />
            :
            <div className="container logout_page">
            <h3> You need to be logged in to perform this operation </h3>
            </div>
        }
        </>

    )
}

const mapStateToProps = (state) => {
    return{
        isAuthenticated : state.token !== null,
    }
}

export default connect (mapStateToProps,null) (addRoomie);

// export default addRoomie;