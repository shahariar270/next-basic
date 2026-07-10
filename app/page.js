"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


export default function Home() {
  const [data, setData] = useState([
    {
      id: 1,
      title: "Project 1",
      description: "This is a description of project 1.",
      route: "/blog/1"
    },
    {
      id: 2,
      title: "Project 2",
      description: "This is a description of project 2.",
      route: "/blog/2"
    }
  ]);

  const handleDelete = (id) => {
    setData(data.filter((project) => project.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {data.map((project) => (
        <div key={project.id} className="bg-white rounded-lg shadow-md p-6 m-4 w-full max-w-md">
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <Link href={project.route} className="text-blue-500 hover:underline">
            Read More
          </Link>
          <button onClick={() => handleDelete(project.id)} className="bg-red-500 text-white px-4 py-2 rounded mt-4">Delete</button>
        </div>
      ))}
    </div>
  );
}
