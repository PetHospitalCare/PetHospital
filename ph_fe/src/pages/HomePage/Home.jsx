import * as React from "react"
import Header from "../../components/Header/Header"
import Carousel from "@/components/carousel/carousel"; 
import { useEffect, useState } from "react";
import AboutSection from "@/components/aboutus/aboutus";
import Footer from "@/components/footer/footer";
import Stickybutton from "@/components/stickybutton";

export default function Home() {
    const [isScrolled, setIsScrolled] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
    // Handle hash navigation when the page loads
    useEffect(() => {
        // Check if there's a hash in the URL
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                // Wait a bit for the page to fully load before scrolling
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        }
    }, []);
    
    return (
        <>
            <div className="relative h-screen">
                <div className="absolute inset-0 -z-10">
                    <img
                        src="https://res.cloudinary.com/debx8syhr/image/upload/v1737554135/a42b4dc7074a1bd77c694dbc815a4ced_omkgkz.png"
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-start text-center text-gray-900 mt-32">
                    <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                        Veterinary Hospital
                    </h1>
                    <h2 className="text-xl font-medium mt-2 sm:text-2xl lg:text-3xl">
                        PET HEALTH CENTRE
                    </h2>
                </div>
            </div>
            
            {/* Add id to the about section */}
            <div id="about-section">
                <AboutSection />
            </div>

            {/* Add id to the service section */}
            <div id="services-section">
                <Carousel />
            </div>
            
        </>
    );
}