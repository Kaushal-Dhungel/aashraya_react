import React , { useState,useEffect  }from "react";
import {Link} from "react-router-dom";
// import {Results} from './Navbar';
import axios from 'axios';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import HomeIcon from '@material-ui/icons/Home';
import HouseIcon from '@material-ui/icons/House';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { Default } from "react-spinners-css";
import {addCart} from './Auth';
import swal from 'sweetalert';
import { connect } from "react-redux";


const CartItems = ({items,linkSlug}) => {
  let list = [];
  let result = [];
  
  items === undefined ? 
  <h2> Loading </h2>
  :
    items.map(arrItem => {
        return list.push(
            <div className="card" >
                {
                    arrItem.item.images.length === 0 ?
                <img className="card-img-top" src={`https://images.unsplash.com/photo-1606474165573-2fa973b42c21?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80`} alt = "" />
                    :
                <img className="card-img-top" src={`${arrItem.item.images[0].image}`} alt = "" height = "300px"  />
                }
                <div className="card-body">
                    <span className="card_location">
                        <LocationOnIcon />
                    <p>{arrItem.item.location.split(",")[0]}</p> 
                    </span>

                    <span className="card_location">
                        <HomeIcon />
                        <p>{arrItem.item.category}</p>
                    </span>

                    <span className="card_location">
                        <AttachMoneyIcon />
                        <p>{arrItem.item.price? arrItem.item.price : arrItem.item.price_range}</p>
                    </span>
                    <h4 className="card-title"> {arrItem.item.headline} </h4>

                    <div className="card_buttons"
                    style = {{
                        display :"flex",
                        gap : "1rem"
                    }}
                    >
                        <Link to= {`/${linkSlug}/${arrItem.item.slug}`} className="btn btn-primary">See Details</Link>
                        <button className="btn btn-secondary"
                          data-set={linkSlug === "items/details"? "items" : "roomie"}
                          data-id = {`${arrItem.item.id}`}
                          data-action = "delete"
                          onClick = {
                            e => {
                              swal({
                                title: "Are you sure?",
                                text: "Are you sure that you want to delete this?",
                                icon: "warning",
                                dangerMode: true,
                              })
                              .then(yesDelete => {
                                if (yesDelete) {
                                  addCart(e)
                                }
                              })
                            }
                          }
                        > Remove </button>
                    </div>


                </div>
        </div>
        );
      });
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
      <div className="not_available" style = {{minHeight: "60vh",width:"100%"}}>
          <h2 style = {{margin: "10vh",textAlign : "center"}}> The Cart is empty.</h2>
      </div> :
      result

}


const CartView = ({isAuthenticated}) => {
  const[items,setItems] = useState([]);
  const [roomiePost, setRoomiePost] = useState();
  const [condn, setCondn] = useState(false);
  const [fetching, setFetching] = useState(true);


  useEffect( () => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
        try {
            const res = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/items/cartview`,config);
            setItems(res.data);
              setFetching(false)
        } 
        catch (error) {
                setFetching(false)
            console.log(error)
        }
    }

    fetchData();
},[]);

const fetchRoomie = async () => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios.get(
      `${process.env.REACT_APP_HEROKU_URL}/mates/roomiecart`,
      config
    );
    setRoomiePost(res.data);
    // setItem(res.data);
  } catch (error) {
    console.log(error)
  }
};

const showPosts = (e) => {
  const abc = e.target.dataset.action;
  if (abc === "items") {
    setCondn(false);
  } else {
    fetchRoomie();
    setCondn(true);
  }
};
    return (
      !isAuthenticated ? 
      <div className="container info" style = {{
        minHeight: "80vh"
      }}>
        <h3> Please do register before using this feature. Click below to register. </h3> 
        <Link className="btn btn-outline-secondary" to={'/register'}>Register</Link>
      </div>
      :
        <>
          <div className="container">
            <h4 className = "testi_heading"> Cart Items </h4>
            <div className="row">
              {/* <div className="container info">
                  <h3> Your Cart is empty. Click below to go to the shop. </h3> 
                  <Link className="btn btn-outline-success" to={'/shop'}>Shop</Link>
              </div> */}
                
                <div className="col-lg-12 mt-5">
                  <div className="box-element">
                    {/* <Link  className="btn btn-outline-dark" to="/shop">&#x2190; Continue Shopping</Link> */}
                    
                    <div className="categories_profile col-12">
                      <div className="btn-group btn-group-toggle" data-toggle="buttons">

                        <label className="btn btn-outline-dark active">
                          <input type="radio" name="options" id="room" checked
                            data-action="items" onClick={showPosts} readOnly
                          /> Items <HouseIcon />
                        </label>
                        
                        <label className="btn btn-outline-dark">
                          <input type="radio" name="options" id="flat"
                            data-action="roomie" onClick={showPosts} readOnly
                          /> Roomie <PeopleAltIcon />
                        </label>
                        
                      </div>     
                  </div>

              </div>

              </div>

              {
                  fetching ? 
                        <div className="loading_wrapper" style = {{
                          margin:"0 35%"
                        }}>
                        
                          <div className="loading_loading">
                            <Default color="#343a40" size={150}/>
                          </div>

                        </div>

                  : 
                    <div style = {{width:"100%"}} className = "box-element mt-5">
                        {
                          condn ? 
                          <CartItems items={roomiePost} 
                          linkSlug={`rdetails`} 
                          />
                          : 
                          <CartItems items={items} 
                          linkSlug={`items/details`} 
                          />
                        }
                    </div>
              }

          </div>
        </div>
      </>
    )
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !== null,
  };
};

export default connect(mapStateToProps, null)(CartView) 