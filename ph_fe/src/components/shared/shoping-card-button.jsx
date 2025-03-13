import * as React from "react";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";

export default function ShoppingCartButton({ shoppingCartCount }) {
    const navigate = useNavigate();

    const handleGoToShopingCardDetail = () => {
        navigate(`/shoping-card-detail`);
    }

    return (
        <button className="relative p-2 bg-white text-black rounded-[10px] border border-gray-300">
            <i className="fas fa-shopping-cart text-lg"></i>

            {shoppingCartCount >= 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border border-white">
                    {shoppingCartCount}
                </span>
            )}
        </button>
    );
}

ShoppingCartButton.propTypes = {
    shoppingCartCount: PropTypes.number.isRequired,
};
