"use client"

import React, { createContext, useContext, useState } from 'react';

export type ExchangeBook = {
  id: string;
  title: string;
  author: string;
  condition: string;
  image?: string;
  ownerId: string;
};

type ExchangeRequest = {
  id: string;
  offeredBookId: string;
  requestedBookId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
};

type ExchangeContextType = {
  myBooks: ExchangeBook[];
  exchangeRequests: ExchangeRequest[];
  addBook: (book: ExchangeBook) => void;
  removeBook: (id: string) => void;
  proposeExchange: (offeredBookId: string, requestedBookId: string) => void;
  acceptExchange: (requestId: string) => void;
  rejectExchange: (requestId: string) => void;
};

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

// Mock user ID - in a real app, this would come from authentication
const MOCK_USER_ID = "user1";

export function ExchangeProvider({ children }: { children: React.ReactNode }) {
  const [myBooks, setMyBooks] = useState<ExchangeBook[]>([]);
  const [exchangeRequests, setExchangeRequests] = useState<ExchangeRequest[]>([]);

  const addBook = (book: ExchangeBook) => {
    setMyBooks(current => [...current, { ...book, ownerId: MOCK_USER_ID }]);
  };

  const removeBook = (id: string) => {
    setMyBooks(current => current.filter(book => book.id !== id));
  };

  const proposeExchange = (offeredBookId: string, requestedBookId: string) => {
    const newRequest: ExchangeRequest = {
      id: Math.random().toString(36).substr(2, 9),
      offeredBookId,
      requestedBookId,
      status: 'pending',
      createdAt: new Date(),
    };
    setExchangeRequests(current => [...current, newRequest]);
  };

  const acceptExchange = (requestId: string) => {
    setExchangeRequests(current =>
      current.map(request =>
        request.id === requestId
          ? { ...request, status: 'accepted' }
          : request
      )
    );
  };

  const rejectExchange = (requestId: string) => {
    setExchangeRequests(current =>
      current.map(request =>
        request.id === requestId
          ? { ...request, status: 'rejected' }
          : request
      )
    );
  };

  return (
    <ExchangeContext.Provider
      value={{
        myBooks,
        exchangeRequests,
        addBook,
        removeBook,
        proposeExchange,
        acceptExchange,
        rejectExchange,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
}

export const useExchange = () => {
  const context = useContext(ExchangeContext);
  if (context === undefined) {
    throw new Error('useExchange must be used within an ExchangeProvider');
  }
  return context;
};
