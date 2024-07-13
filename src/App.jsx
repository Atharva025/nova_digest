import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import "../src/css/App.css";
import Login_Form from "./Login_Form";
import Sign_Up_Form from "./Sign_Up_Form";
import Genre from './Genre';
import Home_Page from "./Home_Page";
import News_Full from './News_Full';
import News_Card from './News_Card';
import About_Us from './About_Us';
// import Landing from './Landing';
import Loader from './Loader';
import { UserProvider } from './UserProvider';

function App() {
  return (
    <>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            {/* <Redirect exact from="/" to="/login" /> */}
            <Route path="/loader" element={<Loader />} />

            <Route path="/login" element={<Login_Form />} />
            <Route path="/home" element={<Home_Page />} />


            <Route path="/sign_up" element={<Sign_Up_Form />} />
            <Route path="/genre_sign_up" element={<Genre />} />

            <Route path="/news/:title/:author/:content/:url/:urlToImage" element={<News_Full />} />
            <Route path="/news" element={<News_Card />} />
            <Route path="/about_us" element={<About_Us />} />
          </Routes>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;