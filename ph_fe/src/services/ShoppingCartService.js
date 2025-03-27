import axios from "../axios";

const createShoppingCart = (data) => {
    return axios.post(`/shopping-cart/create`, data);

}

const deleteShoppingCart = (id) => {
    return axios.delete(`/shopping-cart/delete${id}`);
}

const getShoppingCartByUserId = (userId) => axios.get(`/shopping-cart/get-card${userId}`);

const updateShoppingCartByUserId = (userId, data) => {
    return axios.put(`/shopping-cart/update${userId}`, data);
}

const paymentShoppingCartByUserId = (userId, data) => {
    return axios.post(`/payment/vnpay${userId}`, data);
}

export const ShoppingCartService = {
    createShoppingCart,
    deleteShoppingCart,
    getShoppingCartByUserId,
    updateShoppingCartByUserId,
    paymentShoppingCartByUserId
};
