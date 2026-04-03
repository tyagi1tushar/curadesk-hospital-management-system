import React from 'react';
import Navbar from "../components/Navbar";
import Banner from '../components/Banner';

const Home = () => {
    return (
       <div className="min-h-screen bg-white bg-white transition-colors duration-300">
            <Navbar />
            <Banner />
        </div>
    );
};

export default Home;