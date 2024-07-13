import { useContext, useState } from "react";
import "../src/css/Header.css";
import Genres from "../src/components/Genre_Types";
import { Link } from "react-router-dom";
import { UserContext } from "./userContext";

const Header = ({ setSelectedGenre }) => {
    const [showGenreCol, setShowGenreCol] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const [checkCount, setCheckCount] = useState(1);


    const [animatedGenreCol, setAnimatedGenreCol] = useState(false);

    function displayLogOutPage() {
        setCheckCount(() => checkCount + 1);
        if (checkCount === 10) {
            setCheckCount(1);
        }
    }

    function removeDetails() {
        setUser(null);
    }


    function displayGenreCol() {
        setShowGenreCol(true);
        setAnimatedGenreCol(true);
    }

    function hideGenreCol() {
        setShowGenreCol(false);
        setAnimatedGenreCol(false);
    }

    return (
        <>
            <div id="headerDiv" className="mt-2 flex justify-between">
                <div className="">
                    <span className="text-lg">NovaDigest</span>
                </div>
                <div id="genreDiv" className="flex flex-col items-center">
                    <span id="genre"
                        onClick={() => {
                            showGenreCol ? hideGenreCol() : displayGenreCol();
                        }}
                        className="text-lg"
                    >
                        Genre
                    </span>

                    {showGenreCol && animatedGenreCol && (
                        <div id="genreCol" className={`text-center w-full mx-5 ${animatedGenreCol ? "show" : ""}`}>
                            {Genres.map((item, index) => {
                                return (
                                    <div
                                        onClick={() => {
                                            setSelectedGenre(item.name)
                                        }}
                                        id="genreTypes" className="py-1" key={index}>
                                        <span className="text-md w-full">{item.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="">

                    {user ? <button onClick={displayLogOutPage} className="button px-[20px] py-[5px]">{user}</button> : <Link to={"/login"}>
                        <button className="button px-[20px] py-[5px]">Login</button>
                    </Link>}

                    {(checkCount % 2 == 0) && (
                        <div className="py-2 border-2 absolute flex justify-center">
                            <Link to={"/login"}>
                                <button onClick={removeDetails} className="button px-[20px] py-[5px]">Log Out</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

Header.propTypes = {
    setSelectedGenre: Function,
};

export default Header;