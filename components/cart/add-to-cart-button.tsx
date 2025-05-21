"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from './cart-context';

type AddToCartButtonProps = {
  item: Omit<CartItem, 'quantity'>;
};

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <Button
      onClick={() => addItem({ ...item, quantity: 1 })}
      className="w-full"
    >
      Add to Cart
    </Button>
  );
}
