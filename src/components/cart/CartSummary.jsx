import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartSummary = () => {
  const { totalItems, totalPrice, clear } = useCart();

  return (
    <div>
      <div className="flex justify-between">
        <div>Items:</div>
        <div>{totalItems}</div>
      </div>
      <div className="flex justify-between">
        <div>Total:</div>
        <div>${totalPrice.toFixed(2)}</div>
      </div>
      <div className="mt-3 flex justify-between">
        <Link to="/cart" className="px-3 py-2 bg-green-600 text-white rounded">Ver carrito</Link>
        <button onClick={clear} className="px-3 py-2 bg-red-600 text-white rounded">Vaciar</button>
      </div>
    </div>
  );
};

export default CartSummary;
