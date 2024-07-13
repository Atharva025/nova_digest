import "../src/css/Footer.css";
import Genres from "../src/components/Genre_Types";
// import Team from "../src/components/Team_Members";
import { Link } from "react-router-dom";
const Footer = () => {
    return (
        <>
            <div id="footerDes" className="mt-3 rounded-2xl">
                <div className="flex justify-center mb-2 lg:text-3xl">
                    <span className="text-center">Original Content and News</span>
                </div>

                <div className="flex justify-between">
                    <div className="flex flex-col text-sm font-bold gap-y-2 lg:text-xl">
                        <span className="">Name</span>
                        <Link to={"/about_us"} className=" hover:text-blue-700">About Us</Link>
                    </div>

                    <div className="flex flex-col text-xs items-center lg:text-xl">
                        <p className="text-balance text-md text-center mb-5">NewsAppName is a news website which allows you to read news articles from various hot topics around the world.</p>
                        <div className="flex gap-2 text-center px-5">
                            {Genres.map((item, index) => {
                                return (
                                    <div
                                        id="genreTypes" className="py-1" key={index}>
                                        <span>{item.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex w-[200px] items-center text-xs">
                        <p>NewsAppName does not store any news articles on our server. We simply render it using API.</p>
                    </div>
                </div>
                {/* <div className="flex justify-center">
                    Made By-
                    {Team.map((item, index) => {
                        return (
                            <div className="px-1" key={index}>
                                {item.name}
                            </div>
                        )
                    })}
                </div> */}
            </div>
        </>
    )
}

export default Footer;

