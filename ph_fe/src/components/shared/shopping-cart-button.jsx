import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext.jsx";
import { ShoppingCartService } from "@/services/ShoppingCartService.js";
import { ShoppingCartContext } from "@/contexts/ShoppingCartContext.jsx";

export default function ShoppingCartButton() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { cartCount } = useContext(ShoppingCartContext);
    const [shoppingCartCount, setShoppingCartCount] = useState(0);

    useEffect(() => {
        makeData();
    }, [user]);

    useEffect(() => {
        updateCartCount();
    }, [cartCount]);

    const makeData = async () => {
        if (user && user._id) {
            // call api get card data
            const response = await ShoppingCartService.getShoppingCartByUserId(user._id);

            if (response.data.success) {

                if (response.data?.shoppingCart?.items) {
                    setShoppingCartCount(response.data?.shoppingCart?.items.reduce((acc, item) => acc + item.quantity, 0));
                }
            }
        } else {
            // get and set card data by localStorage
        }
    }

    const handleGoToShoppingCartDetail = () => {
        navigate(`/shopping-cart-detail`);
    }

    const updateCartCount = () => {
        setShoppingCartCount(cartCount);
    };

    return (
        <button className="relative p-2 bg-white text-black rounded-[10px] border border-gray-300"
            onClick={() => handleGoToShoppingCartDetail()}>
            <i className="fas fa-shopping-cart text-lg"></i>

            {shoppingCartCount >= 0 && (
                <span
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border border-white">
                    {shoppingCartCount}
                </span>
            )}
        </button>
    );
}
