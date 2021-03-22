import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import {Link} from "react-router-dom";
import homeImg from '../imgs/home2.png';
import homeImgTwo from '../imgs/home1.png';
import roomieImg from '../imgs/roomie2.png';
import {hideModal} from '../store/actions/auth';
import { connect } from "react-redux";
import axios from 'axios'
import SearchIcon from '@material-ui/icons/Search';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

import { Grid } from "react-spinners-css";

import { Belowlanding, Services } from './Components';

import { Slide, Bounce, JackInTheBox,Zoom} from "react-awesome-reveal";


const Home = ({showModal,hidemodal})=> {
    const [searchValue,setSearchValue] = useState('');
    const [popular,setPopular] = useState([]);
    const [testi,setTesti] = useState([]);
    const [suggestions,setSuggestions] = useState([]);
    const [fetching,setFetching] = useState({
        popular:true,
        testi : true,
    })
    const history = useHistory()
    // const[modalIsOpen,setModalIsOpen] = useState(true);

    useEffect( () => {
        const fetchPopular = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/core/popular/`);
                setPopular(res.data);
                setFetching((prevVal)=> {
                    return {
                        ...prevVal,
                        popular:false
                    }
                })
            } 
            catch (error) {
                console.log(error)
            }
        }

        const fetchTesti = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/core/testimonial/`);
                setTesti(res.data);
                setFetching((prevVal)=> {
                    return {
                        ...prevVal,
                        testi:false
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchPopular();
        fetchTesti();
    },[])

    const searchPlaces = (value) => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/`;
        const token = `${process.env.REACT_APP_MAPBOX_TOKEN}`;

        const fullUrl = url + value + '.json?access_token=' + token;

        axios.get(fullUrl)
        .then((res) => {
            setSuggestions(res.data.features)
        })
        .catch((err)=> {
            console.log(err)
        })
    }
    const handleChange = (e)=> {
        searchPlaces(e.target.value)

        setSearchValue(e.target.value);
    }

    const mySubmitHandler = (e)=> {
        e.preventDefault();
        let firstStr = ""
        let finalStr = ""
        searchValue.split(",").map(item => firstStr += item.trim())
        firstStr.split(" ").map(item => finalStr += item.trim())
        history.push(`/items/${finalStr}`)
        
    }

    return (
        fetching.popular & fetching.testi ?
            <div className="loading_loading">
                <JackInTheBox duration = "2500">
                    <Grid color="#343a40" size={200} />
                </JackInTheBox>
        </div>
      :
        <>
            <div className="landing bg-dark">
                <Zoom>
                    <div className="text_part">
                        <h2> Find great places and people to live with. </h2>
                        <div className="search">
                            <input 
                            className = "formStyle bg-dark"
                            type="search"
                            value = {searchValue}
                            onChange={handleChange}
                            list="cityname"
                            placeholder = "Search your city. Example:- Haldibari "
                            required
                            />
                            <datalist id="cityname">
                                {
                                    suggestions.map((item,index) => {
                                        return(
                                            <option key = {index} value={item.place_name} />
                                        )
                                    })
                                }
                            </datalist>
                            <button className = "btn btn-danger mt-4 ml-3" 
                                disabled = {searchValue === ''}
                                onClick = {mySubmitHandler}>
                                search <SearchIcon />
                            </button>

                        </div>

                    </div>
                </Zoom>

                <Slide direction= "down">
                    <div className="logo_part">
                        <img src={homeImg} alt="" height= "400px" width = "400px"/>
                    </div>
                </Slide>
            </div>
            

            <Services />


            <div style = {{marginTop:"35vh"}}>
                <Bounce>
                    <h4 className = "testi_heading"> How It Works ?? </h4>
                </Bounce>
            </div>

            <div className="container create_listing_room">
                    <Slide>
                        <div className="img_part">
                            <img src={homeImgTwo} alt="" height= "300px" width = "300px"/>
                        </div>
                    </Slide>

                    <Slide direction = "right">
                        <div className="listing_part">
                                <h4> List Your Properties So Others Can Rent/Buy It </h4>
                                <p> Have a property like room, flat, home, land that you want to sell/buy?? </p>
                                <Link to = '/additem' className="btn btn-secondary">Add new Item <ArrowRightAltIcon fontSize = "large"/> </Link>
                        </div>
                    </Slide>
            </div>

            <div className="container create_listing_room">
                    <Slide direction = "up" >
                        <div className="listing_part">
                            <h4> Make Yourself Available As A Roommate </h4>
                            <p> Are you looking for a roommate to live together?? Well, You are only one step away. </p>
                            <Link to = '/addroomie' className="btn btn-secondary">List yourself <ArrowRightAltIcon fontSize = "large"/> </Link>
                        </div>
                    </Slide >

                    <Zoom>
                        <div className="img_part">
                            <img src={roomieImg} alt="" height= "300px" width = "300px"/>
                        </div>
                    </Zoom>
                    
            </div>

            <div className="popular_places" style = {{marginTop:"40vh"}}>
                <Bounce>
                    <h4 className = "testi_heading"> Popular Places </h4>
                </Bounce>
                    <Belowlanding popular = {popular} />
            </div>

            <div className="testimonial_section">
                <Bounce>
                    <h4 className = "testi_heading"> What Users Are Saying </h4>
                </Bounce>

                <div className="testi">
                    {
                        testi.map((item,index)=> {
                            return (
                                <div className="testi_box" key = {index}>
                                    <span className="top">
                                        <img src={`${item.pic}`} alt=""/>
                                        <h4> {item.name} </h4>
                                        <p> {item.position} </p>
                                    </span>
                                    <span className="bottom">
                                        <p>{item.words}</p>
                                    </span>
                                </div>
                            )
                        })
                    }

                </div>
            </div>

        </>
    )
}

const mapStateToProps = (state) => {
    return {
      showModal : state.showModal
    };
  };

const mapDispatchToProps = (dispatch) => {
    return {
      hidemodal: () => dispatch(hideModal()),
    };
  };

export default connect(mapStateToProps,mapDispatchToProps) (Home);

