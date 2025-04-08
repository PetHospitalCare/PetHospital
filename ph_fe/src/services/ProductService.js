import axios from "../axios";
const createProduct = (data) => {
  return axios.post(`/product/create`, data);

}
const deleteProduct = (id) => {
  return axios.delete(`/product/delete${id}`);

}
const getAllProduct = () => axios.get("/product/get-all");
const createCategory = (data) => {
  return axios.post(`/category/create`, data);

}
const getAllCategory = () => axios.get("/category/get-all");

const getProductById = (id) => axios.get(`/product/getById${id}`);
const updateProduct = (id, data) => {
  return axios.put(`/product/update/${id}`, data);
}

export const ProductService = {
  createProduct,
  getAllProduct,
  deleteProduct,
  createCategory,
  getAllCategory,
  getProductById,
  updateProduct
};
