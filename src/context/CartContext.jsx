import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Estado inicial leyendo desde localStorage

const initialState = {
    items: JSON.parse(localStorage.getItem('cart')) || []
};

function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD': {
            const existing = state.items.find(i => i.id === action.item.id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map(i => i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i)
                };
            }
            return { ...state, items: [...state.items, { ...action.item, quantity: 1 }] };
        }
        case 'REMOVE':
            return { ...state, items: state.items.filter(i => i.id !== action.id) };
        case 'INCREASE':
            return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i) };
        case 'DECREASE':
            return { ...state, items: state.items.flatMap(i => i.id === action.id ? (i.quantity > 1 ? [{ ...i, quantity: i.quantity - 1 }] : []) : [i]) };
        case 'CLEAR':
            return { ...state, items: [] };
        default:
            return state;
    }
}

//  Estado inicial leyendo desde localStorage



export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem(
            'cart',
            JSON.stringify(state.items)
        );
    }, [state.items]);

    // API Frontend para el carrito

    const addItem = (item) => dispatch({ type: 'ADD', item });
    const removeItem = (id) => dispatch({ type: 'REMOVE', id });
    const increase = (id) => dispatch({ type: 'INCREASE', id });
    const decrease = (id) => dispatch({ type: 'DECREASE', id });
    const clear = () => dispatch({ type: 'CLEAR' });

    // Valores derivados del estado

    const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
    const totalPrice = state.items.reduce((s, i) => s + i.quantity * i.price, 0);

    return (
        <CartContext.Provider value={{ items: state.items, addItem, removeItem, increase, decrease, clear, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}

export default CartContext;
