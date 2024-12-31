import {useContext} from "react";
import {Link} from "react-router-dom";
import "./navbar.css";
import logo from "/Logo.svg";
import {UserContext} from "../ContextAPI/UserContext.jsx";

const Navbar = () => {
    const {user} = useContext(UserContext);
    return (
        <>
            <div className="navbar-container">
                <nav className="navbar">
                    <Link className="heading" to="/">
                        <img src={logo} alt={"Logo Image"}/>
                        <h3 className="title">ShieldMe</h3>
                    </Link>

                    {!user && (
                        <Link to="/login" className="link">
                            LOGIN
                        </Link>
                    )}

                    {user && (
                        <div className="login-user-feature-container">
                            <Link to="/contact" className="link">
                                Contacts
                            </Link>
                            <Link to="/journals" className="link">
                                Journal
                            </Link>
                            <Link to="/profile" className="link">
                                Profile
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
            <div className="fade-navbar-effect"></div>
            <div className="empty-navbar"></div>
        </>
    );
};

export default Navbar;
