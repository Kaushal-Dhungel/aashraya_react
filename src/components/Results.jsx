import React from 'react';
import {Link} from "react-router-dom";
import HomeIcon from '@material-ui/icons/Home';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { addCart } from './utils';


const Results = ({items,linkSlug,btnText}) => {

    const GetResults = () => {
        let list = [];
        let result = [];
        
        items === undefined ? 
        <h2> Loading </h2>
        :
        items.map(item => {
            return list.push(
                <div className="card" >
                    
                    {
                        item.images.length === 0 ?
                            <img className="card-img-top" 
                            src={`https://images.unsplash.com/photo-1606474165573-2fa973b42c21?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80`} 
                            alt = "" />
                        :
                            <img className="card-img-top" src={`${item.images[0].image}`} alt = "" height = "300px"  />
                    }

                    <div className="card-body">
                        <span className="card_location">
                            <LocationOnIcon />
                        <p>{item.location.split(",")[0]}</p> 
                        </span>

                        <span className="card_location">
                            <HomeIcon />
                            <p>{item.category}</p>
                        </span>

                        <span className="card_location">
                            <AttachMoneyIcon />
                            <p>{item.price? item.price : item.price_range}</p>
                        </span>
                        <h4 className="card-title"> {item.headline} </h4>

                        <div className="card_buttons"
                        style = {{
                            display :"flex",
                            gap : "1rem"
                        }}
                        >
                            <Link to= {`/${linkSlug}/${item.slug}`} className="btn btn-primary">See Details</Link>
                            <button onClick = {addCart} className="btn btn-secondary"
                            data-set={linkSlug === "items/details"? "items" : "roomie"}
                            data-id = {`${item.id}`}
                            data-action = "add"
                            >{btnText} Cart</button>
                        </div>
                    </div>
            </div>
            );
        });

        // to make a row of max 3 cards
        for ( let i = 0 ; i < list.length ; i+=3)
        {
            result.push(
                <div key = {i} className = "custom_row">
                        {list[i]}

                        {list[i+1] ? list[i+1] : null}
                        {list[i+2] ? list[i+2] : null}
                </div>
            )
        }
        
        return result.length === 0 ? 
            <div className="not_available" style = {{minHeight: "60vh"}}>
                <h2 style = {{marginTop: "10vh",textAlign : "center"}}> No items posted</h2>
            </div> 
        :
        result
        
    }


    return (
        <>
            {
                GetResults()
            }
        </>
    )
    
}

export default Results;