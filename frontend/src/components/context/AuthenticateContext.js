import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthenticateProvider = ({ children }) => {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // Check authentication status on initial load
    const checkAuthStatus = async () => {
        try {
            // Check if token exists (assuming stored in cookies)
            const response = await axios.get('/api/check-auth', { withCredentials: true });
            
            const userData = response.data;

            if (userData?.user?.role === 'admin') {
                setIsAdminAuthenticated(true);
                setIsUserAuthenticated(false);
                console.log(`Admin logged in`);
            } else if (userData?.user?.role === 'user') {
                setIsUserAuthenticated(true);
                setIsAdminAuthenticated(false);
                console.log(`User logged in`);
            } else {
                setIsAdminAuthenticated(false);
                setIsUserAuthenticated(false);
                console.log('No valid session found');
            }

            // Set the user state
            setUser(userData.user);

        } catch (e) {
            console.error('Failed to check auth status', e);
            setIsUserAuthenticated(false);
            setIsAdminAuthenticated(false);
        }
    };

    const signin = async (email, password) => {
        try {
            const response = await axios.post('/api/login', { email, password }, { withCredentials: true });
            const userData = response.data;

            // Set user authentication states based on the role
            if (userData.user.role === 'admin') {
                setIsAdminAuthenticated(true);
                setIsUserAuthenticated(false);
                console.log(`Logged in as admin`);
            } else if (userData.user.role === 'user') {
                setIsUserAuthenticated(true);
                setIsAdminAuthenticated(false);
                console.log(`Logged in as user`);
            }

            // Store user information in state
            setUser(userData.user);
        } catch (e) {
            console.error("Login error:", e);
            setIsUserAuthenticated(false);
            setIsAdminAuthenticated(false);
        }
    };

    const signout = async () => {
        try {
            const response = await axios.post('/api/logout', {}, { withCredentials: true });
            console.log("Logout successful:", response.data);

            // Clear authentication states and user data
            setIsAdminAuthenticated(false);
            setIsUserAuthenticated(false);
            setUser(null);
        } catch (e) {
            console.error("Logout error:", e);
        }
    };

    return (
        <AuthContext.Provider value={{ signin, signout, user, isUserAuthenticated, isAdminAuthenticated, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the Auth Context
export const useAuth = () => {
    return useContext(AuthContext);
};
