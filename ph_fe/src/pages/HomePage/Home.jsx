import * as React from "react"
import Header from "../../components/Header/Header"

export default function Home() {
    return (
        <>
            <div className="relative h-screen">
                <div className="absolute inset-0 -z-10">
                    <img
                        src="https://res.cloudinary.com/debx8syhr/image/upload/v1737554135/a42b4dc7074a1bd77c694dbc815a4ced_omkgkz.png"

                        className="w-full h-full object-cover"
                    />
                </div>
                <Header className="absolute top-0 left-0 w-full" />
                <div className="absolute inset-0 flex flex-col items-center justify-start text-center text-gray-900 mt-32">
                    <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                        Veterinary Hospital
                    </h1>
                    <h2 className="text-xl font-medium mt-2 sm:text-2xl lg:text-3xl">
                        PET HEALTH CENTRE
                    </h2>
                </div>
            </div>

        </>
    );
}