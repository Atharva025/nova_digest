import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "../src/css/News_Full.css";
import Header from './Header';
import Comments from './Comments';
import { Helmet } from 'react-helmet';

const News_Full = () => {
    const { title, author, content, url, urlToImage, publishedAt } = useParams();
    const decodedTitle = decodeURIComponent(title);
    const decodedAuthor = decodeURIComponent(author);
    const decodedContent = decodeURIComponent(content);
    const decodedUrl = decodeURIComponent(url);
    const decodedUrlToImage = decodeURIComponent(urlToImage);
    const decodedPublishedAt = decodeURIComponent(publishedAt);

    // States
    const [des, setDes] = useState("");
    const [loadingText, setLoadingText] = useState("");
    const [showText, setShowText] = useState(false);
    const [showDots, setShowDots] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [twitterEmbeds, setTwitterEmbeds] = useState([]);
    const [instagramEmbeds, setInstagramEmbeds] = useState([]);

    // Functions to toggle Read More/Less
    const showReadMore = () => {
        setShowText(true);
        setLoadingText(des ? des.substring(des.indexOf(' ', 1005)) : "Error");
        setShowDots(false);
    };

    const showReadLess = () => {
        setShowText(false);
        setShowDots(true);
    };

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`https://cors-anywhere.herokuapp.com/${decodedUrl}`);
                const html = await response.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Scraping paragraphs for content
                const paragraphs = doc.querySelectorAll('p');
                let textContent = '';
                paragraphs.forEach(paragraph => {
                    textContent += paragraph.textContent;
                });
                setDes(textContent);

                // Scraping Twitter embeds
                const twitterEmbeds = [];
                const twitterBlocks = doc.querySelectorAll('blockquote.twitter-tweet');
                twitterBlocks.forEach(block => {
                    const twitterLink = block.querySelector('a').href;
                    twitterEmbeds.push(twitterLink);
                });
                setTwitterEmbeds(twitterEmbeds);

                // Scraping Instagram embeds
                const instagramEmbeds = [];
                const instagramBlocks = doc.querySelectorAll('blockquote.instagram-media, iframe[src*="instagram.com"]');
                instagramBlocks.forEach(block => {
                    if (block.tagName === 'BLOCKQUOTE') {
                        const instagramLink = block.querySelector('a').href;
                        instagramEmbeds.push(instagramLink);
                    } else if (block.tagName === 'IFRAME') {
                        instagramEmbeds.push(block.src);
                    }
                });
                setInstagramEmbeds(instagramEmbeds);

                setLoading(false); // Stop loading
            } catch (error) {
                console.error('Error:', error);
                setError("Unable to load content");
                setLoading(false);
            }
        };

        fetchContent();
    }, [decodedUrl]);

    useEffect(() => {
        if (window.twttr && twitterEmbeds.length > 0) {
            window.twttr.widgets.load(); // Initialize Twitter widgets
        }
    }, [twitterEmbeds]);

    return (
        <>
            <Helmet>
                <script async src="https://platform.twitter.com/widgets.js"></script>
            </Helmet>
            <Header />
            <div className="mt-5 flex justify-center text-center flex-wrap flex-col items-center align-middle">
                <div className="justify-center items-center">
                    <h2 className="text-md font-semibold lg:text-3xl text-white">{decodedTitle || "No title for this news"}</h2>
                    <h2>By: {decodedAuthor || "No Author"}</h2>
                    <div className="flex flex-wrap justify-center items-center align-center flex-col text-white">
                        <img
                            className="w-[450px] h-[350px] lg:w-full lg:h-[500px]"
                            src={decodedUrlToImage || "Error Loading Image"}
                            alt=""
                        />

                        {/* Loading and Error Handling */}
                        {loading ? (
                            <p>Loading content...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <div className="flex flex-col lg:w-[70rem]">
                                <span className="md:text-xl inline-block leading-[30px] lg:leading-[35px] text-justify w-[450px] md:w-[650px] lg:w-full">
                                    {des && des.length > 1000
                                        ? des.substring(0, des.lastIndexOf(".", 1000)) + (showDots ? "..." : "")
                                        : "No Url"}
                                </span>
                            </div>
                        )}

                        {/* Render Twitter Embeds */}
                        <div className="">
                            {twitterEmbeds.length > 0 && (
                                <div className="twitter-embeds">

                                    {twitterEmbeds.map((embed, index) => (
                                        <blockquote key={index} className="h-2">
                                            <a href={embed}></a>
                                        </blockquote>
                                    ))}
                                </div>
                            )}
                        </div>


                        {/* Render Instagram Embeds */}
                        {instagramEmbeds.length > 0 && (
                            <div className="instagram-embeds">

                                {instagramEmbeds.map((embed, index) => (
                                    <blockquote key={index} className="instagram-media">
                                        <a href={embed}></a>
                                    </blockquote>
                                ))}
                            </div>
                        )}

                        {/* Read More / Less Buttons */}
                        {!showText && !loading && (
                            <button
                                onClick={showReadMore}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                Read More
                            </button>
                        )}

                        {showText && (
                            <div className="flex flex-col lg:w-[70rem]">
                                <span className="md:text-xl lg:leading-[40px] text-justify w-[450px] md:w-[650px] lg:w-full">
                                    {loadingText}
                                </span>
                            </div>
                        )}

                        {showText && (
                            <button
                                onClick={showReadLess}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                Show Less
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <Comments />
        </>
    );
};

export default News_Full;
