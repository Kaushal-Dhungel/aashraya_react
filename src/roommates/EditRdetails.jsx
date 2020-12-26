import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete';
import { Facebook,Default } from 'react-spinners-css';
import {Link} from "react-router-dom";


const RDetailsEdit = (props) => {
    const[item,setItem] = useState({});
    const [imgs,setImgs] = useState([]);
    const[fetching,setFetching] = useState(true);
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
                const res = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/mates/details/${slug}`,config);
                // console.log(res.data)
                setItem(res.data);
                setFetching(false);
  
            } catch (error) {
                setFetching(false);
                // console.log(error)
            }
        }
  
        fetchData();
    },[slug])

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log('submitted');
        isFormloading(true);

        const form = new FormData(e.target);
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
        }
        }
    
            axios.put(`${process.env.REACT_APP_HEROKU_URL}/mates/details/${slug}/`,form,config)

            .then(res => {
                // console.log('updated')
                // console.log(res.data)
                isFormloading(false)
                history.push(`/rdetails/${res.data.slug}`);
    
        
            })
            .catch(err => {
                isFormloading(false)
                // console.log("sorry no update")
                // console.log(err)
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
        // const id = e.target.dataset.id;
        // const item_id = e.target.dataset.item;
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

        // const action = 'remove_img';

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
        }
        }
    
            axios.post(`${process.env.REACT_APP_HEROKU_URL}/mates/details/${slug}/`,form,config)

            .then(res => {
                // console.log('deleted')
                // console.log(res.data)
                setItem(res.data)
                setDone(()=> {
                    return {
                        imgsUpload : false,
                        imgDelete : true,    
                        isAddLoading : false,
                        isDelLoading: false,
                    }
                })
                // history.push(`/items/details/${res.data.slug}`)
    
        
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
                // console.log("sorry no delete")
                // console.log(err)
            })


    }


    const addFunc = (e,item_id) => {
        // e.preventDefault();

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
        // const img = form.get('photos');
        // console.log(img);

 
        // form.append('action','add_img');
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
                // console.log('deleted')
                // console.log(res.data)
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
                // history.push(`/items/details/${res.data.slug}`)
    
        
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
                // console.log("sorry no delete")
                // console.log(err)
            })

    }

    const imgChange = (e) => {
        // console.log(e.target.files);

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
            // console.log(photo);
            return (
            <img src={photo} key = {photo} alt=""  />
            )
        })
    }

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
            item === undefined ?
            <div className="loading_loading">
                <Facebook color = "rgb(230, 43, 83)" size = {200} />
            </div>
            :
            <div className="container">

            {     
               formloading? 
               <div className="loading_loading">
                   <Default color = "rgb(230, 43, 83)" size = {200} />
               </div>
               :
            <>  
            <Link className = "btn btn-danger" to = {`/rdetails/${item.slug}`}>Go back to the post</Link>
            <form onSubmit={handleSubmit} className = "contact_form" action="#">
                <select name="category" className = "form_input" value = {item.category} onChange = {myFunc} >
                    <option value="room">Room</option>
                    <option value="flat">Flat</option>
                    <option value="house">House</option>
                    <option value="hostel">Hostel</option>
                    <option value="land">Land</option>
                </select>
                <input name = 'headline' className = "form_input" type="text" value = {item.headline} onChange = {myFunc} placeholder="Headline" autoComplete = 'off' />
                <input name = 'location' className = "form_input" type="text" value = {item.location} onChange = {myFunc} placeholder="District" autoComplete = 'off' />
                <input name = 'city' className = "form_input" type="text" value = {item.city} onChange = {myFunc} placeholder="City" autoComplete = 'off'/>
                
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
                <button className = "contact_button">Add</button>
            </form>
            </>
            }

            <div className="img_update">
                    {   

                        done.imgsUpload ? <h4> Pic updated successfully </h4> : null
                    }

                    {
                        done.imgDelete? <h4> Pic deleted successfully</h4> : null
                    }
            </div>

                <div className="image_area">
                    {
                        item.images === undefined ?
                        <Default color = "rgb(230, 43, 83)" size = {100} />
                        :
                        item.images.map((img,index) => {
                            return(
                                <div key = {index}>
                                <div className="pp">
                                <img  src={`${process.env.REACT_APP_HEROKU_URL}${img.image}`} alt="img" srcSet="" height = '300px' width = '300px'/>
                                </div>

                                <form onSubmit={(e) => { e.preventDefault();  deleteFunc(e,img.id,img.roomie)}} className = "contact_form" action="#">
                                    {/* {
                                        done.isDelLoading? <Default color = "rgb(230, 43, 83)" size = {70} /> : null
                                    } */}
                                    <input type="text" hidden/> 
                                
                                {
                                    done.isDelLoading ? 
                                    <button className = "contact_button" disabled> <DeleteIcon /> </button>
                                    :
                                    <button className = "contact_button" > <DeleteIcon /> </button>
                                }

                                </form>
                                {/* <button className = 'btn btn-primary' data-id = {img.id} data-item = {img.item}  onClick ={deleteFunc} >delete</button> */}
                                </div>
                            )
                        })
                    }

                    <form onSubmit={(e)=>{e.preventDefault(); addFunc(e,item.id)}} className = "contact_form" action="#">
                        {
                            done.isAddLoading? <Default color = "rgb(230, 43, 83)" size = {70} /> : null
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
                        {
                                done.isAddLoading || imgs.length === 0 ? 
                                <button className = "contact_button mt-3" disabled >Add</button>
                                :
                                <button className = "contact_button mt-3"  >Add</button>
                        }
                    </form>
                </div>

            <br/>
            <br/> <br/> <br/> <br/> <br/> <br/>

        </div>
        }        
        </>
    }
    </>
    )
}

export default RDetailsEdit;