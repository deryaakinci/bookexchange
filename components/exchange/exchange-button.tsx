"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useExchange } from './exchange-context';
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';

type ExchangeButtonProps = {
  bookId: string;
  bookTitle: string;
};

export function ExchangeButton({ bookId, bookTitle }: ExchangeButtonProps) {
  const { myBooks, proposeExchange } = useExchange();
  const [isOpen, setIsOpen] = useState(false);

  const handleExchange = (offeredBookId: string) => {
    proposeExchange(offeredBookId, bookId);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Exchange</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Exchange Book</DialogTitle>
          <DialogDescription>
            Select one of your books to exchange for "{bookTitle}"
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {myBooks.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              You haven't added any books for exchange yet.
            </p>
          ) : (
            myBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    {book.image && (
                      <Image
                        src={book.image}
                        alt={book.title}
                        width={60}
                        height={80}
                        className="object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold">{book.title}</h4>
                      <p className="text-sm text-gray-500">{book.author}</p>
                      <p className="text-sm text-gray-500">Condition: {book.condition}</p>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => handleExchange(book.id)}
                  >
                    Offer for Exchange
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
