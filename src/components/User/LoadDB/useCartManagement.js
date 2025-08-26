import { ref } from "vue";

export default function useCartManagement() {
  const cart = ref([]);
  const actionResult = ref(null);
  const loading = ref(false);

  // Load cart từ localStorage
  const loadCart = () => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        cart.value = JSON.parse(saved);
      } else {
        cart.value = [];
      }
      console.log(
        "[useCartManagement] Cart loaded from localStorage:",
        cart.value
      );
    } catch (error) {
      console.error(
        "[useCartManagement] Error loading cart from localStorage:",
        error
      );
      cart.value = [];
    }
  };

  loadCart(); // Load ngay khi init composable

  // Lưu cart vào localStorage
  const saveCart = () => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart.value));
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      return true;
    } catch (error) {
      console.error(
        "[useCartManagement] Error saving cart to localStorage:",
        error
      );
      return false;
    }
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product, quantity = 1) => {
    try {
      console.log("[useCartManagement] Adding product to cart:", product);

      // Kiểm tra stock từ product
      const availableStock = product.soluong || product.stockQuantity || 0;

      const existingIndex = cart.value.findIndex(
        (item) =>
          item.id === (product.id_sp || product.id) &&
          item.variant === formatVariant(product)
      );

      let newQuantity = quantity;
      if (existingIndex !== -1) {
        // Kiểm tra tổng quantity mới có vượt stock không
        const existingQty = cart.value[existingIndex].quantity;
        if (existingQty + quantity > availableStock) {
          actionResult.value = {
            success: false,
            message: "Không đủ số lượng sản phẩm trong kho!",
          };
          return false;
        }
        // Cập nhật số lượng nếu sản phẩm đã có
        cart.value[existingIndex].quantity += quantity;
      } else {
        // Kiểm tra quantity mới có vượt stock không
        if (quantity > availableStock) {
          actionResult.value = {
            success: false,
            message: "Không đủ số lượng sản phẩm trong kho!",
          };
          return false;
        }
        // Thêm sản phẩm mới với giá hiện tại (ưu tiên giá khuyến mãi)
        const cartItem = {
          id: product.id_sp || product.id,
          name: product.tensanpham || product.name,
          price: getCurrentPrice(product), // Giá hiện tại (ưu tiên giá khuyến mãi)
          originalPrice:
            product.dongia || product.originalPrice || product.price, // Giá gốc
          image:
            product.anhgoc ||
            product.image ||
            "/placeholder.svg?height=100&width=100",
          variant: formatVariant(product),
          quantity: quantity,
          selected: false,
          category: product.loaiTen || product.category || "",
          brand: product.thuonghieuTen || product.brand || "",
          stockQuantity: availableStock,
        };
        cart.value.push(cartItem);
      }

      saveCart();

      actionResult.value = {
        success: true,
        message: "Đã thêm sản phẩm vào giỏ hàng!",
      };

      return true;
    } catch (error) {
      console.error("[useCartManagement] Error adding to cart:", error);
      actionResult.value = {
        success: false,
        message: "Có lỗi xảy ra khi thêm vào giỏ hàng",
      };
      return false;
    }
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (productId, variant, quantity) => {
    try {
      const itemIndex = cart.value.findIndex(
        (item) => item.id === productId && item.variant === variant
      );

      if (itemIndex !== -1) {
        const item = cart.value[itemIndex];
        // Kiểm tra quantity mới có vượt stock không
        if (quantity > item.stockQuantity) {
          actionResult.value = {
            success: false,
            message: "Không đủ số lượng sản phẩm trong kho!",
          };
          return false;
        }

        if (quantity <= 0) {
          cart.value.splice(itemIndex, 1);
        } else {
          cart.value[itemIndex].quantity = quantity;
        }
        saveCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error("[useCartManagement] Error updating quantity:", error);
      return false;
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId, variant) => {
    try {
      const filteredCart = cart.value.filter(
        (item) => !(item.id === productId && item.variant === variant)
      );
      cart.value = filteredCart;
      saveCart();

      actionResult.value = {
        success: true,
        message: "Đã xóa sản phẩm khỏi giỏ hàng",
      };

      return true;
    } catch (error) {
      console.error("[useCartManagement] Error removing from cart:", error);
      actionResult.value = {
        success: false,
        message: "Có lỗi xảy ra khi xóa sản phẩm",
      };
      return false;
    }
  };

  // Cập nhật trạng thái selected của một sản phẩm
  const updateSelected = (productId, variant, selected) => {
    try {
      const item = cart.value.find(
        (item) => item.id === productId && item.variant === variant
      );
      if (item) {
        item.selected = selected;
        saveCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error("[useCartManagement] Error updating selected:", error);
      return false;
    }
  };

  // Cập nhật select all
  const updateSelectAll = (selected) => {
    try {
      cart.value.forEach((item) => {
        item.selected = selected;
      });
      saveCart();
      return true;
    } catch (error) {
      console.error("[useCartManagement] Error updating select all:", error);
      return false;
    }
  };

  // Lấy số lượng sản phẩm trong giỏ hàng
  const getCartCount = () => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
  };

  // Lấy sản phẩm đã chọn
  const getSelectedItems = () => {
    return cart.value.filter((item) => item.selected);
  };

  // Xóa sản phẩm đã chọn (sau khi thanh toán thành công)
  const removeSelectedItems = () => {
    try {
      cart.value = cart.value.filter((item) => !item.selected);
      saveCart();
      return true;
    } catch (error) {
      console.error(
        "[useCartManagement] Error removing selected items:",
        error
      );
      return false;
    }
  };

  const clearCartOnLogout = () => {
    cart.value = [];
    localStorage.removeItem("cart");
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  // Clear toàn bộ giỏ hàng
  const clearCart = () => {
    cart.value = [];
    localStorage.removeItem("cart");
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  // Format variant từ thông tin sản phẩm
  const formatVariant = (product) => {
    const parts = [];
    if (product.mausac) parts.push(product.mausac);
    if (product.ram) parts.push(product.ram);
    if (product.rom) parts.push(product.rom);
    return parts.length > 0 ? parts.join(" - ") : "Mặc định";
  };

  // Lấy giá hiện tại (có tính giảm giá)
  const getCurrentPrice = (product) => {
    // Kiểm tra có đang giảm giá không
    if (product.hangiamgia && product.giamgia) {
      const saleEndDate = new Date(
        product.hangiamgia.split("/").reverse().join("-")
      ); // Chuyển định dạng DD/MM/YYYY thành YYYY-MM-DD
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      saleEndDate.setHours(0, 0, 0, 0);

      if (saleEndDate >= now && product.giamgia < product.dongia) {
        return product.giamgia; // Trả về giá khuyến mãi
      }
    }
    return product.dongia || product.price; // Trả về giá gốc nếu không có khuyến mãi
  };

  // Kiểm tra sản phẩm có trong giỏ hàng không
  const isInCart = (productId, variant = "Mặc định") => {
    return cart.value.some(
      (item) => item.id === productId && item.variant === variant
    );
  };

  return {
    cart,
    actionResult,
    loading,
    loadCart,
    saveCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    updateSelected,
    updateSelectAll,
    getCartCount,
    getSelectedItems,
    removeSelectedItems,
    clearCartOnLogout,
    clearCart,
    isInCart,
  };
}
