import React, { useState } from "react";

const ShoppingCartContext = React.createContext(null);

const ShoppingCartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [isChangeCard, setIsChangeCard] = useState(true);

    const setDataCartContext = (data) => {
        setCartCount(data);
    };

    const setDataIsChangeCartContext = () => {
        setIsChangeCard(!isChangeCard);
    };

    return (
        <ShoppingCartContext.Provider value={{ cartCount, setDataCartContext, isChangeCard, setDataIsChangeCartContext }}>
            {children}
        </ShoppingCartContext.Provider>
    );
};

export { ShoppingCartContext, ShoppingCartProvider };
