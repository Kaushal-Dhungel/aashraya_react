import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import {Link} from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete';
import { Facebook,Default } from 'react-spinners-css';
import swal from 'sweetalert';

const DetailsEdit = (props) => {
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
        const fetchData = async () => {

            
            const token = localStorage.getItem('token');

            const config = {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
            }
            }
        
            try {
                const res = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/items/details/${slug}`,config);
                setItem(res.data);
                setFetching(false);
  
            } catch (error) {
                setFetching(false);
            }
        }
  
        fetchData();
    },[slug])

    const handleSubmit = (e) => {
        e.preventDefault();

        isFormloading(true);

        const form = new FormData(e.target);
        const token = localStorage.getItem('token');
        
        const coordinates = suggestions.filter(itm => itm.place_name === item.location)

        form.append("latitude",coordinates[0].center[0])
        form.append("longitude",coordinates[0].center[1])

        const config = {
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
        }
        }
    
            axios.put(`${process.env.REACT_APP_HEROKU_URL}/items/details/${slug}/`,form,config)

            .then(res => {
                isFormloading(false)
                history.push(`/items/details/${res.data.slug}`)
    
        
            })
            .catch(err => {
                isFormloading(false)
            })


    }


    const myFunc = (e) => {
        const {name, value} = e.target

        setItem( (intialState) => {
            return {
                ...intialState,
                [name] : value
            }

        })
    }

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
    
            axios.post(`${process.env.REACT_APP_HEROKU_URL}/items/details/${slug}/`,form,config)

            .then(res => {

                setItem(res.data)
                setDone (() => {
                    return {
                        imgsUpload: false,
                        imgDelete : true,
                        isAddLoading: false,
                        isDelLoading: false
                    }
                })
                swal("Deleted!", "The picture has been deleted", "success")
    
        
            })
            .catch(err => {

                setDone (() => {
                    return {
                        imgsUpload: false,
                        imgDelete : false,
                        isAddLoading: false,
                        isDelLoading : false
                    }
                })
                swal("Failed!", "Can't delete this right now. Try again!!", "error")
            })


    }


    const addFunc = (e,item_id) => {

        setDone (() => {
            return {
                imgsUpload: false,
                imgDelete : false,
                isAddLoading: true,
                isDelLoading : false,
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
    
            axios.post(`${process.env.REACT_APP_HEROKU_URL}/items/details/${slug}/`,form,config)

            .then(res => {
                setItem(res.data)
                e.target.reset();
                setImgs([]);
                setDone ( ()=> {
                    return {
                        imgsUpload :true,
                        imgDelete : false,
                        isAddLoading : false,
                        isDelLoading : false,
                    }
                })
        
            })
            .catch(err => {
                setDone (() => {
                    return {
                        imgsUpload: false,
                        imgDelete : false,
                        isAddLoading: false,
                        isDelLoading: false,
                    }
                })
            })

    }


    const imgChange = (e) => {
        console.log(e.target.files);

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
            <img src={photo} key = {photo} alt=""   />
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
        setItem((prevValue) => {
            return {
                ...prevValue,
                location:e.target.value
            }
        })
    }

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
            
                axios.delete(`${process.env.REACT_APP_HEROKU_URL}/items/details/${slug}/`,config)
                
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
                        <Link className = "btn btn-danger" to = {`/items/details/${item.slug}`}>Go back to the post</Link>
                    </div>

                    <div className="container mt-5 box-element">
                        {
                            formloading? 
                            <div className="loading_loading">
                                <Default color = "#343a40" size = {200} />
                            </div>
                            :
                            <>
                                <h4 className = "testi_heading"> Edit Details </h4>

                                <form onSubmit={handleSubmit} className = "contact_form" action="#">
                                    <select name="category" className = "form_input" value = {item.category} onChange = {myFunc} >
                                        <option value="room">Room</option>
                                        <option value="flat">Flat</option>
                                        <option value="house">House</option>
                                        <option value="hostel">Hostel</option>
                                        <option value="land">Land</option>
                                    </select>
                                    <input name = 'headline'
                                    className = "form_input" type="text" value = {item.headline} 
                                    onChange = {myFunc} placeholder="Headline" autoComplete = 'off' />

                                    <input name = 'location' 
                                    className = "form_input" 
                                    type="text" 
                                    placeholder="District" 
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

                                    <input name = 'price' className = "form_input" type="number" 
                                    value = {item.price} onChange = {myFunc} placeholder="Price" autoComplete = 'off'/>

                                    <textarea name="details" className = "form_input" cols="30" rows="10" 
                                    value = {item.details} onChange = {myFunc} placeholder ="Details"></textarea>
                                    <button className = "btn btn-danger">Add</button>
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
                                                                    deleteFunc(e,img.id,img.item)
                                                                }
                                                            })
                                                        
                                                        }} 
                                                    
                                                        className = "contact_form" action="#" style ={{height:"10%"}}>

                                                        <input type="text" hidden/> 
                                                    
                                                        <button className = "btn btn-danger" disabled ={done.isDelLoading} > <DeleteIcon /> </button>

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
    )
}

export default DetailsEdit;