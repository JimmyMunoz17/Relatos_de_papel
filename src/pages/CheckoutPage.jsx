import CheckoutSelected from '../components/checkout/CheckoutSelected';

const CheckoutPage = () => {
  return (
    <div className="flex flex-col">
      
      <div className=" flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Resumen de Compra</h1>
        <CheckoutSelected />
      </div>

    </div>
  );
};

export default CheckoutPage;