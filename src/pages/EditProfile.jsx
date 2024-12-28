import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {toast} from "sonner";
import editIcon from "/camera.png";
import "./EditProfile.css";
import axios from "axios";

const EditProfile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("https://randomuser.me/api/portraits/men/75.jpg");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userCookie = Cookies.get("user");
        if (userCookie) {
            const userData = JSON.parse(userCookie);
            setUser(userData);
            setName(userData.name);
            setEmail(userData.email);

            const storedImage = localStorage.getItem("profileImage");
            const storedImageType = localStorage.getItem("profileImageType");
            if (storedImage && storedImageType) {
                const makeImageUrl = "data:"+storedImageType+";base64,"+storedImage;
                setPreviewImage(makeImageUrl);
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) { // Check file size (1MB limit)
                toast.error("Image size should not exceed 1MB!");
                return;
            }
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result); // Set preview image
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async () => {

        if (password && password !== confirmPassword) {
            toast.error("Confirm Password doesn't match with the password!");
            return;
        }

        try {
            setLoading(true);
            const userId = user.userId

            // Create the profileData object
            const profileData = {
                userId: userId,
                name: name,
                email: email,
                ...(password && { password: password }), // Only include password if it's set
            };

            // Create FormData
            const formData = new FormData();
            formData.append("profileData", new Blob([JSON.stringify(profileData)], {type: "application/json"})); // Send profileData as JSON string
            if (profileImage) {
                formData.append("profileImage", profileImage); // Send profileImage as a file
            }

            // Make the API request
            const response = await axios.post("http://localhost:8080/api/auth/update-profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                const updatedUser = {
                    userId: response.data.userId,
                    name: response.data.name,
                    email: response.data.email
                };
                Cookies.set("user", JSON.stringify(updatedUser));
                localStorage.setItem("profileImage", response.data.profileImage.imageData);
                localStorage.setItem("profileImageType", response.data.profileImage.imageType);
                toast.success("Profile updated successfully!");
                navigate("/profile");
            }
        } catch (error) {
            toast.error(error.response?.data || "An error occurred!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="edit-profile">
            <div className="edit-profile-container">
                <h1>Edit Profile</h1>

                <label htmlFor="profileImage" className="profile-image-label">
                    <img src={previewImage} alt="Profile" className="preview-profile-image"/>
                    <span className="edit-icon">
                        <img src={editIcon} alt="Profile" className="edit-icon"/>
                    </span>
                </label>
                <input
                    type="file"
                    name="profileImage"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                />

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button className="update-button" onClick={handleUpdateProfile} disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </div>
        </section>
    );
};

export default EditProfile;
