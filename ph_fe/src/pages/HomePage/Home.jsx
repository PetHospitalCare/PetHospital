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
    return (
        <>
            <div className="relative h-screen">
                <Stickybutton></Stickybutton>
                <div className="absolute inset-0 -z-10">
                    <img
                        src="https://res.cloudinary.com/debx8syhr/image/upload/v1737554135/a42b4dc7074a1bd77c694dbc815a4ced_omkgkz.png"

                        className="w-full h-full object-cover"
                    />
                </div>
                <Header />
                <div className="absolute inset-0 flex flex-col items-center justify-start text-center text-gray-900 mt-32">
                    <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                        Veterinary Hospital
                    </h1>
                    <h2 className="text-xl font-medium mt-2 sm:text-2xl lg:text-3xl">
                        PET HEALTH CENTRE
                    </h2>
                </div>
            </div>
            <Carousel />
            <AboutSection></AboutSection>
            <Footer></Footer>
        </>
    );
}