import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8082/api/journals";

// Fetch all journals
export const getJournals = async () => {
    const userCookie = Cookies.get("user");
    const userId = userCookie ? JSON.parse(userCookie).userId : null;
    console.log("This is userId", userId);

    const response = await axios.get(API_URL, {
        headers: {
            "userId": userId
        }
    });
    return response.data;
};


// Create a new journal
export const createJournal = async (title, content) => {
    const userCookie = Cookies.get("user");
    const userId = userCookie ? JSON.parse(userCookie).userId : null;
    console.log("This is userId", userId);


    // const userId = localStorage.getItem("userId");  // Assuming userId is stored in localStorage or cookie
    const response = await axios.post(API_URL, {title, content}, {
        headers: {
            "userId": userId  // Send userId in the request headers
        }
    });
    return response.data;
};

export const deleteJournal = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export const updateJournal = async (id, title, content) => {
    const response = await axios.put(`${API_URL}/${id}`, {title, content});
    return response.data;
};
