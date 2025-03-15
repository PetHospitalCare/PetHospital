import * as React from "react";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useMemo, useState} from "react";
import {UserContext} from "@/contexts/UserContext.jsx";
// import {ShoppingCartContext} from "@/contexts/ShoppingCartContext.jsx";
import {ShoppingCartService} from "@/services/ShoppingCartService.js";

export default function ShoppingCartButton() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    // const {setDataCartContext} = useContext(ShoppingCartContext);
    const [cart, setCart] = useState({});
    // const shoppingCartCount = useMemo(() => cart.items.reduce((acc, item) => acc + item.quantity, 0), [cart.items]);
    // const shoppingCartCount = useMemo(() => {
    //     if (!cart.items) return 0;
    //     return cart.items.reduce((acc, item) => acc + item.quantity, 0);
    // }, [cart]);

    const [shoppingCartCount, setShoppingCartCount] = useState(0);


    useEffect(() => {
        makeData()
    }, []);

    const makeData = async () => {
        if (user && user._id) {
            // call api get card data
            const response = await ShoppingCartService.getShoppingCartByUserId(user._id);

            if (response.data.success) {
                console.log('shoppingCart: ', response.data.shoppingCart);
                // setDataCartContext(...response.data.shoppingCart);
                setCart(response.data?.shoppingCart?.[0])

                if(response.data?.shoppingCart?.[0]?.items){
                    setShoppingCartCount(response.data?.shoppingCart?.[0].items.reduce((acc, item) => acc + item.quantity, 0));
                }
            }
        } else {
            // get and set card data by localStorage
        }
    }

    const handleGoToShoppingCartDetail = () => {
        navigate(`/shopping-cart-detail`);
    }

    return (
        <button className="relative p-2 bg-white text-black rounded-[10px] border border-gray-300" onClick={() => handleGoToShoppingCartDetail()}>
            <i className="fas fa-shopping-cart text-lg"></i>

            {shoppingCartCount >= 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border border-white">
                    {shoppingCartCount}
                </span>
            )}
        </button>
    );
}
