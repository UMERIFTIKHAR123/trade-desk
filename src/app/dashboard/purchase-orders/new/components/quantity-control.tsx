// components/advanced-quantity-control.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Minus, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface QuantityControlProps {
  quantity: number;
  min?: number;
  max?: number;
  onQuantityChange?: (quantity: number) => void;
  onDelete?: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function QuantityControl({
  quantity,
  min = 1,
  max = 99,
  onQuantityChange,
  onDelete,
  size = 'md',
  disabled = false,
}: QuantityControlProps) {
  const [inputValue, setInputValue] = useState(quantity.toString());
  const [isEditing, setIsEditing] = useState(false);
  const [showMaxWarning, setShowMaxWarning] = useState(false);

  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleIncrease = () => {
    if (quantity < max && !disabled) {
      onQuantityChange?.(quantity + 1);
    } else if (quantity >= max) {
      setShowMaxWarning(true);
      setTimeout(() => setShowMaxWarning(false), 2000);
    }
  };

  const handleDecrease = () => {
    if (quantity > min && !disabled) {
      onQuantityChange?.(quantity - 1);
    }
  };

  const handleDelete = () => {
    if (!disabled && onDelete) {
      onDelete();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const numValue = parseInt(inputValue) || min;
    const validValue = Math.max(min, Math.min(max, numValue));
    setInputValue(validValue.toString());
    if (validValue !== quantity) {
      onQuantityChange?.(validValue);
    }
  };

  const handleInputFocus = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrease();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrease();
    }
  };

  const sizeConfig = {
    sm: {
      button: 'h-8 w-8',
      input: 'h-8 w-12 text-sm',
      icon: 'h-3.5 w-3.5',
      gap: 'gap-1.5',
      padding: 'px-2 py-1',
    },
    md: {
      button: 'h-10 w-10',
      input: 'h-10 w-14 text-base',
      icon: 'h-4 w-4',
      gap: 'gap-2',
      padding: 'px-3 py-1.5',
    },
    lg: {
      button: 'h-12 w-12',
      input: 'h-12 w-16 text-lg',
      icon: 'h-5 w-5',
      gap: 'gap-3',
      padding: 'px-4 py-2',
    },
  };

  const config = sizeConfig[size];
  const isAtMin = quantity <= min;
  const isAtMax = quantity >= max;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="inline-flex flex-col items-center gap-2">
        <div
          className={cn(
            'inline-flex items-center bg-white rounded-xl shadow-lg border border-gray-200/80',
            'hover:shadow-xl transition-all duration-300',
            config.gap,
            config.padding,
            disabled && 'opacity-60 cursor-not-allowed'
          )}
        >
          {/* Decrease or Delete Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  config.button,
                  'rounded-lg transition-all duration-200',
                  'hover:scale-105 active:scale-95',
                  isAtMin
                    ? 'hover:bg-red-50 hover:text-red-600 text-red-500'
                    : 'hover:bg-gray-100 text-gray-700',
                  disabled && 'pointer-events-none'
                )}
                onClick={isAtMin ? handleDelete : handleDecrease}
                disabled={disabled}
              >
                {isAtMin ? (
                  <Trash2
                    className={cn(
                      config.icon,
                      'transition-transform duration-200',
                      'group-hover:rotate-12'
                    )}
                  />
                ) : (
                  <Minus className={config.icon} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-gray-900 text-white">
              <p>{isAtMin ? 'Remove item' : 'Decrease quantity'}</p>
            </TooltipContent>
          </Tooltip>

          {/* Quantity Input */}
          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className={cn(
                config.input,
                'text-center font-bold border-0 focus-visible:ring-2',
                'focus-visible:ring-blue-500 focus-visible:ring-offset-0',
                'bg-gray-50 rounded-lg transition-all duration-200',
                isEditing && 'bg-blue-50 ring-2 ring-blue-500',
                disabled && 'cursor-not-allowed'
              )}
            />
          </div>

          {/* Increase Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  config.button,
                  'rounded-lg transition-all duration-200',
                  'hover:scale-105 active:scale-95',
                  'hover:bg-gray-100 text-gray-700',
                  isAtMax && 'text-gray-400',
                  disabled && 'pointer-events-none'
                )}
                onClick={handleIncrease}
                disabled={disabled || isAtMax}
              >
                <Plus className={config.icon} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-gray-900 text-white">
              <p>{isAtMax ? `Maximum: ${max}` : 'Increase quantity'}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Max Warning */}
        {showMaxWarning && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-3.5 w-3.5" />
            <span className="font-medium">Maximum reached</span>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

// Example/Demo Component
export function QuantityControlDemo() {
  const [cart, setCart] = useState([
    { id: '1', name: 'Premium Wireless Headphones', price: 299.99, quantity: 2, emoji: '🎧', color: 'from-blue-500 to-blue-600' },
    { id: '2', name: 'Smart Watch Pro', price: 399.99, quantity: 1, emoji: '⌚', color: 'from-purple-500 to-purple-600' },
    { id: '3', name: 'Mechanical Keyboard', price: 159.99, quantity: 3, emoji: '⌨️', color: 'from-green-500 to-green-600' },
    { id: '4', name: 'USB-C Cable', price: 19.99, quantity: 5, emoji: '🔌', color: 'from-orange-500 to-orange-600' },
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-3">
            Advanced Quantity Control
          </h1>
          <p className="text-gray-600 text-lg">
            Professional, feature-rich quantity selector with inline editing
          </p>
        </div>

        {/* Size Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Small</h3>
            <div className="flex justify-center">
              <QuantityControl
                quantity={3}
                size="sm"
                onQuantityChange={(q) => console.log('Small:', q)}
                onDelete={() => console.log('Deleted')}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Medium</h3>
            <div className="flex justify-center">
              <QuantityControl
                quantity={5}
                size="md"
                onQuantityChange={(q) => console.log('Medium:', q)}
                onDelete={() => console.log('Deleted')}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Large</h3>
            <div className="flex justify-center">
              <QuantityControl
                quantity={7}
                size="lg"
                onQuantityChange={(q) => console.log('Large:', q)}
                onDelete={() => console.log('Deleted')}
              />
            </div>
          </div>
        </div>

        {/* Shopping Cart */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Cart Header */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
            <p className="text-gray-300 text-sm mt-1">{cart.length} items in your cart</p>
          </div>

          {/* Cart Items */}
          <div className="p-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-xl shadow-lg flex items-center justify-center text-3xl transform hover:scale-110 transition-transform duration-300`}>
                    {item.emoji}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ${item.price.toFixed(2)} each
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <QuantityControl
                  quantity={item.quantity}
                  min={1}
                  max={10}
                  size="md"
                  onQuantityChange={(q) => updateQuantity(item.id, q)}
                  onDelete={() => removeItem(item.id)}
                />
              </div>
            ))}

            {cart.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg">Your cart is empty</p>
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 px-8 py-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold text-gray-700">Total Amount</span>
                <span className="text-3xl font-bold text-gray-900">${total.toFixed(2)}</span>
              </div>
              <Button className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>

        {/* Features List */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-2">✨ Inline Editing</h3>
            <p className="text-sm text-gray-600">Click the quantity to type directly. Press Enter or click away to save.</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100">
            <h3 className="font-semibold text-gray-900 mb-2">⌨️ Keyboard Support</h3>
            <p className="text-sm text-gray-600">Use arrow keys to increment/decrement. Full keyboard navigation.</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100">
            <h3 className="font-semibold text-gray-900 mb-2">🎯 Smart Validation</h3>
            <p className="text-sm text-gray-600">Automatic min/max enforcement with visual feedback.</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border border-orange-100">
            <h3 className="font-semibold text-gray-900 mb-2">💡 Contextual Tooltips</h3>
            <p className="text-sm text-gray-600">Helpful hints appear on hover for better user experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
}