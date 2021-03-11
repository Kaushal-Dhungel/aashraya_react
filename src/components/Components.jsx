import React from 'react';
import {Link} from "react-router-dom";

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