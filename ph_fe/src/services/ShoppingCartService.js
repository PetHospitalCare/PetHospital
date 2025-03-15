import axios from "../axios";

const createShoppingCart = (data) => {
    return axios.post(`/shopping-cart/create`, data);

}

const deleteShoppingCart = (id) => {
    return axios.delete(`/shopping-cart/delete${id}`);
}

const getShoppingCartByUserId = (userId) => axios.get(`/shopping-cart/get-card${userId}`);

const updateShoppingCart = (id) => {
    return axios.put(`/shopping-cart/update${id}`);
}

export const ShoppingCartService = {
    createShoppingCart,
    deleteShoppingCart,
    getShoppingCartByUserId,
    updateShoppingCart
};
