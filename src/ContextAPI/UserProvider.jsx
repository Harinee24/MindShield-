import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {UserContext} from "./UserContext.jsx";

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUserFromCookie = () => {
        const userCookie = Cookies.get("user");
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUserFromCookie();
    }, []);

    return (
        <UserContext.Provider value={{user, setUser, loading}}>
            {children}
        </UserContext.Provider>
    );
};
