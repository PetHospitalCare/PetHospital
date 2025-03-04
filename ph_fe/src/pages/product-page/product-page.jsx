import * as React from "react"
import Header from "../../components/Header/Header"
// import Carousel from "@/components/carousel/carousel";
import { useEffect, useState } from "react";
// import AboutSection from "@/components/aboutus/aboutus";
import Footer from "@/components/footer/footer";
import Stickybutton from "@/components/stickybutton";
export default function ProductPage() {
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

                <div className="absolute inset-0 -z-10">
                    <img
                        src="https://res.cloudinary.com/debx8syhr/image/upload/v1737554135/a42b4dc7074a1bd77c694dbc815a4ced_omkgkz.png"

                        className="w-full h-full object-cover"
                    />
                </div>
                <Header />



            </div>
            <Stickybutton></Stickybutton>
            {/*<Carousel />*/}
            {/*<AboutSection></AboutSection>*/}
            <Footer></Footer>
        </>
    );
}