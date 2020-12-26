import React, { useState } from 'react';
import axios from 'axios';
import { addItemFunc} from './Auth';
// import { useHistory } from "react-router-dom";
import {Link} from "react-router-dom";
import { connect } from 'react-redux';
import { Facebook } from 'react-spinners-css';


export const Updateitem =({actionFunc,url}) => {

    const [imgs,setImgs] = useState([]);
    // const history = useHistory();
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

        const token = localStorage.getItem('token');

        const config = {
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
        }
        }
        
    
        axios.post(url, form,config)
    
        .then(res => {
            // console.log('Added')
            // console.log(res)
            // console.log(res.data.slug);
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

            // history.push(res.data.slug)
            
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
            // console.log("sorry no addition")
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

    // const removeImg = (e) => {
    //     console.log(e.target.dataset.value)
    //     const removeItem = e.target.dataset.value;
    //     setImgs((prevImgs) => prevImgs.filter(elem => elem !== removeItem))
    // }

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
           done.isLoading?  
           <div className="loading_loading">
           <Facebook color = "rgb(230, 43, 83)" size = {200} />
            </div>:
        <>
        {
            done.isSuccess ? 
            <div className="container" >
                <h3> Addition successful </h3>
                <Link className = "btn btn-primary" to = {`/items/details/${done.slug}`} >See the post</Link>
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

        <div className="container">
            <form onSubmit={handleSubmit} className = "contact_form" action="#">
                <select name="category" className = "form_input">
                    <option value="room">Room</option>
                    <option value="flat">Flat</option>
                    <option value="house">House</option>
                    <option value="hostel">Hostel</option>
                    <option value="land">Land</option>
                </select>
                <input name = 'headline' className = "form_input" type="text" placeholder="Headline" autoComplete = 'off' />
                <input name = 'location' className = "form_input" type="text" placeholder="District" autoComplete = 'off' />
                <input name = 'city' className = "form_input" type="text" placeholder="City" autoComplete = 'off'/>
                <input name = 'price' className = "form_input" type="number" placeholder="Price" autoComplete = 'off'/>
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

// export default AddItem;