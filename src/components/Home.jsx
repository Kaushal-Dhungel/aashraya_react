import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import {Link} from "react-router-dom";
import homeImg from '../imgs/home2.png';
import homeImgTwo from '../imgs/home1.png';
import roomieImg from '../imgs/roomie2.png';
import Modal from 'react-modal';
import {hideModal} from '../store/actions/auth';
import { connect } from "react-redux";
import CancelIcon from '@material-ui/icons/Cancel';

export function Footer(){
    return (
        <div className="footer">
                <p>Aashraya Ⓒ 2020. All Rights Reserved. </p>
        </div>
    )
}

Modal.setAppElement('#root');
const Home = ({showModal,hidemodal})=> {
    const [searchValue,setSearchValue] = useState('');
    const history = useHistory()
    // const[modalIsOpen,setModalIsOpen] = useState(true);


    const handleChange = (e)=> {
        setSearchValue(e.target.value);
    }

    const mySubmitHandler = (e)=> {
        e.preventDefault();
        history.push(`/items/${searchValue}`)
        
    }

    return (
        <>

        <Modal 
        isOpen = {showModal}
        style={{
            overlay: {
              backgroundColor: 'rgba(17, 13, 14, 0.507)',
                height:'100vh',
                // width:'500px',

            },
            content: {
            color: 'black'
            }
        }}
        >
            <h4 style = {{textAlign:"center",textDecoration:"underline"}}>Important</h4>
            <h6> Welcome to Aashraya. This is a web platform to search for rooms,hostel,flat,home,land and roommate. 
            Use Keyword "Haldibari" to see the results.  
            <br/> <br/>
            This app is still in development mode. The frontend is written in React and is hosted in netlify. 
            I am unable to add some features like google maps, places auto complete, suggestions, 
            because google cloud doesn't support card from Nepal. 
            <br/> <br/>
            Similarly, the backend is written in Django Rest Framework and is hosted in heroku. 
            The media files (images) are not shown because heroku automatically removes the media files. 
            I wanted to use Amazon S3 to serve those media files but once again Amazon didn't accept the card 

            <br/> <br/>
            Facebook Login works well for my account but doesn't work for others yet. So better not use it.
            <br/> <br/>
            Hopefully All these issues will be solved in the coming days.
            </h6>
            <div className="close_btn" style = {{display:"flex",alignItems:"center",justifyContent:"center"}}>
                <button onClick = {()=> hidemodal()}> <CancelIcon/> </button>
            </div>
        </Modal>


        <div className="landing">
            <div className="text_part">
                <h3> Find great places and people to live with. </h3>
                <div className="search">
                    <input 
                    className = "form_input"
                    type="search"
                    value = {searchValue}
                    onChange={handleChange}
                    placeholder = "Search your city. Example:- Haldibari "
                    required
                    />
                    <button onClick = {mySubmitHandler}>
                        search
                    </button>

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

