"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExchange } from '@/components/exchange/exchange-context';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ExchangePage() {
  const { myBooks, exchangeRequests, addBook, removeBook, acceptExchange, rejectExchange } = useExchange();
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    condition: 'Good',
    image: '/placeholder.svg?height=200&width=150',
  });

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    addBook({
      ...newBook,
      id: Math.random().toString(36).substr(2, 9),
      ownerId: 'user1',
    });
    setNewBook({
      title: '',
      author: '',
      condition: 'Good',
      image: '/placeholder.svg?height=200&width=150',
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="my-books" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-books">My Books for Exchange</TabsTrigger>
          <TabsTrigger value="requests">Exchange Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="my-books">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add a Book for Exchange</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddBook} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Book Title</Label>
                    <Input
                      id="title"
                      value={newBook.title}
                      onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={newBook.author}
                      onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                      value={newBook.condition}
                      onValueChange={(value) => setNewBook({ ...newBook, condition: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Like New">Like New</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Acceptable">Acceptable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">Add Book</Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myBooks.map((book) => (
                <Card key={book.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={book.image || '/placeholder.svg'}
                        alt={book.title}
                        width={60}
                        height={80}
                        className="object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{book.title}</h3>
                        <p className="text-sm text-gray-500">{book.author}</p>
                        <p className="text-sm text-gray-500">Condition: {book.condition}</p>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-2"
                          onClick={() => removeBook(book.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <div className="grid gap-6">
            {exchangeRequests.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No exchange requests yet
                </CardContent>
              </Card>
            ) : (
              exchangeRequests.map((request) => {
                const offeredBook = myBooks.find(b => b.id === request.offeredBookId);
                const requestedBook = myBooks.find(b => b.id === request.requestedBookId);

                return (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            Exchange Request: {offeredBook?.title} ↔ {requestedBook?.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Status: {request.status}
                          </p>
                        </div>
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              onClick={() => acceptExchange(request.id)}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => rejectExchange(request.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
