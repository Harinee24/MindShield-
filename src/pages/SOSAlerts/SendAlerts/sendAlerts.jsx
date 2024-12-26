import {toast} from "sonner";
import axios from "axios";
import "./SendAlerts.css";
import Cookies from 'js-cookie';
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";


const SendAlerts = () => {

    const userCookie = Cookies.get('user');
    const userId = userCookie ? JSON.parse(userCookie).userId : null;
    const username = userCookie ? JSON.parse(userCookie).name : null;


    // Function to handle getting user's location
    const getLocationAndSendAlert = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    // const location = `${latitude}, ${longitude}`;

                    // Function to call the backend to send the alert
                    sendSOSAlert(latitude, longitude);
                },
                (error) => {
                    console.error("Error getting location", error);
                    toast.error("Failed to get your location.");
                }
            );
        } else {
            toast.error("Geolocation is not supported by this browser.");
        }
    };

    // Function to send SOS alert to the backend using Axios
    const sendSOSAlert = (latitude, longitude) => {
        toast.promise(
            axios.post(`http://localhost:8081/api/sos/alert`, null, {
                params: {
                    userId,
                    latitude,
                    longitude,
                    username
                },
            })
                .then((response) => {
                    // Success case: Log response data, return message
                    console.log("This is backend response", response.data);
                    return response.data.message || "SOS alert sent successfully!";
                })
                .catch((error) => {
                    // Handle error from backend
                    const errorMessage = error.response?.data?.message || "Error sending SOS alert.";
                    const errorDetails = error.response?.data?.details || "No additional details available.";
                    throw new Error(`${errorMessage}: ${errorDetails}`);
                }),

            {
                loading: "Sending SOS alert...",
                success: (data) => data, // Show success message from backend
                error: (error) => error.message || "Error sending SOS alert.", // Show error message
            }
        );
    };


    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/sos/alert-logs/${userId}`); // Replace with your API endpoint
                setLogs(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch logs.");
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const formatTimestamp = (timestamp) => {
        const dateObj = new Date(timestamp);
        const date = dateObj.toLocaleDateString(); // e.g., "12/26/2024"
        const time = dateObj.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}); // e.g., "14:30"
        return {date, time};
    };

    return (
        <section className="sos-alert-container">

            <div className="sos-button-container">
                <h1>Send SOS Alert to saved contacts</h1>
                <Link to="/sos-alert">
                    <button onClick={getLocationAndSendAlert} className="sos-alert-button">SOS ALERT</button>
                </Link>
            </div>


            <div className="alerts-logs-container">
                <h1 className="alerts-logs-title">SOS Alert Logs</h1>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Serial No.</th>
                        <th>Alert ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {logs.map((log, index) => {
                        const {date, time} = formatTimestamp(log.timestamp); // Format timestamp
                        const statusStyle = log.status === "Sent"
                            ? {backgroundColor: "#A8E6A3"} // Pastel green for "Sent"
                            : log.status.startsWith("Failed")
                                ? {backgroundColor: "#F4A6A6"} // Pastel red for "Failed"
                                : {}; // Default style for other statuses

                        return (
                            <tr key={log.alertId}>
                                <td>{index + 1}</td>
                                <td>{log.alertId}</td>
                                <td>{date}</td>
                                <td>{time}</td>
                                <td>{log.latitude}</td>
                                <td>{log.longitude}</td>
                                <td style={statusStyle}>{log.status}</td>
                            </tr>
                        );
                    })}

                    </tbody>
                </table>
            </div>


        </section>
    );
};


export default SendAlerts;
