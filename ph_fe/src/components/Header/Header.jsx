import * as React from "react"

import { Button } from "@/components/ui/button"
import {Link, useLocation, useNavigate} from "react-router-dom"
import { useEffect, useState, useContext } from "react";
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
    { name: 'Thực phẩm bổ sung', description: 'Các sản phẩm bổ sung dinh dưỡng và các chất cho chó mèo', to: '/product/2'},
    { name: 'Phụ kiện', description: 'Các phụ kiện dành cho chó mèo: lược, sữa tắm, dầu thơm, dây, chuồng, cát', to: '/product/3' },
    { name: 'Thuốc', description: 'Các sản phẩm trị bệnh cho chó mèo', to: '/product/4' },
    { name: 'Pate', description: 'Pate dành cho chó mèo', to: '/product/5' },
]
import DropdownMenuDemo from "../avatardropdown/avatardropdown"
import { UserContext } from "../../contexts/UserContext";
import {ProductService} from "@/services/ProductService.js";
export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false);
    const { user } = useContext(UserContext);
    const [categories, setCategories] = useState(tempCategories);

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
                            to: '/product?category_id=' + category.category_id,
                        }))
                );
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh mục:", error);
        }
    };

    const handleLinkToProductPage = () => {
        if (location.pathname !== '/product') {
            navigate('/product');
        }
    }

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
                            src="https://res.cloudinary.com/debx8syhr/image/upload/v1737553727/icon-removebg-preview_wtwzby.png"
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
                    <Popover className="relative">
                        <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                            Menu
                            <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                        </PopoverButton>

                        <PopoverPanel
                            transition
                            className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                            <div className="p-4">
                                {products.map((item) => (
                                    <div
                                        key={item.name}
                                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                                    >
                                        <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                            <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                                        </div>
                                        <div className="flex-auto">
                                            <Link to={item.to} className="block font-semibold text-gray-900">
                                                {item.name}
                                                <span className="absolute inset-0" />
                                            </Link>
                                            <p className="mt-1 text-gray-600">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                                {callsToAction.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.to}
                                        className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                                    >
                                        <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </PopoverPanel>
                    </Popover>

                    <Link to="/" className="text-sm/6 font-semibold text-gray-900">
                        About us
                    </Link>
                    <Link to="/" className="text-sm/6 font-semibold text-gray-900">
                        Our Services
                    </Link>
                    {/*<Link to="/product" className="text-sm/6 font-semibold text-gray-900">*/}
                    {/*    Product*/}
                    {/*</Link>*/}

                    <Popover className="relative">
                        <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900" onClick={handleLinkToProductPage}>
                            Product
                            <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                        </PopoverButton>

                        <PopoverPanel
                            transition
                            className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                            {categories?.length > 0 && <div className="p-4">
                                {categories.map((item) => (
                                    <div
                                        key={item.name}
                                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                                    >
                                        <div className="flex-auto">
                                            <Link to={item.to} className="block font-semibold text-gray-900">
                                                {item.name}
                                                <span className="absolute inset-0" />
                                            </Link>
                                            <p className="mt-1 text-gray-600">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            }
                        </PopoverPanel>
                    </Popover>

                    <Link to="/test" className="text-sm/6 font-semibold text-gray-900">
                        Contact
                    </Link>
                </PopoverGroup>
                <div className="overflow-hidden lg:flex lg:flex-1 lg:justify-end">
                    {user ? (<DropdownMenuDemo user={user}></DropdownMenuDemo>)
                        :
                        (<Link to="/Login" className="text-sm/6 font-semibold text-gray-900">
                            Log in <span aria-hidden="true">&rarr;</span>
                        </Link>)}


                </div>

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
                                <Disclosure as="div" className="-mx-3">
                                    <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                        Product
                                        <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-[open]:rotate-180" />
                                    </DisclosureButton>
                                    <DisclosurePanel className="mt-2 space-y-2">
                                        {[...products, ...callsToAction].map((item) => (
                                            <DisclosureButton
                                                key={item.name}
                                                as="Link"
                                                to={item.to}
                                                className="block rounded-lg py-2 pl-6 pr-3 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                                            >
                                                {item.name}
                                            </DisclosureButton>
                                        ))}
                                    </DisclosurePanel>
                                </Disclosure>
                                <Link
                                    to="/"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    About us
                                </Link>
                                <Link
                                    to="/"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Our services
                                </Link>
                                <Link
                                    to="/"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Comunity
                                </Link>
                                <Link
                                    to="/"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Contact
                                </Link>
                            </div>
                            <div className="py-6">
                                <Link
                                    to="/Login"
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Log in
                                </Link>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
}