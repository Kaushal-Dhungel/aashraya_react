import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete';
import { Facebook,Default } from 'react-spinners-css';
import {Link} from "react-router-dom";
import swal from 'sweetalert';
import { searchPlaces } from '../components/utils';

const RDetailsEdit = (props) => {
    const[item,setItem] = useState({});
    const [imgs,setImgs] = useState([]);
    const[fetching,setFetching] = useState(true);
    const [suggestions,setSuggestions] = useState([]);

    const [done, setDone] = useState({
        imgsUpload : false,
        imgDelete : false,    
        isAddLoading : false,
        isDelLoading : false,
    });
    const[formloading,isFormloading] = useState(false);

    const slug = props.match.params.id 
    const history = useHistory();

    useEffect( () => {

        // fetch data to populate input fields
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
                }
            }
        
            try {
                const res = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/mates/details/${slug}`,config);
                setItem(res.data);
                setFetching(false);
            } 
            catch (error) {
                setFetching(false);
            }
        }
  
        fetchData();
    },[slug])

    // when submitted
    const handleSubmit = (e) => {
        e.preventDefault();
        isFormloading(true);

        const form = new FormData(e.target);
        const token = localStorage.getItem('token');

        const coordinates = suggestions.filter(itm => itm.place_name === item.location)

        if (coordinates.length !== 0) {  // this happens when the location is edited, and hence suggestions would not be empty
            form.append("latitude",coordinates[0].center[0])
            form.append("longitude",coordinates[0].center[1])
        }
        else {
            form.append("latitude",item.latitude)
            form.append("longitude",item.longitude)
        }

        const config = {
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
            }
        }
    
        axios.put(`${process.env.REACT_APP_HEROKU_URL}/mates/details/${slug}/`,form,config)
        .then(res => {
            isFormloading(false)
            history.push(`/rdetails/${res.data.slug}`);
        })
        .catch(err => {
            isFormloading(false)
        })
    }

    // when any input field is updated
    const myFunc = (e) => {
        const {name, value} = e.target

        setItem( (intialState) => {
            return {
                ...intialState,
                [name] : value
            }
        })
    }

    // for deleting the pictures
    const deleteFunc = (e,img_id,item_id) => {
        setDone(()=> {
            return {
                imgsUpload : false,
                imgDelete : false,    
                isAddLoading : false,
                isDelLoading: true,
            }
        })

        const form = new FormData(e.target);
        form.append('action','remove_img')
        form.append('img_id',img_id)
        form.append('item_id',item_id)

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
            }
        }
    
        axios.post(`${process.env.REACT_APP_HEROKU_URL}/mates/details/${slug}/`,form,config)
        .then(res => {
            setItem(res.data)
            setDone(()=> {
                return {
                    imgsUpload : false,
                    imgDelete : true,    
                    isAddLoading : false,
                    isDelLoading: false,
                }
            })
            swal("Deleted!", "The picture has been deleted", "success")
        })
        .catch(err => {
            setDone(()=> {
                return {
                    imgsUpload : false,
                    imgDelete : false,    
                    isAddLoading : false,
                    isDelLoading: false,
                }
            })
            swal("Failed!", "Can't delete this right now. Try again!!", "error")
        })
    }

    // for adding the pictures
    const addFunc = (e,item_id) => {
        setDone(()=> {
            return {
                imgsUpload : false,
                imgDelete : false,
                isAddLoading : true,
                isDelLoading: false,
            }
        })
        const form = new FormData(e.target);
        form.append('action','add_img');
        form.append('item_id',item_id);

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                // "Content-Type" : "application/json",
                'content-type': 'multipart/form-data',
                Authorization : `Bearer ${token}`
            }
        }
            axios.post(`${process.env.REACT_APP_HEROKU_URL}/mates/details/${slug}/`,form,config)

            .then(res => {

                setItem(res.data)
                e.target.reset();
                setImgs([]);
                setDone(()=> {
                    return {
                        imgsUpload : true,
                        imgDelete : false,    
                        isAddLoading : false,
                        isDelLoading: false,
                    }
                })
            })
            .catch(err => {
                setDone(()=> {
                    return {
                        imgsUpload : false,
                        imgDelete : false,    
                        isAddLoading : false,
                        isDelLoading: false,
                    }
                })
            })
    }

    // when new image is selected
    const imgChange = (e) => {
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

    // get suggestions list
    const getLocation = (e) => {
        searchPlaces(e.target.value)
        .then (res => {
            setSuggestions(res)
        })
        .catch (err => {
            console.log(err)
        })

        setItem((prevValue) => {
            return {
                ...prevValue,
                location:e.target.value
            }
        })
    }

    // delete post
    const deletePost = () => {
        swal({
            title: "Are you sure?",
            text: "Are you sure that you want to delete this post?",
            icon: "warning",
            dangerMode: true,
          })

          .then(willDelete => {
            if (willDelete) {

                const token = localStorage.getItem('token');
        
                const config = {
                    headers: {
                        "Content-Type" : "application/json",
                        Authorization : `Bearer ${token}`
                    }
                }

                axios.delete(`${process.env.REACT_APP_HEROKU_URL}/mates/details/${slug}/`,config)
                .then(res => {
                    swal("Deleted!", "The post has been deleted", "success")
                    .then(okay => {
                      history.push('/');
                    })
                })
                .catch (err => {
                    swal("Sorry!", "The post can not be deleted right now. PLease try later.", "warning")
                })
            }
          })
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
                        item === undefined ?
                            <div className="loading_loading">
                                <Facebook color = "#343a40" size = {200} />
                            </div>
                        :
                        <>

                            <div className="container mt-5 box-element">
                                <Link className = "btn btn-danger" to = {`/rdetails/${item.slug}`}>Go back to the post</Link>
                            </div>

                            <div className="container mt-5 box-element">
                                {     
                                    formloading? 
                                        <div className="loading_loading">
                                            <Default color = "#343a40" size = {200} />
                                        </div>
                                    :
                                    <>  
                                        <h4 className = "testi_heading"> Edit Roomie Details </h4>
                                    
                                        <form onSubmit={handleSubmit} className = "contact_form" action="#">
                                            <select name="category" className = "form_input" value = {item.category} onChange = {myFunc} >
                                                <option value="room">Room</option>
                                                <option value="flat">Flat</option>
                                                <option value="house">House</option>
                                                <option value="hostel">Hostel</option>
                                                <option value="land">Land</option>
                                            </select>
                                            <input name = 'headline' className = "form_input" type="text" value = {item.headline} onChange = {myFunc} placeholder="Headline" autoComplete = 'off' />
                                            <input name = 'location' 
                                                className = "form_input" 
                                                type="text" 
                                                placeholder="Location" 
                                                value = {item.location}
                                                onChange = {getLocation}
                                                list = "location"
                                                autoComplete = 'off' />
                                                    <datalist id="location">
                                                        {
                                                            suggestions.map((item,index) => {
                                                                return(
                                                                    <option key = {index} value={item.place_name} />
                                                                )
                                                            })
                                                        }
                                                    </datalist>

                                            
                                            <select name="price_range" className = "form_input" value = {item.price_range} onChange = {myFunc} >
                                                <option value="0-5000">0-5000</option>
                                                <option value="5001-10,000">5001-10,000</option>
                                                <option value="10001-15000">10001-15000</option>
                                                <option value="15001-20000">15001-20000</option>
                                                <option value="20000+">20000+</option>
                                            </select>

                                            <select name="sex_pref" className = "form_input" value = {item.sex_pref} onChange = {myFunc} >
                                                <option value="male">male</option>
                                                <option value="female">female</option>
                                                <option value="male/female">male/female</option>
                                            </select>

                                            <select name="age_pref" className = "form_input" value = {item.age_pref} onChange = {myFunc} >
                                                <option value="15-20">15-20</option>
                                                <option value="21-25">21-25</option>
                                                <option value="26-30">26-30</option>
                                                <option value="31-35">31-35</option>
                                                <option value="36-40">36-40</option>
                                                <option value="40+">40+</option>
                                            </select>

                                            <textarea name="details" className = "form_input" cols="30" rows="10" value = {item.details} onChange = {myFunc} placeholder ="Details"></textarea>
                                            <button className = "btn btn-danger">Update</button>
                                        </form>
                                    </>
                                }

                                <div className="img_update">
                                        {   

                                            done.imgsUpload ? <h4> Pic updated successfully </h4> : null
                                        }

                                        {
                                            // done.imgDelete? <h4> Pic deleted successfully</h4> : null
                                        }
                                </div>

                                <div className="image_area">
                                    <div className="image_area_backend">
                                        {
                                            item.images === undefined ?
                                                <Default color = "#343a40" size = {100} />
                                            :
                                            item.images.map((img,index) => {
                                                return(
                                                    <div key = {index}>
                                                        <div className="pp">
                                                            <img  src={`${img.image}`} alt="img" srcSet="" height = '300px' width = '300px'/>
                                                        </div>

                                                        <form onSubmit={(e) => 
                                                        { 
                                                            e.preventDefault();  
                                                            swal({
                                                                title: "Are you sure?",
                                                                text: "Are you sure that you want to delete this?",
                                                                icon: "warning",
                                                                dangerMode: true,
                                                            })
                                                            .then(willLogOut => {
                                                                if (willLogOut) {
                                                                    deleteFunc(e,img.id,img.roomie)
                                                                }
                                                            })
                                                        }} 
                                                        className = "contact_form" action="#" style ={{height:"10%"}}>
                                                            <input type="text" hidden/> 
                                                        
                                                            <button className = "btn btn-danger" disabled = {done.isDelLoading}> <DeleteIcon /> </button>

                                                        </form>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>


                                    <form onSubmit={(e)=>{e.preventDefault(); addFunc(e,item.id)}} className = "contact_form" action="#">
                                        {
                                            done.isAddLoading? <Default color = "#343a40" size = {70} /> : null
                                        }
                                        <input type="file" name="photos" 
                                        className = "form_input" 
                                        // accept="image/png, image/jpeg"
                                        multiple 
                                        onChange = {imgChange}/> 

                                        <div className="pics">
                                            {
                                                renderImgs(imgs)
                                            }
                                        </div>
                                        
                                        <button className = "btn btn-danger mt-3" 
                                        disabled = {done.isAddLoading || imgs.length === 0 ? true : false}
                                        >Add</button>

                                    </form>
                                </div>

                                <center>
                                    <div className="delete_button" style = {{margin :"7vh 0"}}>
                                        <button className = "btn btn-danger" onClick = {deletePost}> Delete This Post</button>
                                    </div>
                                </center>

                            </div>
                        </>
                    }        
                </>
            }
        </>
)}

export default RDetailsEdit;