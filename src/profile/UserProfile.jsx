import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Results from '../components/Results';

import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import InstagramIcon from "@material-ui/icons/Instagram";
import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";

import { Default } from "react-spinners-css";

import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import swal from 'sweetalert';

import { useHistory } from "react-router-dom";
import * as actions from '../store/actions/auth';

import HouseIcon from '@material-ui/icons/House';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

const UserProfilee = ({ isAuthenticated, onAuthLogout }) => {
  const [item, setItem] = useState({});
  const [roomiePost, setRoomiePost] = useState();
  const [condn, setCondn] = useState(false);
  const [fetching, setFetching] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      try {
          const res = await axios.get(
            `${process.env.REACT_APP_HEROKU_URL}/profile/`,
            config
          );
          setItem(res.data);
          setFetching(false);
        } 
        catch (error) {
          setFetching(false);
      }
    };

    fetchData();
  }, []);

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
        `${process.env.REACT_APP_HEROKU_URL}/mates/`,
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

  const logoutFunc = () => {
    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to log out?",
      icon: "warning",
      dangerMode: true,
    })
    .then(willLogOut => {
      if (willLogOut) {
        swal("Logged Out!", "You have been logged out!", "success")
        .then(okay => {
          onAuthLogout();
          history.push('/');
        })
      }
    })
}

  return (
    <>
      {
        isAuthenticated !== true?
        <Redirect to = "/"/>
        :
        <>
          {
            fetching ? 
              <div className="loading_loading">
                <Default color="#343a40" size={150} />
              </div>
            : 
            <>
              { item === undefined ?
                <h2> Loading </h2>
                :
                <>
                  {item.phone ? null :

                    <div className="container" style = {{marginTop : "10vh"}}>
                      <div className="roomie_link_wrapper">
                          <div className="box-element">
                              <h5> PLease update your profile to provide some required informations .</h5>
                              <Link to = {`/profile/edit`} className = "btn btn-primary" > Update Profile </Link>
                          </div>
                      </div>
                    </div>

                  }
                  <div className="container ">
                    <div className="row py-5 px-4">
                      <div className="col-md-12 mx-auto">
                        <div className="bg-white shadow rounded overflow-hidden">
                          <div className="px-4 pt-0 pb-4 cover">
                            <div className="media profile-head">
                              <div className="profile">
                                <img
                                  src={`${item.avatar}`}
                                  alt="..."

                                  className="rounded mb-2 img-thumbnail"
                                />
                                <div className="btnssss" style = {{display:"flex",gap:"1rem"}}>
                                  <Link
                                    to="/profile/edit"
                                    className="btn btn-outline-dark "
                                  > Edit profile</Link>

                                  <button className="btn btn-outline-dark " onClick = {logoutFunc}> Logout </button>

                                </div>
                              </div>

                              <div className="media-body text-white">
                                <h4 className="mt-0 mb-0">
                                  {item.first_name && item.last_name
                                    ? `${item.first_name} ${item.last_name}`
                                    : item.get_username}
                                </h4>

                                <p className="small">
                                  <i className="fas fa-map-marker-alt mr-2"></i> @
                                  {item.get_username}
                                </p>

                              </div>
                            </div>
                          </div>

                          {/* do not remove this div */}
                          <div className="bg-light p-4 d-flex justify-content-end text-center"></div>

                          <div className="px-4 my-5">
                            <h5 className="mb-0">Contact</h5>

                            <div className="py-4 rounded shadow-sm bg-light">
                              <span className="contact_info">
                                <PhoneIcon
                                  fontSize="large"
                                  style={{ color: "#d8223b" }}
                                />
                                <p >
                                  - {item.phone ? item.phone : `not provided`}
                                </p>
                              </span>

                              <span className="contact_info">
                                <EmailIcon
                                  fontSize="large"
                                  style={{ color: "#d8223b" }}
                                />
                                <p className = "profile_email"> - {item.email} </p>
                              </span>

                              <span className="contact_info_social">
                                <a href={ item.facebook_link ? item.facebook_link : `#`}>
                                  <FacebookIcon
                                    fontSize="large"
                                    style={{ color: "#d8223b" }}
                                  />
                                </a>

                                <a href={item.twitter_link ? item.twitter_link : `#`}>
                                  <TwitterIcon
                                    fontSize="large"
                                    style={{ color: "#d8223b" }}
                                  />
                                </a>

                                <a href={item.instagram_link ? item.instagram_link : "#"}>
                                  <InstagramIcon
                                    fontSize="large"
                                    style={{ color: "#d8223b" }}
                                  />
                                </a>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" container box-element">
                    <div className="categories_profile">
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

                      {
                        condn ? 
                        <Results items={roomiePost} linkSlug={`rdetails`} 
                        btnText = "Add To"
                        />
                        : 
                        <Results items={item.item_model} linkSlug={`items/details`} 
                        btnText = "Add To"
                        />
                      }
                  </div>
                </>
              }
            </>
          }
        </>
      }
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !== null,
  };
};

const mapDispatchToProps =(dispatch) => {
  return {
      onAuthLogout: () => dispatch(actions.logout()),
      
  }
}

const UserProfile = connect(mapStateToProps, mapDispatchToProps)(UserProfilee);

export default UserProfile;
