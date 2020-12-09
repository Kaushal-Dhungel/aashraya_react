import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete';
import { Facebook,Default } from 'react-spinners-css';

const ProfileEdit =() => {


    const [item,setItem] = useState({});
    const [imgs,setImgs] = useState([]);
    const[update,setUpdate] = useState(false);

    const[formloading,isFormloading] = useState(false);
    const[fetching,setFetching] = useState(true)
    const [done,setDone] = useState({
        imgsUpload : false,
        imgDelete : false,    
        isAddLoading : false,
        isDelLoading : false,
    })

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
                const res = await axios.get(`https://aashraya.herokuapp.com/profile/`,config);
                // console.log(res.data)
                setItem(res.data);
                setFetching(false);
  
            } catch (error) {
                setFetching(false);
                // console.log(error)
            }
        }
  
        fetchData();
    },[])

    const handleSubmit = (e) => {
        e.preventDefault();

        isFormloading(true);
        const form = new FormData(e.target);

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
        }
        }
        

        axios.patch('https://aashraya.herokuapp.com/profile/', form,config)

        .then(res => {
            // console.log('Updated')
            // console.log(res)
            isFormloading(false)
            history.push('/profile')
    
        })
        .catch(err => {
            isFormloading(false)
            // console.log("sorry no addition")
            // console.log(err)
        })

    }


    const changeFn = (e) => {
        const {name, value} = e.target

        setItem( (intialState) => {
            return {
                ...intialState,
                [name] : value
            }

        })
    }

    const deleteFunc = (e,action) => {

        setDone(()=> {
            return {
                imgsUpload : false,
                imgDelete : false,    
                isAddLoading : action === 'change_pic',
                isDelLoading: action === 'remove_pic',
            }
        })
        const form = new FormData(e.target);
        form.append('action',action)

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
        }
        }
    
            axios.post(`https://aashraya.herokuapp.com/profile/`,form,config)

            .then(res => {
                // console.log('deleted')
                // console.log(res.data)
                setItem(res.data)
                e.target.reset();
                setImgs([]);
                setUpdate(true);

                setDone(()=> {
                    return {
                        imgsUpload : action === 'change_pic',
                        imgDelete : action === 'remove_pic',    
                        isAddLoading : false,
                        isDelLoading: false,
                    }
                })
                // history.push(`/items/details/${res.data.slug}`)
    
        
            })
            .catch(err => {
                // console.log("sorry no delete")
                // console.log(err)
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
       <>
            {
                item.phone? null: 
                <h4 style = {
                    {
                        margin : '4vh 0',
                        textAlign :'center',
                        color:'#e96443',
                    }  
                }> || Please update your phone so that it'd be easier for your potential client to contact you || </h4>
            }


        <div className="container">
            {
            formloading? 
               <div className="loading_loading">
                   <Default color = "rgb(230, 43, 83)" size = {200} />
               </div>
               :
            <>
            <form onSubmit={handleSubmit} className = "contact_form" action="#">
                <input name = 'first_name' className = "form_input" type="text" value = {item.first_name} onChange ={changeFn} placeholder="First Name" autoComplete = 'off' />
                <input name = 'last_name' className = "form_input" type="text" value = {item.last_name} onChange ={changeFn} placeholder="Last Name" autoComplete = 'off' />
                <input name = 'email' className = "form_input" type="text" value = {item.get_email} onChange ={changeFn} placeholder="email" autoComplete = 'off'/>
                <input name = 'phone' className = "form_input" type="number" value = {item.phone} onChange ={changeFn} placeholder="phone" autoComplete = 'off'/>
                {/* <label htmlFor="avatar">Your Avatar</label>
                <input name="avatar" type="file" className = "form_input"   /> */}
                <input name = 'facebook_link' className = "form_input" type="text" value = {item.facebook_link} onChange ={changeFn} placeholder="Faccebook Link" autoComplete = 'off'/>
                <input name = 'twitter_link' className = "form_input" type="text" value = {item.twitter_link} onChange ={changeFn} placeholder="Twitter Link" autoComplete = 'off'/>
                <input name = 'instagram_link' className = "form_input" type="text" value = {item.instagram_link} onChange ={changeFn} placeholder="Instagram Link" autoComplete = 'off'/>

                <button className = "contact_button">Update</button>
            </form>
            </>
            }

        <div className="profile_img">

                {
                    update ? <h3> Profile pic updated </h3>: null
                }
            <div className="pp">
                {
                        item.avatar === undefined?
                        <Default color = "rgb(230, 43, 83)" size = {100} />
                        :
                        <img src={`https://aashraya.herokuapp.com${item.avatar}`} alt="avatar" srcSet="" height = '200px' width = '200px' />
                }
            </div>

            <form onSubmit={(e) => { e.preventDefault();  deleteFunc(e,'remove_pic')}} className = "contact_form" action="#">
                {
                    done.isDelLoading? <Default color = "rgb(230, 43, 83)" size = {70} /> : null
                }

                <input type="text" hidden/> 
                {
                    done.isDelLoading ? 
                    <button className = "contact_button" disabled> <DeleteIcon /> </button>
                    :
                    <button className = "contact_button" > <DeleteIcon /> </button>
                }

                
            </form>

            <form onSubmit={(e) => { e.preventDefault();  deleteFunc(e,'change_pic')}} className = "contact_form" action="#">
                {
                    done.isAddLoading? <Default color = "rgb(230, 43, 83)" size = {70} /> : null
                }
                <input name="avatar" type="file" className = "form_input" onChange = {imgChange}/> 
                <div className="pics">
                            {
                                renderImgs(imgs)
                            }
                </div>
                {
                        done.isAddLoading || imgs.length === 0 ? 
                        <button className = "contact_button mt-3" disabled >Change Pic</button>
                        :
                        <button className = "contact_button mt-3"  >Change Pic</button>
                }
            </form>

        </div>

            <br/>
            <br/> <br/> <br/> <br/> <br/> <br/>

        </div>
    </>
    }
    </>
    }
    </>
    )
}

export default ProfileEdit;