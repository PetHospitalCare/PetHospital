import { Link } from "react-router-dom"

export default function Footer() {
    return (
        <footer className="bg-muted py-12 flex items-center justify-center w-full text-center">
            <div className="container max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-start gap-4">
                    <Link href="#" className="flex items-center gap-2" prefetch={false}>
                        <MountainIcon className="w-6 h-6" />
                        <span className="text-lg font-semibold">Pet Hospital System</span>
                    </Link>
                    <p className="text-muted-foreground max-w-[300px]">
                        Beautifully designed components that you can copy and paste into your apps.
                    </p>
                </div>
                <div className="grid gap-2">
                    <h3 className="font-semibold">Follow Us</h3>
                    <div className="flex gap-4">
                        <Link href="#" className="text-muted-foreground hover:underline" prefetch={false}>
                            <TwitterIcon className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:underline" prefetch={false}>
                            <FacebookIcon className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:underline" prefetch={false}>
                            <InstagramIcon className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:underline" prefetch={false}>
                            <LinkedinIcon className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
                <div className="grid gap-2">
                    <h3 className="font-semibold">Resources</h3>
                    <Link href="#" className="text-muted-foreground hover:underline" prefetch={false}>
                        Documentation
                    </Link>
                    <Link href="#" className="text-muted-foreground hover:underline" prefetch={false}>
                        Blog
                    </Link>
                    <Link href="#" className="text-muted-foreground hover:underline" prefetch={false}>
                        Support
                    </Link>
                    <Link href="#" className="text-muted-foreground hover:underline" prefetch={false}>
                        Contact
                    </Link>
                </div>
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