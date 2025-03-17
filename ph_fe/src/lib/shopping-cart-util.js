import { useUserId } from "@/lib/common-util.js";
import { ShoppingCartService } from "@/services/ShoppingCartService.js";

export function useAddToCart() {
    const userId = useUserId();

    return (productInput, contextFunction) => {
        const tempUserId = userId || null;

        if (tempUserId) {
            console.log("Adding to cart:", productInput, "User ID:", tempUserId);
            callAPIUpdateCart(tempUserId, productInput, contextFunction);
            // call api insert to cart and get response
        } else {
            // update localStorage cart
        }
    };
}

async function callAPIUpdateCart(userIdInput, productInput, contextFunction) {
    const data = {
        product: productInput,
        order: 'add'
    }

    const response = await ShoppingCartService.updateShoppingCartByUserId(userIdInput, data);
    updateLocalStorageShoppingCart(response.data.savedShoppingCart, 'replace')
    contextFunction(response.data.savedShoppingCart.items.reduce((acc, item) => acc + item.quantity, 0));

    console.log('response: ', response.data.savedShoppingCart.items);
}

function updateLocalStorageShoppingCart(productInput, order) {
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
                "createdAt": "2025-03-11T12:00:00.000Z",
                "updatedAt": "2025-03-11T12:00:00.000Z",
                "status": 0,
                "shipFee": 20000.0,
                "address": "Hanoi"
            }
        }
    }

    if (order === 'replace') {
        localStorageShoppingCart = productInput;
    }

    localStorage.setItem("cart", JSON.stringify(localStorageShoppingCart));
    localStorage.setItem("cartCount", localStorageShoppingCart?.items?.reduce((acc, item) => acc + (item.quantity || 0), 0));
}
