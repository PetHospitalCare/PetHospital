import { useUserId } from "@/lib/common-util.js";
import { ShoppingCartService } from "@/services/ShoppingCartService.js";

export function useAddToCart() {
    const userId = useUserId();

    return (productInput, contextFunction) => {
        const tempUserId = userId || null;

        if (tempUserId) {
            // console.log("Adding to cart:", productInput, "User ID:", tempUserId);
            callAPIUpdateCart(tempUserId, productInput, contextFunction);
            // call api insert to cart and get response
        } else {
            updateLocalStorageShoppingCart(productInput, 'add', contextFunction);
        }
    };
}

async function callAPIUpdateCart(userIdInput, productInput, contextFunction) {
    const data = {
        product: productInput,
        order: 'add'
    }

    const response = await ShoppingCartService.updateShoppingCartByUserId(userIdInput, data);
    updateLocalStorageShoppingCart(response.data.savedShoppingCart, 'replace', null)
    contextFunction(response.data.savedShoppingCart.items.reduce((acc, item) => acc + (item.quantity || 0), 0));

    // console.log('response: ', response.data.savedShoppingCart.items);
}

function updateLocalStorageShoppingCart(productInput, order, contextFunction) {
    let localStorageShoppingCart = localStorage.getItem("cart") || null;

    if (order === 'add') {
        if (localStorageShoppingCart) {
            localStorageShoppingCart = JSON.parse(localStorageShoppingCart);

            const existingItem = localStorageShoppingCart.items.find(
                (item) => item.productId === productInput.productId
            );

            if (existingItem) {
                // Nếu sản phẩm đã tồn tại, tăng số lượng
                existingItem.quantity += productInput.quantity;
            } else {
                // Nếu chưa có, thêm sản phẩm mới
                localStorageShoppingCart.items.push(productInput);
            }
        } else {
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

    if (order === 'replace') {
        localStorageShoppingCart = productInput;
    }

    if (contextFunction !== undefined && contextFunction !== null) {
        contextFunction(localStorageShoppingCart.items.reduce((acc, item) => acc + (item.quantity || 0), 0));
    }

    localStorage.setItem("cart", JSON.stringify(localStorageShoppingCart));
}
