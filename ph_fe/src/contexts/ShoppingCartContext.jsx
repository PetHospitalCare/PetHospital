import React, { useState } from "react";

const ShoppingCartContext = React.createContext(null);

const ShoppingCartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    const setDataCartContext = (data) => {
        setCartCount(data);
    };

    return (
        <ShoppingCartContext.Provider value={{ cartCount, setDataCartContext }}>
            {children}
        </ShoppingCartContext.Provider>
    );
};

export { ShoppingCartContext, ShoppingCartProvider };
