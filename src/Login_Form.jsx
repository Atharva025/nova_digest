import { Link, useNavigate, useLocation } from "react-router-dom";
import "../src/css/Login_Form.css";
import { useState, useContext } from "react";
import { UserContext } from './userContext.js';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


const Login_Form = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginResponse, setLoginResponse] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [closed, setClosed] = useState(false);
    const { setUser } = useContext(UserContext);
    const location = useLocation();
    const { arr = [] } = location.state || {};

    const handleSubmit = async (event) => {
        setButtonClicked(true);
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const userData = await response.json();
                if (userData.user) {
                    console.log('Login successful');
                    setLoginResponse(true);
                    setUser(userData.user.username);
                    navigate("/home");
                }
            } else {
                console.log('Error logging in:', response.status);
                setLoginResponse(false);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <Stack style={{ display: buttonClicked === true ? "block" : "none" }} className="absolute top-0" sx={{ width: '50%', height: '10%' }} spacing={5}>
                <Alert onClose={() => { setClosed(true) }}
                    style={{ display: closed === true ? "none" : "flex" }} variant="filled" severity={loginResponse === true ? "success" : "error"}>{loginResponse === true ? "Login Successful" : "Error while Logging In"}</Alert>
            </Stack >
            <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl">Welcome to NovaDigest</h1>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="flex flex-col my-5">
                        <label htmlFor="typeName" className="text-lg my-1">Name</label>
                        <input id="typeName" type="text" className="rounded-lg h-10 px-2 text-sm text-black" placeholder="Enter your Name" required
                            value={username} onChange={e => setUsername(e.target.value)} />
                        <label htmlFor="typePass" className="text-lg my-1">Password</label>
                        <input id="typePass" type="password" className="rounded-lg h-10 px-2 text-sm text-black" placeholder="Enter your Password" required
                            value={password} onChange={e => setPassword(e.target.value)} />
                        <button onClick={() => {
                            navigate("/home", { state: { arr } });
                        }} type="submit" className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4">Login</button>
                    </div>
                </form>
                <div className="text-center">
                    <span className="text-sm">Not a User? <Link to="/sign_up" className="text-blue-800">Sign Up</Link></span>
                </div>
            </div>
        </div>
    );
};

export default Login_Form;
