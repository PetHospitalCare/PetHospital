import * as React from "react"
import Header from "../../components/Header/Header"

export default function Home() {
    return (
        <>
            <div className="relative h-screen">
                <div className="absolute inset-0 -z-10">
                    <img
                        src="https://s3-alpha-sig.figma.com/img/c921/8bcc/a42b4dc7074a1bd77c694dbc815a4ced?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ow2zlB0i08mHcso0jf4kLrBbEOxamaNZyUGYl9dEV1fwqIHHKgMLORSUI8~g1TUV-rknD7YxYpUDXJFcsG-WeLjVNHgaG7M-~oWLUM3owFwUVwJ3GQBIiCqWTOIZhEjuyWajwIVLzAw0Y9j0bMJNvZGo1xao-lNuIcYrLdxq76WFwRTgix35~IX9b8j6KhEfEUJHNOHHAATnVQ24MqsxCJJXiCo9GvvIEh8vECgMJXy81tdHS65uXSSPL0HkwLYxAMnjiDdJD1mcFxNFNHLP~jabex7OYfZsUtJrGbvI4JcDJ8sCU-OhbFEv9S-9yLh8Y20h1Cm-vECEnUKVzEOWxA__"

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