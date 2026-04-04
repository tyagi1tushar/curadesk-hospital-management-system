import React from 'react';
import Navbar from "../components/Navbar";
import Banner from '../components/Banner';
import Certification from '../components/Certification';
import HomeDoctors from '../components/HomeDoctors';
import Testimonial from '../components/Testimonial';
import Footer from '../components/Footer';


const Home = () => {
    return (
       <div className="min-h-screen bg-white bg-white transition-colors duration-300">
            <Navbar />
            <Banner />
            <Certification />
            <HomeDoctors />
            <Testimonial />
            <Footer />
            

        </div>
    );
};

export default Home;