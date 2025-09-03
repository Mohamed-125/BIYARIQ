"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define product types
export type ProductType = "digital" | "physical" | "course";

// Define product base interface
export interface BaseProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity?: number;
  rating: number;
}

// Physical product
export interface PhysicalProduct extends BaseProduct {
  type: "physical";
  weight?: number; // in kg
  dimensions?: string; // e.g. "10x20x5 cm"
  stock: number;
}

// Digital product
export interface DigitalProduct extends BaseProduct {
  type: "digital";
  fileSize?: string; // e.g. "500MB"
  format?: string; // e.g. "PDF, MP3"
  downloadLink?: string;
  licenseKey?: string;
}

// Course product
export interface CourseProduct extends BaseProduct {
  type: "course";
  duration: number; // in hours
  lectures: number;
  level: string; // e.g. "Beginner, Intermediate"
  instructor: string;
}

// Union type
export type Product = PhysicalProduct | DigitalProduct | CourseProduct;

// Define cart context interface
interface CartContextType {
  items: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  digitalItems: Product[];
  physicalItems: Product[];
  courseItems: Product[];
  addToWishlist: (productId: string) => void;
  dummyProducts: Product[];
  saveForLater: (productId: string) => void;
}

// Initialize cart state from localStorage if available
const dummyProducts: Product[] = [
  // Physical
  {
    id: "p1",
    name: "Wireless Mouse",
    price: 25,
    originalPrice: 35,
    rating: 4,
    image:
      "https://store-images.s-microsoft.com/image/apps.808.14492077886571533.be42f4bd-887b-4430-8ed0-622341b4d2b0.c8274c53-105e-478b-9f4b-41b8088210a3?q=90&w=512&h=768&mode=crop&format=jpg&background=%23FFFFFF",
    type: "physical",
    stock: 50,
    weight: 0.2,
    dimensions: "10x6x4 cm",
  },
  {
    id: "p2",
    name: "Bluetooth Headphones",
    price: 80,
    originalPrice: 100,
    rating: 4,
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/044/280/984/small_2x/stack-of-books-on-a-brown-background-concept-for-world-book-day-photo.jpg",
    type: "physical",
    stock: 30,
    weight: 0.5,
    dimensions: "20x15x8 cm",
  },
  {
    id: "p3",
    name: "Office Chair",
    price: 150,
    rating: 4,
    originalPrice: 200,
    image:
      "https://www.have-clothes-will-travel.com/wp-content/uploads/2019/05/qtq80-7bsDUb.jpeg",
    type: "physical",
    stock: 10,
    weight: 12,
    dimensions: "70x70x110 cm",
  },

  // Digital
  {
    id: "d1",
    name: "E-book: Learn JavaScript",
    price: 15,
    rating: 4,
    type: "digital",
    image:
      "https://store-images.s-microsoft.com/image/apps.808.14492077886571533.be42f4bd-887b-4430-8ed0-622341b4d2b0.c8274c53-105e-478b-9f4b-41b8088210a3?q=90&w=512&h=768&mode=crop&format=jpg&background=%23FFFFFF",

    fileSize: "5MB",
    format: "PDF",
    downloadLink: "/downloads/js-ebook.pdf",
    licenseKey: "JS123-456",
  },
  {
    id: "d2",
    name: "Stock Photo Pack",
    price: 25,
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/044/280/984/small_2x/stack-of-books-on-a-brown-background-concept-for-world-book-day-photo.jpg",

    type: "digital",
    rating: 4,
    fileSize: "500MB",
    format: "JPEG",
    downloadLink: "/downloads/stock-photos.zip",
  },
  {
    id: "d3",
    name: "Music Album",
    image:
      "https://www.have-clothes-will-travel.com/wp-content/uploads/2019/05/qtq80-7bsDUb.jpeg",

    price: 10,
    type: "digital",
    rating: 3.5,
    fileSize: "120MB",
    format: "MP3",
    downloadLink: "/downloads/album.zip",
  },

  // Courses
  {
    id: "c1",
    name: "Web Development Bootcamp",
    price: 200,
    image:
      "https://store-images.s-microsoft.com/image/apps.808.14492077886571533.be42f4bd-887b-4430-8ed0-622341b4d2b0.c8274c53-105e-478b-9f4b-41b8088210a3?q=90&w=512&h=768&mode=crop&format=jpg&background=%23FFFFFF",
    type: "course",
    duration: 40,
    rating: 4,
    lectures: 120,
    level: "Beginner",
    instructor: "John Doe",
  },
  {
    id: "c2",
    name: "Advanced React",
    price: 150,
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/044/280/984/small_2x/stack-of-books-on-a-brown-background-concept-for-world-book-day-photo.jpg",
    type: "course",
    duration: 25,
    lectures: 80,
    rating: 2.5,
    level: "Advanced",
    instructor: "Jane Smith",
  },
  {
    id: "c3",
    name: "UI/UX Design Fundamentals",
    price: 100,
    image:
      "https://www.have-clothes-will-travel.com/wp-content/uploads/2019/05/qtq80-7bsDUb.jpeg",
    type: "course",
    duration: 20,
    rating: 4.5,
    lectures: 60,
    level: "Intermediate",
    instructor: "Emily Johnson",
  },
];

// Create context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
  digitalItems: [],
  physicalItems: [],
  courseItems: [],
  addToWishlist: () => {},
  saveForLater: () => {},
  dummyProducts,
});

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);

// Cart provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<Product[]>(dummyProducts);

  // Add product to cart
  const addToCart = (product: Product) => {
    setItems((prevItems) => {
      // Check if product already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex !== -1) {
        // If product exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: (updatedItems[existingItemIndex].quantity || 1) + 1,
        };
        return updatedItems;
      } else {
        // If product doesn't exist, add it with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Update product quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  // Calculate total items in cart
  const totalItems = items.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  // Calculate total price
  const totalPrice = items.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  // Filter items by type
  const digitalItems = items.filter((item) => item.type === "digital");
  const physicalItems = items.filter((item) => item.type === "physical");
  const courseItems = items.filter((item) => item.type === "course");

  // Add to wishlist
  const addToWishlist = (productId: string) => {
    // Implementation will be added later
    console.log("Added to wishlist:", productId);
  };

  // Save for later
  const saveForLater = (productId: string) => {
    // Implementation will be added later
    console.log("Saved for later:", productId);
  };

  // Provide cart context to children
  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        digitalItems,
        physicalItems,
        courseItems,
        addToWishlist,
        saveForLater,
        dummyProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
