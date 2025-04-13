import * as React from "react"

import { Button } from "@/components/ui/button"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState, useContext, useRef } from "react";
import ShoppingCartButton from "@/components/shared/shopping-cart-button.jsx";
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/react'
import {
    ArrowPathIcon,
    Bars3Icon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
const products = [
    { name: 'Analytics', description: 'Get Link better understanding of your traffic', to: '/', icon: ChartPieIcon },
    { name: 'Engagement', description: 'Speak directly to your customers', to: '/', icon: CursorArrowRaysIcon },
    { name: 'Security', description: 'Your customers’ data will be safe and secure', to: '/', icon: FingerPrintIcon },
    { name: 'Integrations', description: 'Connect with third-party tools', to: '/', icon: SquaresPlusIcon },
    { name: 'Automations', description: 'Build strategic funnels that will convert', to: '/', icon: ArrowPathIcon },
]
const callsToAction = [
    { name: 'Watch demo', to: '/', icon: PlayCircleIcon },
    { name: 'Contact sales', to: '/', icon: PhoneIcon },
]
const tempCategories = [
    { name: 'Thực phẩm', description: 'Thức ăn dành cho chó và mèo', to: '/product/1' },
    { name: 'Thực phẩm bổ sung', description: 'Các sản phẩm bổ sung dinh dưỡng và các chất cho chó mèo', to: '/product/2' },
    { name: 'Phụ kiện', description: 'Các phụ kiện dành cho chó mèo: lược, sữa tắm, dầu thơm, dây, chuồng, cát', to: '/product/3' },
    { name: 'Thuốc', description: 'Các sản phẩm trị bệnh cho chó mèo', to: '/product/4' },
    { name: 'Pate', description: 'Pate dành cho chó mèo', to: '/product/5' },
]
import DropdownMenuDemo from "../avatardropdown/avatardropdown"
import { UserContext } from "../../contexts/UserContext";
import { ProductService } from "@/services/ProductService.js";
export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false);
    const { user } = useContext(UserContext);
    const [categories, setCategories] = useState(tempCategories);
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await ProductService.getAllCategory()
            if (response.data.success) {
                setCategories(
                    response.data.categories.sort((a, b) => a.sort_number - b.sort_number)
                        .map((category) => ({
                            name: category.name,
                            description: category.description,
                            to: '/product?category_id=' + category._id,
                        }))
                );
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh mục:", error);
        }
    };

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 300);
    };
    // Handle navigation to sections
    const scrollToSection = (sectionId) => {
        // If we're already on the home page
        if (location.pathname === '/') {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // If we're not on the home page, navigate to home page with hash
            navigate(`/#${sectionId}`);
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
    ${isScrolled ? "bg-[#FAF7F1] shadow-md" : "bg-transparent"}`}
        >
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                            alt=""
                            src="/pethospital.png"
                            className="h-12 w-auto pointer-events-none select-none"
                        // onContextMenu="return false;"
                        // onDrag="retrun false;"

                        />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:gap-x-12">

                    <Link to="/" className="text-sm/6 font-semibold text-gray-900">
                        Trang chủ
                    </Link>

                    <button
                        onClick={() => scrollToSection('about-section')}
                        className="text-sm/6 font-semibold text-gray-900 cursor-pointer"
                    >
                        Giới thiệu
                    </button>

                    <button
                        onClick={() => scrollToSection('services-section')}
                        className="text-sm/6 font-semibold text-gray-900 cursor-pointer"
                    >
                        Dịch vụ
                    </button>


                    <Link to="/product" className="text-sm/6 font-semibold text-gray-900">
                        Cửa hàng
                    </Link>
                    <button
                        onClick={() => scrollToSection('contact-section')}
                        className="text-sm/6 font-semibold text-gray-900 cursor-pointer"
                    >
                        Liên hệ
                    </button>
                    {/* 
                    <Link to="/test" className="text-sm/6 font-semibold text-gray-900">
                        Liên hệ
                    </Link> */}
                </PopoverGroup>
                <div className="overflow-hidden lg:flex lg:flex-1 lg:justify-center border:">
                    {user ? (<DropdownMenuDemo user={user}></DropdownMenuDemo>)
                        :
                        <Link
                            to="/Login"
                            className="text-sm/6 font-semibold text-[#FFFFFF] bg-[rgb(63_46_46_/var(--tw-bg-opacity,1))] px-5 py-2.5 me-2 mb-2 rounded-full"
                        >
                            Đăng nhập <span aria-hidden="true"></span>
                        </Link>
                    }
                </div>
                <ShoppingCartButton />
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10" />
                <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                alt=""
                                src="https://s3-alpha-sig.figma.com/img/6b98/466f/83048c349c520f7bd104ff373dc0df0c?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SnvxEJk69zVxV0n0hUc4Zl-rFXcUF4fxzwq1-eRjEqa6naxayd08ZIOFi5-Ilm4BFjTdxx8mggpMiLYLYo-NCO4nLJ7YhKtZ0IYuT76Kq8wkb5VgulG0e5NvPPsefcDtQOMrgL9kkMUYBKPYav9y2ZLbbD0aIgCbpF6TL-RPltGgGB4i-GXLIOTc3JkTnZVqdsOXY8iG0ABzyGmx7w8itCucb2Ph48our9lD-3tSc4QZq4CPliEoDCK023zMiHYmhcjbbszqPsRm3U7mTIU7FEg~i1C9OVuo2VNNZqI-RnIbM6ABleWjIJ~J0d2riMvn8GQH9cu4DfnY-ofzexEV4g__"
                                className="h-8 w-auto"
                            />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>

                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <Link
                                    to="/"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Trang chủ
                                </Link>

                                <button
                                    onClick={() => {
                                        scrollToSection('about-section');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 w-full text-left"
                                >
                                    Giới thiệu
                                </button>

                                <button
                                    onClick={() => {
                                        scrollToSection('services-section');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 w-full text-left"
                                >
                                    Dịch vụ
                                </button>

                                <Link
                                    to="/product"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Cửa hàng
                                </Link>

                                <button
                                    onClick={() => {
                                        scrollToSection('contact-section');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 w-full text-left"
                                >
                                    Liên hệ
                                </button>
                            </div>
                            <div className="py-6">
                                {user ? (
                                    <DropdownMenuDemo user={user} />
                                ) : (
                                    <Link
                                        to="/Login"
                                        className="text-sm/6 font-semibold text-[#FFFFFF] bg-[rgb(63_46_46_/var(--tw-bg-opacity,1))] px-5 py-2.5 me-2 mb-2 rounded-full"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Đăng nhập
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
}