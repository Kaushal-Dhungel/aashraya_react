import React from 'react';
import {Link} from "react-router-dom";
import {Bounce, Rotate} from "react-awesome-reveal";

import { servicesData } from './index';

export function Footer(){
    return (
        <div className="footer">
            <p>Aashraya Ⓒ 2021. All Rights Reserved. </p>
        </div>
    )
}

export const Belowlanding = ({popular}) => {
    return (
        <div className = "container mt-5 ">
            <div className="row team-area">
                {
                    popular.map((item,index)=>{
                        return(
                            <div key = {index} className="col-6 col-sm-4 col-md-3 mt-5">
                                <div className="single-team">
                                    <img src={`${item.image}`} alt=""/>
                                    <div className="team-text">
                                        <h2>{item.city.split(",")[0]}</h2>
                                        {/* <p> Look Cool In Summer</p> */}
                                        <Link className="btn btn-outline-secondary small-btn" to={`/items/${item.city_slug}`}>See Items</Link>
                                    </div>
                                </div>
                            </div>
 
                        )
                    })
                }

            </div>
        </div>
    )}


export const Services = () => {
    return (
        <div className="container">
            <Bounce>
                <h4 className = "testi_heading" style = {{marginTop:"40vh"}}> Who are we ?? </h4>
            </Bounce>

            <div className="row">
                    {
                        servicesData.map((item,index) => {
                            return (
                                <div key = {index} className="col-12 col-sm-6 col-md-4 mt-3" >
                                    <div className="services_box">
                                        <span className="top">
                                            <Rotate>
                                                {item.icon}
                                            </Rotate>
                                            <h4> {item.service} </h4>
                                        </span>
                                        <span className="bottom">
                                            <p> {item.data} </p>
                                        </span>
                                    </div>
                                    
                                </div>
                            )
                        })
                    }

            </div>

    </div>
    )
}