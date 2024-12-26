import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './userdashboard.css';
import axios from "axios";
import EmergencyCard from "../components/EmergencyCard.jsx";
import Medical from "/Medical.svg";
import Fire from "/Fire.svg";
import Accident from "/Accident.svg";
import Disaster from "/Disaster.svg";
import Violence from "/Violence.svg";
import Rescue from "/Rescue.svg";
import ShlokBanner from "../components/ShlokBanner.jsx";


const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            setUser(JSON.parse(userCookie)); // Parse and set the user data
        } else {
            navigate('/login'); // Redirect to login if no user is logged in
        }
    }, [navigate]);

    return (
        <>
            <section className="dashboard-container">
                <div className="dashboard-hero-section-container">
                    <div className="dashboard-left-container">
                        {user ? (
                            <h1>Hi, <span>{user.name || 'User'}!</span></h1>
                        ) : (
                            <p>Loading...</p>
                        )}
                        <h1>Are you in an emergency?</h1>
                        <p>Press the SOS button, your live location will be shared with your<br/>saved emergency
                            contacts</p>
                        <Link to={"/contact"}>Emergency Contacts</Link>
                    </div>
                    <div className="dashboard-right-container">
                        <img src={"/kidnaping.svg"} alt="Kinapping Image"/>
                    </div>
                </div>

                <div className={"line-div"}>
                    <div></div>
                </div>

                <div className="sos-button-container">
                    <h1>Press the Emergency Button</h1>
                    <Link to="/sos-alert">
                        <button className="sos-alert-button">SOS ALERT</button>
                    </Link>
                </div>


                <div className={"line-div"}>
                    <div></div>
                </div>

                <div className="dashboard-emergency-container">
                    <h1>Whats your emergency?</h1>
                    <div className="emergency-list-container">
                    <EmergencyCard image={Medical} name={"Medical"} color={"#DBE790"} contact={"102"} />
                    <EmergencyCard image={Fire} name={"Fire"} color={"#F5A6A6"} contact={"101"} />
                    <EmergencyCard image={Disaster} name={"Natural Disaster"} color={"#A6F5D4"} contact={"108"} />
                    <EmergencyCard image={Accident} name={"Accident"} color={"#D4CEFA"} contact={"1073"} />
                    <EmergencyCard image={Violence} name={"Violence"} color={"#F5A6DF"} contact={"1091"} />
                    <EmergencyCard image={Rescue} name={"Rescue"} color={"#F5E8A6"} contact={"112"} />
                    </div>
                </div>


                <ShlokBanner/>

            </section>
        </>
    );
};

export default UserDashboard;
