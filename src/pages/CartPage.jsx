import CartList from '../components/cart/CartList';
import CartSummary from '../components/cart/CartSummary';
import { Link } from 'react-router-dom';

const CartPage = () => {
  return (
    <div div className="min-h-[82vh] p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Tu carrito</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded">
          <CartList />
        </div>
        <div className="border p-4 rounded">
          <CartSummary />
        </div>
        <Link to="/checkout" className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-center rounded">
          Proceder al Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
