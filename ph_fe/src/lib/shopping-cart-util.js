import { useUserId } from "@/lib/common-util.js";
import { ShoppingCartService } from "@/services/ShoppingCartService.js";
import { toast } from "sonner";

let isShowToast = true;

export function useAddToCart() {
    const userId = useUserId();

    return (productInput, contextFunction, contextFunction2, order, isShowToastInput) => {
        // add, subtract, delete, replace

        if (isShowToastInput !== undefined && isShowToastInput !== null && !isShowToastInput) {
            isShowToast = false;
        } else {
            isShowToast = true;
        }

        const tempUserId = userId || null;

        if (tempUserId) {
            // console.log("Adding to cart:", productInput, "User ID:", tempUserId);
            callAPIUpdateCart(tempUserId, productInput, contextFunction, contextFunction2, order);
            // call api insert to cart and get response
        } else {
            updateLocalStorageShoppingCart(productInput, order, contextFunction, contextFunction2);
        }
    };
}

async function callAPIUpdateCart(userIdInput, productInput, contextFunction, contextFunction2, order) {
    const data = {
        product: productInput,
        order: order || ''
    }

    const response = await ShoppingCartService.updateShoppingCartByUserId(userIdInput, data);

    updateLocalStorageShoppingCart(response.data.savedShoppingCart, 'replace', null, null);

    if (contextFunction && response?.data?.savedShoppingCart?.items?.length > 0) {
        contextFunction(response.data.savedShoppingCart.items?.length || 0);

        if (order === 'add' && isShowToast) {
            toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
        }
    } else if (contextFunction) {
        contextFunction(0);
    }

    if (contextFunction2 !== undefined && contextFunction2 !== null) {
        contextFunction2();
    }
}

function updateLocalStorageShoppingCart(productInput, order, contextFunction, contextFunction2) {
    let localStorageShoppingCart = localStorage.getItem("cart") || null;

    if (order === 'add' || order === 'subtract') {
        if (localStorageShoppingCart) {
            localStorageShoppingCart = JSON.parse(localStorageShoppingCart);

            const existingItem = localStorageShoppingCart.items.find(
                (item) => item.productId === productInput.productId
            );

            if (order === 'add') {
                if (existingItem) {
                    // Nếu sản phẩm đã tồn tại, tăng số lượng
                    existingItem.quantity += productInput.quantity;
                } else {
                    // Nếu chưa có, thêm sản phẩm mới
                    localStorageShoppingCart.items.push(productInput);
                }

                if (isShowToast) {
                    toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
                }
            } else if (order === 'subtract') {
                if (existingItem) {
                    // Nếu sản phẩm đã tồn tại, giảm số lượng
                    existingItem.quantity -= productInput.quantity;

                    if (existingItem.quantity <= 0) {
                        const index = localStorageShoppingCart.items.findIndex(item => item.productId === existingItem.productId);

                        if (index > -1) {
                            localStorageShoppingCart.items.splice(index, 1);
                        }
                    }
                }
            }

        } else {
            if (order === 'add') {
                localStorageShoppingCart = {
                    "items": [
                        productInput,
                    ],
                    "totalPrice": 0,
                    "createdAt": new Date().toISOString(),
                    "updatedAt": new Date().toISOString(),
                    "status": 0,
                    "shipFee": 20000.0,
                    "address": ""
                }
            }
        }
    }

    if (order === 'replace') {
        if (!productInput || productInput.deletedCount > 0) {
            localStorageShoppingCart = null;
        } else if (productInput) {
            localStorageShoppingCart = productInput;
        }
    }

    if (order === 'delete') {
        if (localStorageShoppingCart) {
            localStorageShoppingCart = JSON.parse(localStorageShoppingCart);

            const index = localStorageShoppingCart?.items?.findIndex(item => item.productId === productInput.productId);

            if (index > -1) {
                localStorageShoppingCart.items.splice(index, 1);
            }
        }
    }

    if (localStorageShoppingCart && localStorageShoppingCart?.items?.length > 0) {
        localStorage.setItem("cart", JSON.stringify(localStorageShoppingCart));
    } else {
        localStorage.removeItem("cart");
    }

    if (contextFunction !== undefined && contextFunction !== null) {
        if (localStorageShoppingCart && localStorageShoppingCart?.items?.length > 0) {
            contextFunction(localStorageShoppingCart?.items?.length || 0);
        } else {
            contextFunction(0);
        }
    }

    if (contextFunction2 !== undefined && contextFunction2 !== null) {
        contextFunction2();
    }
}
