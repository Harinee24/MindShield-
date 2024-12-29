import {useEffect, useState} from "react";
import axios from "axios";
import "./AdminDashboard.css";
import {deleteJournal} from "../services/JournalService.jsx";
import {toast} from "sonner";
import Cookies from "js-cookie";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [journals, setJournals] = useState([]);
    const [emergencyContact, setEmergencyContact] = useState([]);
    const [alertLogs, setAlertlogs] = useState([]);
    const [isAdmin, setIsAdmin] = useState(true);
    let contactCounts = 0;

    useEffect(() => {
        const userCookie = Cookies.get('user');
        const userData = JSON.parse(userCookie)

        const fetchDetails = async () => {
            try {
                const usersRes = await axios.get("http://localhost:8080/api/admin/get/all/users",{
                    params: {
                        userId: userData.userId,
                    }
                });
                setUsers(usersRes.data);

                // If users are fetched successfully, then fetch the other data
                const [journalsRes, emergencyContactsRes, alertLogsRes] = await Promise.all([
                    axios.get("http://localhost:8082/api/journals/all"),
                    axios.get("http://localhost:8081/api/admin/allcontact"),
                    axios.get("http://localhost:8081/api/admin/alertlogs")
                ]);

                setJournals(journalsRes.data);
                setEmergencyContact(emergencyContactsRes.data);
                setAlertlogs(alertLogsRes.data);
            } catch (error) {
                console.error("Error fetching details", error);

                // If the error occurs while fetching users, assume no admin access
                if (error.response && error.response.status === 401) {
                    setIsAdmin(false);
                } else {
                    toast.error("An unexpected error occurred.");
                }
            }
        };

        fetchDetails();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {year: "numeric", month: "long", day: "numeric"};
        return date.toLocaleDateString("en-GB", options);
    };

    const getUserNameById = (userId) => {
        const user = users.find((user) => user.userId === userId);
        return user ? user.name : "Unknown User";
    };

    const formatTimestamp = (timestamp) => {
        const dateObj = new Date(timestamp);
        const date = dateObj.toLocaleDateString();
        const time = dateObj.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
        return {date, time};
    };

    const deleteThisJournal = async (journalId) => {
        try {
            const response = await deleteJournal(journalId);
            toast.success(response); // Show success message
            setJournals((prevJournals) =>
                prevJournals.filter((journal) => journal.id !== journalId)
            );
        } catch (error) {
            console.error("Error deleting journal", error);
            toast.error("Error deleting journal.");
        }
    };

    if (!isAdmin) {
        return (
            <div className="admin-dashboard">
                <header className="dashboard-header">
                    <h1>Access Denied</h1>
                </header>
                <p>You are not an admin and do not have access to this dashboard.</p>
            </div>
        );
    }


    console.log("User: ", users);
    console.log("Journal: ", journals);
    console.log("Contacts: ",emergencyContact);
    console.log("Logs: ", alertLogs);

    return (

        <div className="admin-dashboard">
            <header className="dashboard-header">
                <h1>ShieldMe Admin Dashboard</h1>
            </header>


            <div className="dashboard-summary">
                <div className="summary-card">
                    <h2>Total Users</h2>
                    <p>{users.length}</p>
                </div>
                <div className="summary-card">
                    <h2>Total Journals</h2>
                    <p>{journals.length}</p>
                </div>
                <div className="summary-card">
                    <h2>Total Emergency Contact</h2>
                    <p>{emergencyContact.length}</p>
                </div>
            </div>

            <div className="dashboard-lists">
                <div className="list-container">
                    <h2>User List</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Serial No.</th>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user, index) => (
                            <tr key={user.userId}>
                                <td>{index + 1}</td>
                                <td>{user.userId}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="list-container">
                    <h2>Journal List</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Serial No.</th>
                            <th>Journal ID</th>
                            <th>Title</th>
                            <th>Content</th>
                            <th>Created At</th>
                            <th>Created By</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {journals.map((journal, index) => (
                            <tr key={journal.id}>
                                <td>{index + 1}</td>
                                <td>{journal.id}</td>
                                <td>
                                    {journal.title.length > 25
                                        ? journal.title.slice(0, 25) + "..."
                                        : journal.title}
                                </td>
                                <td>
                                    {journal.content.length > 30
                                        ? journal.content.slice(0, 30) + "..."
                                        : journal.content}
                                </td>
                                <td>{formatDate(journal.createdAt)}</td>
                                <td>{getUserNameById(journal.userId)}</td>
                                <td>
                                    <button
                                        className={"delete-btn"}
                                        onClick={() => deleteThisJournal(journal.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>


                <div className="list-container">
                    <h2>Emergency Contact List</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Serial No.</th>
                            <th>Contact ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>CreatedBy</th>
                        </tr>
                        </thead>
                        <tbody>
                        {emergencyContact.map((contact) =>
                            contact.contacts.map((contactDetail, index) => {
                                contactCounts++;
                                return (
                                    <tr key={index}>
                                        <td>{contactCounts}</td>
                                        <td>{contact.contactId}</td>
                                        <td>{contactDetail.name}</td>
                                        <td>{contactDetail.email}</td>
                                        <td>{contactDetail.phoneNumber ? contactDetail.phoneNumber : 'N/A'}</td>
                                        <td>{getUserNameById(contact.userId)}</td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>


                <div className="list-container">
                    <h2 className="alerts-logs-title">SOS Alert Logs</h2>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Serial No.</th>
                            <th>Alert ID</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Sent By</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {alertLogs.map((log, index) => {
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
                                    <td>{getUserNameById(log.userId)}</td>
                                    <td style={statusStyle}>{log.status}</td>
                                </tr>
                            );
                        })}

                        </tbody>
                    </table>
                </div>


            </div>
        </div>
    );
};

export default AdminDashboard;