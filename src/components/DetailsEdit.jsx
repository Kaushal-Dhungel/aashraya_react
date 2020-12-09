import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import {Link} from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete';
import { Facebook,Default } from 'react-spinners-css';


const DetailsEdit = (props) => {
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
                const res = await axios.get(`https://aashraya.herokuapp.com/items/details/${slug}`,config);
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
    
            axios.put(`https://aashraya.herokuapp.com/items/details/${slug}/`,form,config)

            .then(res => {
                // console.log('updated')
                // console.log(res.data)
                isFormloading(false)
                history.push(`/items/details/${res.data.slug}`)
    
        
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
    
            axios.post(`https://aashraya.herokuapp.com/items/details/${slug}/`,form,config)

            .then(res => {
                // console.log('deleted')
                // console.log(res.data)
                setItem(res.data)
                setDone (() => {
                    return {
                        imgsUpload: false,
                        imgDelete : true,
                        isAddLoading: false,
                        isDelLoading: false
                    }
                })
                // history.push(`/items/details/${res.data.slug}`)
    
        
            })
            .catch(err => {
                // console.log("sorry no delete")
                // console.log(err)
                setDone (() => {
                    return {
                        imgsUpload: false,
                        imgDelete : false,
                        isAddLoading: false,
                        isDelLoading : false
                    }
                })
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
        // e.preventDefault();
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
    
            axios.post(`https://aashraya.herokuapp.com/items/details/${slug}/`,form,config)

            .then(res => {
                // console.log('deleted')
                // console.log(res.data)
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
                // history.push(`/items/details/${res.data.slug}`)
    
        
            })
            .catch(err => {
                // console.log("sorry no delete")
                // console.log(err)
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
            // console.log(photo);
            return (
            <img src={photo} key = {photo} alt=""   />
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
                </div>:
            <>
                <Link className = "btn btn-danger" to = {`/items/details/${item.slug}`}>Go back to the post</Link>
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
                    <input name = 'price' className = "form_input" type="number" value = {item.price} onChange = {myFunc} placeholder="Price" autoComplete = 'off'/>
                    <textarea name="details" className = "form_input" cols="30" rows="10" value = {item.details} onChange = {myFunc} placeholder ="Details"></textarea>
                    {/* <label htmlFor="photos">Add Pictures:</label>
                    <input type="file" name="photos" className = "form_input" value = {item.} multiple /> */}
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
                                    <img  src={`https://aashraya.herokuapp.com${img.image}`} alt="img" srcSet="" height = '300px' width = '300px'/>
                                    </div>

                                <form onSubmit={(e) => { e.preventDefault();  deleteFunc(e,img.id,img.item)}} className = "contact_form" action="#">
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

export default DetailsEdit;