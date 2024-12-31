import { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../ContextAPI/UserContext.jsx";
import Cookies from "js-cookie";

const Profile = () => {
    const { user, setUser, loading } = useContext(UserContext);
    const [image, setImage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const hasRefreshed = localStorage.getItem("hasRefreshed");
        if (!hasRefreshed) {
            localStorage.setItem("hasRefreshed", "true");
            window.location.reload();
        }
    }, []);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate("/login");
            } else {
                const storedImage = localStorage.getItem("profileImage");
                const storedImageType = localStorage.getItem("profileImageType");

                if (storedImage && storedImageType) {
                    const makeImageUrl = `data:${storedImageType};base64,${storedImage}`;
                    setImage(makeImageUrl);
                } else {
                    setImage("https://randomuser.me/api/portraits/men/75.jpg");
                }
            }
        }
    }, [loading, navigate, user]);

    const handleLogout = () => {
        Cookies.remove("user");
        localStorage.removeItem("profileImage");
        localStorage.removeItem("profileImageType");
        localStorage.removeItem("hasRefreshed");
        setUser(null);
        navigate("/");
    };

    if (loading) {
        return <div>Loading User Profile...</div>;
    }

    return (
        <section className="profile">
            <div className="profile-container">
                <div className="profile-card">
                    <h1>Your Profile</h1>
                    <img
                        src={image}
                        alt="Profile"
                        className="profile-image"
                    />
                    <h1 className="profile-name">{user?.name}</h1>
                    <p className="profile-email">{user?.email}</p>

                    <div>
                        <button
                            className="logout-button"
                            onClick={() => navigate("/edit-profile")}
                        >
                            Edit Profile
                        </button>
                    </div>

                    <div>
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;
