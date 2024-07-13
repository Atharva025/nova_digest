import "../src/css/Genre.css"
import Genres from "../src/components/Genre_Types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Genre = () => {
    const [arr, setArr] = useState([]);
    const navigate = useNavigate();

    const handleSelectGenre = (genreName) => {
        if (arr.includes(genreName)) {
            setArr(arr.filter(name => name !== genreName));
        } else {
            setArr([...arr, genreName]);
        }
    }

    return (
        <>
            <div id="genreContainer" className="h-[100vh] flex flex-col text-center">
                <h1 className="text-4xl mt-5">One Last Step!</h1>
                <div className="rounded-lg flex flex-col justify-center flex-wrap items-center genreBind">
                    <h2 className="text-sm my-3 sm:text-lg md:text-xl lg:text-2xl">Please Select what you would read! </h2>
                    <span className="text-md">Click on a Genre to Select it. Click Again to De-Select it.</span>

                    <span>
                        <span className="font-semibold text-md">Your Genres: </span>
                        {arr.map((item, index) => (
                            <>
                                <span className="text-md" key={index}>
                                    {item + ", "}
                                </span>
                            </>
                        ))}
                    </span>

                    <div className="flex my-5 flex-wrap justify-center">
                        {Genres.map((item, index) => {
                            return (<>
                                <div onClick={() => handleSelectGenre(item.name)} style={{ backgroundImage: `url(${item.image})` }} className={`h-[10rem] border rounded-lg w-full flex justify-center flex-col genreImage md:w-[40rem] md:h[40rem] lg:w-[25rem] lg:h-[20rem] lg:flex-row`} key={index}>
                                    <h2 className="genreText">{item.name}</h2>
                                </div>
                            </>)
                        })}

                    </div>
                    <button
                        onClick={() => {
                            (arr && arr.length > 1) ? navigate("/home", { state: { arr } }) : alert("Please Select atleast 2 Genres!")
                        }}
                        className="button mb-2">Done</button>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Genre;