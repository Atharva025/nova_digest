import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import "../src/css/News_Card.css";
import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';

const News_Card = ({ news }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNews = news.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    }

    return (
        <>
            <div id="newsCardContainer" className="flex flex-wrap gap-6 mt-5 justify-center items-center align-middle">
                {loading ? (
                    Array.from(new Array(itemsPerPage)).map((_, index) => (
                        <Skeleton key={index} variant="rectangular" width={300} height={350} className="lg:rounded-lg" />
                    ))
                ) : (
                    Array.isArray(currentNews) && currentNews.map((item, index) => (
                        item ? (
                            <Link to={{
                                pathname: `/news/${encodeURIComponent(item.title)}/${encodeURIComponent(item.author)}/${encodeURIComponent(item.content)}/${encodeURIComponent(item.url)}/${encodeURIComponent(item.urlToImage)}`,
                                state: item
                            }} key={index}>
                                <Card style={{ boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2), 0 12px 24px rgba(0, 0, 0, 0.2)" }} className="lg:h-[350px] lg:w-[350px] lg:rounded-lg" sx={{ maxWidth: 300 }}>
                                    <CardActionArea >
                                        <CardMedia
                                            component="img"
                                            className="h-[90px] w-[12rem] lg:w-full lg:h-[150px]"
                                            image={item.urlToImage ? item.urlToImage : "Error Loading the Image"}
                                            alt="news image"
                                        />
                                        <CardContent>
                                            <Typography className="text-center text-xs font-bold lg:font-bold">
                                                {item.title ? item.title : "No Title for this news"}
                                            </Typography>
                                            <Typography style={{ fontWeight: "bold" }} className="text-center text-xs">
                                                {item.author ? item.author : "Anonymous"}
                                            </Typography>
                                            <Typography className="text-xs w-full sm:w-full" color="text.secondary">
                                                {item.description && item.description.substring(0, 90) + "..."}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Link>
                        ) : (
                            <Skeleton variant='rectangular' key={index} width={300} height={350} className="lg:rounded-lg" />
                        )
                    ))
                )}
            </div>
            <Pagination className="flex justify-center mt-4 text-white" color='primary' count={5} page={currentPage} onChange={handlePageChange} />
        </>
    )
}

News_Card.propTypes = {
    news: PropTypes.array.isRequired,
};

export default News_Card;