import React, { useState } from "react";

const ShoppingCartContext = React.createContext(null);

const ShoppingCartProvider = ({ children }) => {
    const [cart, setCart] = useState({});

    const setDataCartContext = (data) => {
        setCart(...data);
    };

    return <ShoppingCartContext.Provider value={{ cart, setDataCartContext }}>{children}</ShoppingCartContext.Provider>;
};

export { ShoppingCartContext, ShoppingCartProvider };
