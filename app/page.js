"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


export default function Home() {

  const handleDelete = (id) => {
    setData(data.filter((project) => project.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Link href={'/blog'}>Blog page</Link>
    </div>
  );
}
