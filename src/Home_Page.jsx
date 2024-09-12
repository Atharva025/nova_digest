import { useState, useEffect } from 'react';
import News_Card from './News_Card';
import "../src/css/Home_Page.css"
import Header from './Header';
import { useLocation } from "react-router-dom";
import "../src/css/Loader.css";
// import { configDotenv } from 'dotenv';

// configDotenv();

const Home_Page = () => {

    const [searchText, setSearchText] = useState("");
    const [news, setNews] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState([]);

    const location = useLocation();
    const { arr = [] } = location.state || {};


    useEffect(() => {
        if (arr.length > 0) {
            setGenres(arr);
        }
    }, [arr]);

    useEffect(() => {
        if (selectedGenre || genres.length > 0) {
            setLoading(true);
            const genre = selectedGenre || genres.join('&');
            const url = `https://newsapi.org/v2/everything?q=${genre}&sortBy=publishedAt&language=en&apiKey=dbd670c48d86436181733a293a881787`;
            var req = new Request(url);

            fetch(req)
                .then(response => response.json())
                .then(data => {
                    console.log(data.articles);
                    setNews(data.articles);
                })
                .catch(error => console.error('Error:', error))
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [selectedGenre, genres]);

    const handleMultipleEvents = () => {
        setSelectedGenre(searchText);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleMultipleEvents();
        }
    };

    return (
        <>
            <Header setSelectedGenre={setSelectedGenre} />
            <div>
                <div className="flex flex-col justify-between items-center">
                    <input id="search" className="w-[350px] h-10 mt-5 border-solid border-sky-700 border-2 rounded-xl lg:w-[550px] text-black" type="text" onChange={(e) => {
                        setSearchText(e.target.value);
                    }} value={searchText.toLowerCase()} placeholder="Search News Category" onKeyDown={handleKeyDown} />


                    <button onClick={handleMultipleEvents} className="button px-5 py-1 lg:my-2">Search</button>
                </div>

                {/* Render News_Card only if news is not null */}
                {loading ? (
                    <div className="flex justify-center items-center h-full">

                    </div>
                ) : news && <News_Card news={news} />}

            </div>
        </>
    )
}

export default Home_Page;
