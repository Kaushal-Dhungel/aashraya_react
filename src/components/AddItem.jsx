import React, { useState } from 'react';
import axios from 'axios';
import { addItemFunc} from './Auth';
import {Link} from "react-router-dom";
import { connect } from 'react-redux';
import { Facebook } from 'react-spinners-css';


export const Updateitem =({actionFunc,url}) => {

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

        const abc = location.split(",")
        const bcd = abc.map(item => item.trim())
        const val = bcd.join(",")

        form.append("location", val)
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
        // console.log(e.target.files);

        setImgs([]);  // this clears the previously selected imgs

        if (e.target.files){
            const fileArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
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
        const token = `${process.env.REACT_APP_MAPBOX_TOKEN}`;

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
           <Facebook color = "#343a40" size = {200} />
            </div>:
        <>
        {
            done.isSuccess ? 
            <div className="container mt-5 box-element" >
                <h3> Addition successful </h3>
                <Link className = "btn btn-danger" to = {`/items/details/${done.slug}`} >See the post</Link>
            </div>:
            null   
        }

        {
            done.isError?
            <div className="container mt-5 box-element">
                <h3 style= {{textAlign:'center'}}> An unknown error occured. Please try later. </h3>
            </div>:
            null   
        }

        <div className="container mt-5 box-element">
            <h4 className = "testi_heading"> Add an Item </h4>

            <form onSubmit={handleSubmit} className = "contact_form" action="#">
                <select name="category" className = "form_input" >
                    <option value="room">Room</option>
                    <option value="flat">Flat</option>
                    <option value="house">House</option>
                    <option value="hostel">Hostel</option>
                    <option value="land">Land</option>
                </select>
                <input name = 'headline' className = "form_input" type="text" placeholder="Headline" autoComplete = 'off' required />
                <input name = 'location' 
                    className = "form_input" 
                    type="text" 
                    placeholder="District" 
                    value = {location}
                    onChange = {getLocation}
                    list = "location"
                    autoComplete = 'off' required/>
                        <datalist id="location">
                            {
                                suggestions.map((item,index) => {
                                    return(
                                        <option key = {index} value={item.place_name} />
                                    )
                                })
                            }
                        </datalist>
                <input name = 'price' className = "form_input" type="number" placeholder="Price" autoComplete = 'off' required/>
                <textarea name="details" className = "form_input" cols="30" rows="10" placeholder ="Details" required></textarea>


                <label htmlFor="photos">Add Pictures:</label>
                <input type="file" name="photos" className = "form_input" multiple onChange = {imgChange}  required/>

                <div className="pics">
                    {
                        renderImgs(imgs)
                    }
                </div>

                <button className = "btn btn-secondary mt-3">Add</button>
            </form>
            <br/>
            <br/> <br/> <br/> <br/> <br/> <br/>

        </div>
    </>
    }
    </>
    )
}

const AddItem = ({isAuthenticated}) => {
    return (
        <>
        {
            isAuthenticated ?
            <Updateitem 
            actionFunc = {addItemFunc}
            url = {`${process.env.REACT_APP_HEROKU_URL}/items/`}
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

export default connect (mapStateToProps,null) (AddItem);
