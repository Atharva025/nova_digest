import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "../src/css/News_Full.css";
import Footer from './Footer';
import Header from './Header';
import Comments from './Comments';

const News_Full = () => {
    const { title, author, content, url, urlToImage, publishedAt } = useParams();
    const decodedTitle = decodeURIComponent(title);
    const decodedAuthor = decodeURIComponent(author);
    const decodedContent = decodeURIComponent(content);
    const decodedUrl = decodeURIComponent(url);
    const decodedUrlToImage = decodeURIComponent(urlToImage);
    const decodedPublishedAt = decodeURIComponent(publishedAt);

    console.log(decodedTitle);
    console.log(decodedAuthor);
    console.log(decodedContent);
    console.log(decodedUrl);
    console.log(decodedPublishedAt);

    const [des, setDes] = useState("");
    const [loadingText, setLoadingText] = useState("");
    const [showText, setShowText] = useState(false);
    const [showDots, setShowDots] = useState(true);
    const readMore = document.getElementById("readMore");
    const readLess = document.getElementById("readLess");
    function showReadMore() {
        readMore.style.display = "none";
        readLess.style.display = "block";
        setShowText(true);
        setLoadingText(des ?
            des.substring(des.indexOf(' ', 1005))
            : "Error")
        setShowDots(false);
    }

    function showReadLess() {
        readMore.style.display = "block";
        setShowText(false);
        readLess.style.display = "none";
        setShowDots(true);
    }

    useEffect(() => {
        fetch(`https://cors-anywhere.herokuapp.com/${decodedUrl}`).then(response => response.text()).then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const paragraphs = doc.querySelectorAll('p');
            let textContent = '';
            paragraphs.forEach(paragraph => {
                textContent += paragraph.textContent;
            });
            setDes(textContent);
            console.log(textContent);
        })
            .catch(error => console.error('Error:', error));
    }, [decodedUrl]);

    return (
        <>
            <Header />
            <div className="mt-5 flex justify-center text-center flex-wrap flex-col items-center align-middle">
                <div className="justify-center items-center">
                    <h2 className="text-md font-semibold lg:text-3xl">{decodedTitle ? decodedTitle : "No title for this news"}</h2>
                    <h2>By: {decodedAuthor ? decodedAuthor : "No Author"}</h2>
                    <div className="flex flex-wrap justify-center items-center align-center flex-col">
                        <img className="w-[450px] h-[350px] lg:w-full lg:h-[500px]" src={decodedUrlToImage ? decodedUrlToImage : "Error Loading Image"} alt="" />
                        <div className="flex flex-col lg:w-[70rem]">
                            <span className="md:text-xl inline-block leading-[30px] lg:leading-[35px] text-justify w-[450px] md:w-[650px] lg:w-full">{des && des.length > 1000 ? des.substring(0, des.lastIndexOf(".", 1000)) + (showDots === true ? "..." : "") : "No Url"}</span>
                        </div>

                        <button id="readMore" className='button lg:px-[20px] lg:h-[40px]' onClick={showReadMore}>Read More</button>
                        <div className="flex flex-col lg:w-[70rem]">
                            <span className="md:text-xl lg:leading-[40px] text-justify w-[450px] md:w-[650px] lg:w-full">{showText && (
                                loadingText
                            )}</span>
                        </div>

                        <button style={{ display: "none" }} onClick={showReadLess} id="readLess" className='button lg:px-[20px] lg:h-[40px]'>Show Less</button>
                    </div>
                </div>
            </div>
            <Comments />
        </>
    );
};

export default News_Full;
