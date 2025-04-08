import { Link } from "react-router-dom"

export default function Footer() {
    return (
        <footer className="bg-gray-100 py-12 flex items-center justify-center w-full text-center border-t border-gray-200">
            <div className="container max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
                {/* Company Info */}
                <div className="flex flex-col items-start gap-4">
                    <Link to="/" className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-200">
                        <MountainIcon className="w-6 h-6 text-blue-500" />
                        <span className="text-lg font-semibold">FPT Pet Care</span>
                    </Link>
                    <p className="text-gray-600 max-w-[300px] text-sm">
                        Dedicated pet care in Hanoi, with professional veterinary services and the best pet health care.
                    </p>
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} FPT Pet Care. All rights reserved.
                    </p>
                </div>

                {/* Social Links */}
                <div className="grid gap-2">
                    <h3 className="font-semibold text-gray-700">Follow Us</h3>
                    <div className="flex gap-4">
                        <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                            <FacebookIcon className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                            <TwitterIcon className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                            <InstagramIcon className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                            <LinkedinIcon className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Resources */}
                <div className="grid gap-2">
                    <h3 className="font-semibold text-gray-700">Resources</h3>
                    <Link to="/documentation" className="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm">
                        Documentation
                    </Link>
                    <Link to="/blog" className="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm">
                        Blog
                    </Link>
                    <Link to="/support" className="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm">
                        Support
                    </Link>
                    <Link to="/contact" className="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm">
                        Contact
                    </Link>
                </div>
            </div>

            {/* Google Map */}
            <div className="w-full mt-8 px-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Our Location in FPT University Hanoi</h3>
                <iframe
                    className="w-[640px] h-64 rounded-md shadow-md"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11640.246173409367!2d105.53450707708018!3d21.012262136159258!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abc60e7d3f19%3A0x2be9d7d0b5abcbf4!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1743965612599!5m2!1svi!2s"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </footer>
    )
}

function FacebookIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    )
}

function InstagramIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    )
}

function LinkedinIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    )
}

function MountainIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    )
}

function TwitterIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
    )
}
