import { notFound } from "next/navigation";
import { submitContact } from "./actions";

async function getPost(id) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    if (!res.ok) notFound();
    return res.json();
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const post = await getPost(id);

    return {
        title: post.title,
        description: post.body.slice(0, 150),
    };
}

export default async function BlogPost({ params }) {
    const { id } = await params;
    const currentPost = await getPost(id);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4">{currentPost.title}</h1>
            <p className="text-lg text-gray-600">{currentPost.body}</p>
            <div className="w-[400px]">
                <form action={submitContact} className="flex flex-col" >
                    <input name="email" />
                    <button type="submit" >enter value</button>
                </form>
            </div>
        </div>
    );
}
