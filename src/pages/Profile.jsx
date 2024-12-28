import {useEffect, useState} from "react";
import "./Profile.css";
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';

const Profile = () => {

    const [user, setUser] = useState(null);
    const [image, setImage] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const userCookie = Cookies.get('user');
        console.log(userCookie);
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        } else {
            navigate('/login');
        }

        const storedImage = localStorage.getItem("profileImage");
        const storedImageType = localStorage.getItem("profileImageType");
        if (storedImage) {
            console.log("I am setting Image..")
            const makeImageUrl = "data:image/jpeg;base64,"+storedImage;
            setImage(makeImageUrl);
            console.log("the set Image is: ", image);
        }
    }, [navigate]);

    if (!user) return <div>Loading...</div>;

    const handleLogout = () => {
        Cookies.remove('user');
        localStorage.removeItem('profileImage');
        navigate('/'); // Redirect to the homepage
    };

    return (
        <section className="profile">
            <div className="profile-container">

                <div className="profile-card">
                    <h1>Your Profile</h1>
                    <img
                        src={`${image}` || "https://randomuser.me/api/portraits/men/75.jpg"}
                        alt="Profile"
                        className="profile-image"
                    />

                    <h1 className="profile-name">{user.name}</h1>
                    <p className="profile-email">{user.email}</p>


                    <div>
                        <button className="logout-button" onClick={() => navigate('/edit-profile')}>
                            Edit Profile
                        </button>
                    </div>

                    <div>
                        <button className={"logout-button"} onClick={handleLogout}>Logout</button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Profile;
