import "../src/css/Loader.css";
import PropTypes from 'prop-types';
const Loader = ({ size }) => {
    const loaderSize = size === "small" ? "50px" : "100px";
    return (
        <>
            <div>
                <div className="container" style={{ width: loaderSize, height: loaderSize }}>
                </div>
            </div>
        </>
    )
}

Loader.propTypes = {
    size: PropTypes.string,
}

export default Loader
