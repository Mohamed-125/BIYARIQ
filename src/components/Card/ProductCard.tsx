"use client";

import React from "react";
import { Heart, ShoppingCart, Trash } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import Button from "../ui/Button";
import Link from "next/link";
import { Product } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, removeFromCart, isInCart, getCartItemById } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const cartItem = getCartItemById(product.id);
  const isProductInCart = isInCart(product.id);
  const isProductFavorite = isFavorite(product.id);

  console.log("cartItem", cartItem);
  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleRemoveFromCart = () => {
    if (cartItem) {
      removeFromCart(cartItem.id);
    }
  };

  const handleToggleFavorite = () => {
    if (isProductFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const discount =
    product.priceAfterDiscount && product.price
      ? Math.round(
          ((product.price - product.priceAfterDiscount) / product.price) * 100
        )
      : 0;

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="relative group">
        <Link href={`/products/${product.id}`}>
          <img
            src={product.thumbnail.url}
            alt={product.name.ar}
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-medium px-2 py-1 rounded">
            -{discount}%
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full ${
              isProductFavorite
                ? "bg-red-500 text-white"
                : "bg-white text-gray-600"
            } hover:scale-110 transition-all shadow-sm`}
          >
            <Heart
              size={20}
              fill={isProductFavorite ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold mb-2 line-clamp-1">{product.name.ar}</h3>

          <div className="flex items-center gap-2 mb-4">
            <span className="font-bold text-purple-600">
              {product.priceAfterDiscount || product.price} ﷼
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {product.price} ﷼
              </span>
            )}
          </div>
        </Link>

        {!isProductInCart && (
          <Button
            onClick={handleAddToCart}
            disabled={product.type === "physical" && (product.stock || 0) === 0}
            size={"full"}
          >
            <ShoppingCart size={20} />
            إضافة للسلة
          </Button>
        )}
        {isProductInCart && (
          <Button
            variant={"destructive"}
            onClick={handleRemoveFromCart}
            title="إزالة من السلة"
            size={"full"}
          >
            <Trash size={20} />
            إزالة من السلة
          </Button>
        )}
      </div>
    </div>
  );
}
