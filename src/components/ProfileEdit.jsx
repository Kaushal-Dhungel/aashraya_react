import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import { Facebook, Default } from "react-spinners-css";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from '../store/actions/auth';

import swal from 'sweetalert';


const ProfileEdit = ( {isAuthenticated, onAuthLogout}) => {
  const [item, setItem] = useState({});
  const [imgs, setImgs] = useState([]);
  const [update, setUpdate] = useState(false);

  const [formloading, isFormloading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [done, setDone] = useState({
    imgsUpload: false,
    imgDelete: false,
    isAddLoading: false,
    isDelLoading: false,
  });

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
      } catch (error) {
        setFetching(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    isFormloading(true);
    const form = new FormData(e.target);

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .patch(`${process.env.REACT_APP_HEROKU_URL}/profile/`, form, config)

      .then((res) => {
        isFormloading(false);
        history.push("/profile");
      })
      .catch((err) => {
        isFormloading(false);
      });
  };

  const changeFn = (e) => {
    const { name, value } = e.target;

    setItem((intialState) => {
      return {
        ...intialState,
        [name]: value,
      };
    });
  };

  const deleteFunc = (e, action) => {
    setDone(() => {
      return {
        imgsUpload: false,
        imgDelete: false,
        isAddLoading: action === "change_pic",
        isDelLoading: action === "remove_pic",
      };
    });
    const form = new FormData(e.target);
    form.append("action", action);

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(`${process.env.REACT_APP_HEROKU_URL}/profile/`, form, config)

      .then((res) => {
        setItem(res.data);
        e.target.reset();
        setImgs([]);
        setUpdate(true);

        setDone(() => {
          return {
            imgsUpload: action === "change_pic",
            imgDelete: action === "remove_pic",
            isAddLoading: false,
            isDelLoading: false,
          };
        });
      })
      .catch((err) => {
        setDone(() => {
          return {
            imgsUpload: false,
            imgDelete: false,
            isAddLoading: false,
            isDelLoading: false,
          };
        });
      });
  };

  const imgChange = (e) => {
    console.log(e.target.files);

    setImgs([]); // this clears the previously selected imgs

    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      // console.log(fileArray);
      setImgs((prevImgs) => prevImgs.concat(fileArray));

      Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
    }
  };

  const renderImgs = (source) => {
    return source.map((photo) => {
      // console.log(photo);
      return <img src={photo} key={photo} alt="" />;
    });
  };

  const deleteProfile = () => {
    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete your profile?",
      icon: "warning",
      dangerMode: true,
    })

    .then(willDelete => {
      if (willDelete) {

          const token = localStorage.getItem('token');
  
          const config = {
              headers: {
                  "Content-Type" : "application/json",
                  Authorization : `Bearer ${token}`
          }
          }
      
          axios.delete(`${process.env.REACT_APP_HEROKU_URL}/profile/`,config)
          
          .then(res => {
              swal("Deleted!", "Your profile has been deleted", "success")

              .then(okay => {
                onAuthLogout();
                history.push('/');
              })
          })

          .catch (err => {
              swal("Sorry!", "Your profile can not be deleted right now. PLease try later.", "warning")

          })
      }
    })

}

  return (
    <>
      {
        isAuthenticated !== true ? 
        <Redirect to = "/" />
        :
        <>
          {
            fetching ? 
            <div className="loading_loading">
              <Default color="#343a40" size={200} />
            </div>
            : 
            <>
              {
                item === undefined ? 
                  <div className="loading_loading">
                    <Facebook color="#343a40" size={200} />
                  </div>
                : 
                <>
                  { item.phone ? null : 

                    <div className="container" style = {{marginTop : "10vh"}}>
                      <div className="box-element">
                          <div className="roomie_link_inside">
                              <h5> PLease update your phone so that it'd be easier for the potential client to contact you .</h5>
                          </div>
                      </div>
                    </div>
                  }


                  <div className="container mt-5 box-element">
                    {formloading ? 
                      <div className="loading_loading">
                        <Default color="#343a40" size={200} />
                      </div>
                    :
                      <>
                        <h4 className = "testi_heading"> Edit Your Profile </h4>

                        <form
                          onSubmit={handleSubmit}
                          className="contact_form"
                          action="#"
                        >
                          <input name="first_name" className="form_input" type="text"
                            value={item.first_name} onChange={changeFn} placeholder="First Name"autoComplete="off"/>

                          <input name="last_name" className="form_input" type="text"
                          value={item.last_name} onChange={changeFn} placeholder="Last Name" autoComplete="off"/>

                          <input name="email" className="form_input"type="text"
                            value={item.get_email} onChange={changeFn} placeholder="email" autoComplete="off"/>

                          <input name="phone" className="form_input" type="number"
                            value={item.phone} onChange={changeFn} placeholder="phone" autoComplete="off"/>

                          <input name="facebook_link" className="form_input" type="text"
                            value={item.facebook_link} onChange={changeFn} placeholder="Faccebook Link" autoComplete="off"/>

                          <input name="twitter_link" className="form_input" type="text"
                            value={item.twitter_link} onChange={changeFn} placeholder="Twitter Link" autoComplete="off"/>

                          <input name="instagram_link" className="form_input" type="text"
                            value={item.instagram_link} onChange={changeFn} placeholder="Instagram Link" autoComplete="off"/>

                          <button className="btn btn-danger">Update</button>
                        </form>
                      </>
                    }
                    <div className="profile_img">
                      {update ? <h3 style = {{textAlign:"center", margin:"3vh"}}> Profile pic updated </h3> : null}
                      <div className="pp">
                        {
                          item.avatar === undefined ? 
                            <Default color="#343a40" size={100} />
                          :
                            <img
                              src={`${item.avatar}`}
                              alt="avatar"
                              srcSet=""
                              height="200px"
                              width="200px"
                            />
                        }
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          deleteFunc(e, "remove_pic");
                        }}
                        className="contact_form"
                        action="#"
                      >
                        {
                        done.isDelLoading ? 
                          <Default color="#343a40" size={70} />
                        : null
                        }

                        <input type="text" hidden />
                          {
                            done.isDelLoading ?
                              <button className="btn btn-danger" disabled>
                                
                                <DeleteIcon />
                              </button>
                            : 
                              <button className="btn btn-danger">
                                
                                <DeleteIcon />
                              </button>
                          }
                      </form>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          deleteFunc(e, "change_pic");
                        }}
                        className="contact_form"
                        action="#"
                      >
                        {
                          done.isAddLoading ?
                          <Default color="#343a40" size={70} />
                          : null
                        }
                        <input
                          name="avatar"
                          type="file"
                          className="form_input"
                          onChange={imgChange}
                        />
                        <div className="pics">{renderImgs(imgs)}</div>

                        <button className="btn btn-danger mt-3" 
                          disabled = {done.isAddLoading || imgs.length === 0 ? true : false}
                        > Change Pic </button>

                      </form>
                    </div>

                      <center>
                          <div className="delete_button" style = {{margin :"7vh 0"}}>
                              <button className = "btn btn-danger" onClick = {deleteProfile}> Delete Your Profile</button>
                          </div>
                      </center>

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

export default connect(mapStateToProps, mapDispatchToProps) (ProfileEdit);
