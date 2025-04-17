import React, { useState } from "react";

const ShoppingCartContext = React.createContext(null);

const ShoppingCartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [isChangeCart, setIsChangeCart] = useState(true);

    const setDataCartContext = (data) => {
        setCartCount(data);
    };

    const setDataIsChangeCartContext = () => {
        setIsChangeCart(!isChangeCart);
    };

    return (
        <ShoppingCartContext.Provider value={{ cartCount, setDataCartContext, isChangeCart, setDataIsChangeCartContext }}>
            {children}
        </ShoppingCartContext.Provider>
    );
};

export { ShoppingCartContext, ShoppingCartProvider };
