import books from '../data/booksMock';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { addItem } = useCart();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Catálogo</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {books.map(b => (
          <div key={b.id} className="border p-4 rounded">
            <h3 className="font-semibold">{b.title}</h3>
            <p className="text-sm text-gray-600">{b.author}</p>
            <p className="mt-2">${b.price}</p>
            <div className="mt-3 flex space-x-2">
              <button onClick={() => addItem(b)} className="px-3 py-1 bg-blue-600 text-white rounded">Agregar</button>
              <Link to={`/book/${b.id}`} className="px-3 py-1 bg-gray-200 rounded">Detalles</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
