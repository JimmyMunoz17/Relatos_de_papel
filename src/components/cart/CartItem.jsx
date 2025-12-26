import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { increase, decrease, removeItem } = useCart();

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="font-medium">{item.title}</div>
        <div className="text-sm text-gray-600">{item.author}</div>
        <div className="text-sm">{item.quantity} x ${item.price}</div>
      </div>
      <div className="flex flex-col items-end">
        <div className="space-x-1">
          <button onClick={() => increase(item.id)} className="px-2 py-1 bg-gray-200 rounded">+</button>
          <button onClick={() => decrease(item.id)} className="px-2 py-1 bg-gray-200 rounded">-</button>
        </div>
        <button onClick={() => removeItem(item.id)} className="text-sm text-red-600 mt-2">Eliminar</button>
      </div>
    </div>
  );
};

export default CartItem;
