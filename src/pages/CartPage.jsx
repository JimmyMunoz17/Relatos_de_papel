import CartList from '../components/cart/CartList';
import CartSummary from '../components/cart/CartSummary';

const CartPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tu carrito</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded">
          <CartList />
        </div>
        <div className="border p-4 rounded">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
