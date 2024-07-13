import "../src/css/Landing.css";
import error_img from "../src/images/error.png";
import { Link } from "react-router-dom";

const Landing = () => {

    return (
        <>
            <div className="flex flex-col items-center flex-wrap">
                <h2 className="text-2xl mt-5 font-semibold md:text-4xl lg:text-6xl">Welcome to the Landing Page</h2>

                <div className="flex flex-col w-[750px]">
                    <span className="text-center mt-5 md:text-lg lg:text-2xl md:mt-10 lg:mt-16">In case if you are seeing this page, it only seems fit that you are not signed into our news app website</span>

                    <span className="text-center mt-5 md:text-lg lg:text-2xl md:mt-10 lg:mt-16">Kindly click on the below button to start your news journey with us!</span>
                </div>



                <Link to={"/sign_up"}>
                    <button className="button px-5 py-1 lg:my-2">Sign Up</button>
                </Link>


                {/* <img className="w-[250px] h-[250px] absolute bottom-16" src={error_img} alt="Error Icon" /> */}
            </div>
        </>
    )
}

export default Landing;