import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import {Link} from "react-router-dom";
import homeImg from '../imgs/home2.png';
import homeImgTwo from '../imgs/home1.png';
import roomieImg from '../imgs/roomie2.png';

export function Footer(){
    return (
        <div className="footer">
                <p>Aashraya Ⓒ 2020. All Rights Reserved. </p>
        </div>
    )
}

const Home = ()=> {
    const [searchValue,setSearchValue] = useState('');
    const history = useHistory()

    const handleChange = (e)=> {
        setSearchValue(e.target.value);
    }

    const mySubmitHandler = (e)=> {
        e.preventDefault();
        // alert(searchValue);
        // console.log(searchValue);
        // setSearchValue('');
        history.push(`/items/${searchValue}`)
        
    }

    return (
        <>

        <div className="landing">
            <div className="text_part">
                <h3> Find great places and people to live with. </h3>
                <div className="search">
                    <input 
                    className = "form_input"
                    type="search"
                    value = {searchValue}
                    onChange={handleChange}
                    placeholder = "Search your city"
                    required
                    />
                    <button onClick = {mySubmitHandler}>
                        search
                    </button>
                {/* <form onSubmit={mySubmitHandler}>
                    <input
                        type='search'
                        value = {searchValue}
                        onChange={handleChange}
                        placeholder = "Search your location"
                        required
                    />
                    <input
                        type='submit'
                        value = 'search'
                    />
                </form> */}
                </div>
            </div>

            <div className="logo_part">
                <img src={homeImg} alt="" height= "400px" width = "400px"/>
            </div>
        </div>

        <div className="container create_listing_room">
                <div className="img_part">
                    <img src={homeImgTwo} alt="" height= "300px" width = "300px"/>
                </div>

                <div className="listing_part">
                    <h4> List Your Room So Others Can Rent It </h4>
                    <Link to = '/additem' className="btn btn-primary">Add new Item</Link>

                </div>
        </div>

        <div className="container create_listing_room">
                
                <div className="listing_part">
                    <h4> Make Yourself Available As A Roomie </h4>
                    <Link to = '/addroomie' className="btn btn-primary">List yourself</Link>
                </div>

                <div className="img_part">
                    <img src={roomieImg} alt="" height= "300px" width = "300px"/>
                </div>
        </div>

        <div className="testimonial_section">
            <h4 className = "testi_heading"> What Users Are Saying </h4>

            <div className="testi">

                <div className="testi_box">
                    <span className="top">
                        <img src={roomieImg} alt=""/>
                        <h4> Mark Zuckerberg </h4>
                        <p> New York </p>
                    </span>
                    <span className="bottom">
                        <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                            Laborum, ut sed incidunt recusandae repellendus autem dolor impedit iusto molestias amet 
                            quaerat molestiae? Ut adipisci eveniet placeat, 
                            laboriosam animi voluptate corporis.
                        </p>
                    </span>
                </div>

                <div className="testi_box">
                    <span className="top">
                        <img src={roomieImg} alt=""/>
                        <h4> Mark Zuckerberg </h4>
                        <p> New York </p>
                    </span>
                    <span className="bottom">
                        <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                            Laborum, ut sed incidunt recusandae repellendus autem dolor impedit iusto molestias amet 
                            quaerat molestiae? Ut adipisci eveniet placeat, 
                            laboriosam animi voluptate corporis.
                        </p>
                    </span>
                </div>

                <div className="testi_box">
                    <span className="top">
                        <img src={roomieImg} alt=""/>
                        <h4> Mark Zuckerberg </h4>
                        <p> New York </p>
                    </span>
                    <span className="bottom">
                        <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                            Laborum, ut sed incidunt recusandae repellendus autem dolor impedit iusto molestias amet 
                            quaerat molestiae? Ut adipisci eveniet placeat, 
                            laboriosam animi voluptate corporis.
                        </p>
                    </span>
                </div>

            </div>
        </div>

        </>
    )
}

export default Home;

