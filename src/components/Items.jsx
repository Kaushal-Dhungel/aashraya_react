import React,{useState}  from 'react';
import Navbar from './Navbar';
// import {Rnav} from '../roommates'
import {Link} from 'react-router-dom';

const Item = (props) => {

    const [priceRange, setPriceRange] = useState({
        minPrice :0,
        maxPrice : -1
    })

    const city = props.match.params.id 
    let firstStr = ""
    let finalStr = ""
    city.split(",").map(item => firstStr += item.trim())
    firstStr.split(" ").map(item => finalStr += item.trim())

    const handleSubmit = (e) => {
        e.preventDefault()
        const form = new FormData(e.target);
        let minVal = form.get("min_price");
        let maxVal = form.get("max_price");

        if (minVal === "" || minVal === undefined) 
            minVal = 0

        if (maxVal === "" || maxVal === undefined) 
            maxVal = -1   
            
        setPriceRange((prevVal) => {
            return {
                minPrice : minVal,
                maxPrice : maxVal
            }
        })
    }
    
    return (
        <>
        <div className="container" style = {{marginTop : "10vh"}}>

            <div className="box-element">

                <div className="roomie_link_wrapper">
                    <div className="roomie_link_inside">
                        <h5> This page doesn't display the result of Roommates. Click below to see the roommates.</h5>
                        <Link to = {`/rnav/${finalStr}`} className = "btn btn-primary" > See Roommates </Link>
                    </div>
                </div>


                <div className="price_filter">
                    <form onSubmit={handleSubmit} className="filter_form" action="#">
                        <input name="min_price" type="text" className="form_input"
                            placeholder="Min Price" autoComplete="off"/>

                        <input name="max_price" type="text" className="form_input"
                            placeholder="Max Price" autoComplete="off"/>

                        <button className = "btn btn-primary">Apply</button>
                    </form>
                </div>
            </div>

            <Navbar city = {finalStr}
                minPrice = {priceRange.minPrice}
                maxPrice = {priceRange.maxPrice}
            />
        </div>
        {/* <Rnav /> */}

        </>
    )
}

export default Item;