// app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GiPalmTree } from "react-icons/gi";
import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
  "/malle1.jpg",
  "/malle2.jpg",
  "/malle3.jpg",
  "/malle4.jpg",
  "/malle5.jpg",
  "/malle6.jpg",
  "/malle7.jpg",
  "/malle8.jpg",
  "/malle9.jpg",
  "/malle10.jpg",
  "/malle11.jpg",
];

export default function HomePage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0 z-0">
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt={`Mallorca ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-md">
          Jetzt Mallorca planen
          <GiPalmTree className="inline-block text-4xl md:text-6xl ml-2" />
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-xl drop-shadow-md">
          Wadehn's planen ihren nächsten Aufenthalt auf Mallorca
        </p>
        <Link href="/login">
          <Button className="text-white bg-black hover:opacity-50 px-6 py-3 text-lg rounded-full shadow-lg">
            Jetzt einloggen
          </Button>
        </Link>
      </div>
    </main>
  );
}
