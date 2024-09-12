import { Link, useNavigate } from "react-router-dom";
import "../src/css/Sign_Up_Form.css";
import Genres from "../src/components/Genre_Types";
import { useState } from "react";

const Sign_Up_Form = () => {
    const navigate = useNavigate();

    const [arr, setArr] = useState([]);
    const [buttonClicked, setButtonClicked] = useState(null);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    })

    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");


    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const validateForm = () => {
        let newErrors = {};
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
        const username = document.getElementById("typeName");
        const password = document.getElementById("typePass");
        const confirmPass = document.getElementById("typeRePass");

        if (!formData.username.trim()) {
            newErrors.username = "Username is Required";
            password.classList.add("shake");
        } else if (!usernameRegex.test(formData.username) && !user) {
            newErrors.username = "Please Enter a Proper Username";
            username.classList.add("shake");
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is Required";
            password.classList.add("shake");
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = "Please Enter a Proper Password";
            password.classList.add("shake");
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            confirmPass.classList.add("shake");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (isValid) {
            try {

                const updatedFormData = {
                    ...formData,
                    genre: arr
                }

                const response = await fetch("http://localhost:3000/sign_up", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedFormData)
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('User created:', data);
                    setSubmitted(true);
                } else {
                    console.log('Error creating user:', response.status);
                }
            } catch (error) {
                console.log('Error:', error);
            }
        }
    };


    const handleSelectGenre = (genreName) => {
        // setButtonClicked(true);
        if (arr.includes(genreName)) {
            setArr(arr.filter(name => name !== genreName));
        } else {
            setArr([...arr, genreName]);
        }
    }

    const handleUsernameChange = (event) => {
        setFormData({
            ...formData,
            username: event.target.value
        });
        setUser(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setFormData({
            ...formData,
            password: event.target.value
        });
        setPass(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setFormData({
            ...formData,
            confirmPassword: event.target.value
        });
        setConfirmPass(event.target.value);
    };

    return (
        <>
            <div className="h-[100vh] flex justify-center items-center">
                <div className="flex flex-wrap">
                    <div className="my-2">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center">Welcome to NovaDigest</h1>
                        <form action="" onSubmit={handleSubmit}>
                            <div className="flex flex-col my-5">
                                <label id="name" className="text-lg sm:text-lg md:text-3xl lg:text-2xl my-1" htmlFor="typeName">Name</label>
                                <input id="typeName" className="rounded-lg h-7 md:h-10 lg:h-10 my-1 text-black" type="text" placeholder="Enter your Name" value={formData.username} onChange={handleUsernameChange}
                                />
                                {errors.username && <span>{errors.username}</span>}
                                <label id="pass" className="text-lg sm:text-lg md:text-3xl lg:text-2xl my-1" htmlFor="typePass">Password</label>
                                <input id="typePass" className="rounded-lg h-7 md:h-10 lg:h-10 my-1 text-black" type="password" placeholder="Enter your Password" value={formData.password} onChange={handlePasswordChange}
                                />
                                {errors.password && <span>{errors.password}</span>}
                                <label id="rePass" className="text-lg sm:text-lg md:text-3xl lg:text-2xl my-1" htmlFor="typeRePass">Re-Enter Password</label>
                                <input id="typeRePass" className="rounded-lg h-7 md:h-10 lg:h-10 my-1 text-black" type="password" placeholder="Re-Enter your Password" value={formData.confirmPassword} onChange={handleConfirmPasswordChange}
                                />
                                {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
                                <h2>Please Select a Genre</h2>
                                <div className="flex gap-1 my-5 flex-wrap justify-center">

                                    {Genres.map((item, index) => {
                                        return (<>
                                            <button
                                                onClick={() => {
                                                    handleSelectGenre(item.name)

                                                }} className={`${buttonClicked === item.name ? "black" : "bg-blue-600"} text-white py-2 px-4 rounded hover:bg-blue-700`} key={index}>{item.name}</button>
                                        </>)
                                    })}
                                </div>
                                <button onClick={() => {
                                    (arr && arr.length > 1) ? navigate("/home", { state: { arr } }) : alert("Please Select atleast 2 Genres!")
                                }} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Sign Up</button>
                                <span className="text-sm sm:text-md md:text-lg lg:text-xl text-center">Already a User? Please <Link to={"/login"}><span className="text-blue-800">Log In</span></Link></span>
                            </div>
                        </form>
                    </div>
                </div>

            </div>

        </>
    )
}

export default Sign_Up_Form;