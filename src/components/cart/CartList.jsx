import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';

const CartList = () => {
  const { items } = useCart();

  if (items.length === 0) return <div>El carrito está vacío</div>;

  return (
    <div>
      {items.map(i => (
        <CartItem key={i.id} item={i} />
      ))}
    </div>
  );
};

export default CartList;
