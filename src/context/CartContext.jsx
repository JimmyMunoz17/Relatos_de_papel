import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
    items: []
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

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addItem = (item) => dispatch({ type: 'ADD', item });
    const removeItem = (id) => dispatch({ type: 'REMOVE', id });
    const increase = (id) => dispatch({ type: 'INCREASE', id });
    const decrease = (id) => dispatch({ type: 'DECREASE', id });
    const clear = () => dispatch({ type: 'CLEAR' });

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
