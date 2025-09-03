import React from "react";

export default function ProductDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto">{children}</div>
    </main>
  );
}
