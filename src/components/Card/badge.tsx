import { Product, ProductType } from "@/context/CartContext";
import React from "react";

const badge = ({ item }: { item: Product }) => {
  return (
    <div
      className={`product-type absolute top-2 left-2 px-3 py-1 rounded-full text-sm ${
        item.type === "digital"
          ? "bg-blue-100 text-blue-600"
          : item.type === "physical"
          ? "bg-green-100 text-green-600"
          : "bg-purple-100 text-primary-purple"
      }`}
    >
      {item.type === "digital"
        ? "رقمي"
        : item.type === "physical"
        ? "مادي"
        : "دورة"}
    </div>
  );
};

export default badge;
