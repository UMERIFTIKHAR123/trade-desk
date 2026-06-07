'use client'
import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  dto: number;
  iva: number;
};

type CartState = {
  items: CartItem[];
};

type Action =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  totalQuantity: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

} | null>(null);

const initialState: CartState = { items: [] };

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity, dto: 0, iva: 21 }
              : i
          )
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload.id)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        )
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

export const CartProvider = ({ _initialState, children }: { _initialState?: CartState, children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, _initialState || initialState);

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item });

  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: { id } });

  const updateQuantity = (id: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  // compute totals whenever state.items changes
  const { totalQuantity, totalPrice } = useMemo(() => {
    const totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = state.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
    return { totalQuantity, totalPrice };
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, totalQuantity, totalPrice, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};