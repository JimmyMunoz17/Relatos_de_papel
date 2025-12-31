import { useState } from "react";
import { useCart } from "../../context/CartContext";
import CartList from "./CartList";
import CartSummary from "./CartSummary";

const CartPanel = () => {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="cart-panel"
      style={{ position: "fixed", right: 16, top: 16, zIndex: 50 }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-2 bg-orange-600 text-white rounded"
      >
        Carrito ({totalItems})
      </button>
      {open && (
        <div
          className="bg-white shadow-md p-4 mt-2 rounded"
          style={{ width: 320 }}
        >
          <CartList />
          <hr className="my-2" />
          <CartSummary />
        </div>
      )}
    </div>
  );
};

export default CartPanel;
