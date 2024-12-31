import {useEffect, useState} from "react";
import axios from "axios";
import "./contact.css";
import Cookies from "js-cookie";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";

const Contact = () => {
    const [contacts, setContacts] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const navigate = useNavigate();
    const [user, setUser] = useState(null);


    // Check for user login on component load
    useEffect(() => {
        const userCookie = Cookies.get('user');
        console.log(userCookie);

        if (userCookie) {
            const parsedUser = JSON.parse(userCookie); // Parse cookie value
            setUser(parsedUser); // Set the user data in the state
        } else {
            navigate('/login'); // Redirect to login if user is not logged in
        }
    }, [navigate]);


    const userCookie = Cookies.get("user");
    const userId = userCookie ? JSON.parse(userCookie).userId : null;

    // Fetch contacts from the backend
    const fetchContacts = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8081/api/sos/get-contacts/${userId}`
            );

            console.log("This is contact response: ", response.data);
            setContacts(response.data.contacts || []);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Error fetching contacts";
            toast.error(`Error: ${errorMsg}`); // Display backend error message
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);


    // Add a new contact
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create the contact object, only including phoneNumber if provided
        const contact = {
            name,
            email,
        };
        if (phoneNumber) {
            console.log(phoneNumber);
            console.log(contact);
            contact.phoneNumber = phoneNumber;
        }

        const contactData = {
            userId,
            contact,
        };

        try {
            await axios.post(
                "http://localhost:8081/api/sos/add-contacts",
                contactData
            );
            fetchContacts();
            setName("");
            setEmail("");
            setPhoneNumber("");
            setShowPopup(false); // Hide the popup on successful save
            toast.success("Contact added successfully!"); // Success toast for adding a contact
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Error adding contact";
            toast.error(`Error: ${errorMsg}`); // Display backend error message
        }
    };

    // Delete a contact
    const handleDelete = async (email, phoneNumber) => {
        try {
            await axios.delete(
                `http://localhost:8081/api/sos/delete-contact/${userId}`,
                {
                    params: {email, phoneNumber},
                }
            );
            fetchContacts();
            toast.success("Contact deleted successfully!"); // Success toast for deleting a contact
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Error deleting contact";
            toast.error(`Error: ${errorMsg}`); // Display backend error message
        }
    };

    return (
        <div className="contact-container">
            <h2 className="title">Emergency Contact Details</h2>
            <p className="subtitle">Contact details for receiving SOS alerts</p>

            {/* Contact List */}
            <div className="contact-list">
                {contacts.map((contact, index) => (
                    <div key={index} className="contact-card">
                        <div className="contact-info">
                            <h4 className="contact-name">{contact.name || `Contact ${index + 1}`}</h4>
                            <p className="contact-detail">
                                <strong>Email:</strong> {contact.email || "N/A"}
                            </p>
                            <p className="contact-detail">
                                <strong>Phone:</strong> {contact.phoneNumber || "N/A"}
                            </p>
                        </div>
                        <button
                            className="delete-btn"
                            onClick={() => handleDelete(contact.email, contact.phoneNumber)}
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>

            {/* Add More Contact Button */}
            <button className="add-contact-btn" onClick={() => setShowPopup(true)}>
                Add More Contact
            </button>

            {/* Popup Form */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-form">
                        <h3 className="form-title">Add Emergency Contact</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="input-field"
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    placeholder="Phone Number (Optional)"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                            <div className="button-group">
                                <button type="submit" className="save-btn">
                                    Save Contact
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowPopup(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contact;
