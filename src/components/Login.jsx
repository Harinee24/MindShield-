import {useContext, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import {login} from '../services/AuthService.jsx';
import {toast} from 'sonner';
import './login.css';
import {UserContext} from "../ContextAPI/UserContext.jsx";

const LoginForm = () => {

    const {setUser} = useContext(UserContext);
    const navigate = useNavigate();

    const [data, setData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const handleInputChange = (field, value) => {
        setData((prevState) => ({
            ...prevState,
            [field]: value,
        }));

        setErrors((prevState) => ({
            ...prevState,
            [field]: '',
        }));
    };
    const validate = () => {
        const newErrors = {};

        if (!data.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!data.password) {
            newErrors.password = 'Password is required.';
        } else if (data.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (validate()) {
            login(data)
                .then((resp) => {
                    const user = {
                        userId: resp.userId,
                        name: resp.name,
                        email: resp.email,
                    };
                    if (resp.profileImage.imageData !== null && resp.profileImage.imageType !== null) {
                        localStorage.setItem("profileImage", resp.profileImage.imageData);
                        localStorage.setItem("profileImageType", resp.profileImage.imageType);
                    }
                    Cookies.set('user', JSON.stringify(user), {expires: 7, secure: true});
                    setUser(JSON.stringify(user));
                    toast.success('User logged in successfully');
                    navigate('/contact');
                })
                .catch((err) => {
                    console.error('Error during login:', err);
                    toast.error('Invalid credentials. Please try again.', err);
                });
        }
    };

    return (
        <div className="login-container">
            <h2>Login to Your Account</h2>
            <p>Enter your email and password below to login to your account</p>
            <form onSubmit={handleLogin}>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={data.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={errors.email ? 'input-error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={data.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={errors.password ? 'input-error' : ''}
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                </div>
                <p className="signup-text">
                    Forgot password? <Link to="/forgotPassword">Reset Password</Link>
                </p>

                <button type="submit" className="login-button">
                    Login
                </button>
            </form>

            <p className="signup-text">
                Don&#39;t have an account? <Link to="/register">Sign Up</Link>
            </p>
        </div>
    );
};

export default LoginForm;
