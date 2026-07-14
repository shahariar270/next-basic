import Link from "next/link";


export const metadata = {
    title: "Post | Portfolio Builder",
    description: "A portfolio builder for developers and designers to showcase their work.",
};


export default async function Blog() {
    const data = await fetch('https://jsonplaceholder.typicode.com/posts')
    const post = await data.json();
    console.log({ post });
    return (
        <div className="flex justify-center items-center gap-5 flex-col">
            {post.map((item, index) => (
                <div key={index} className="bg-blue-700 flex-col h-6 w-fit p-6 flex justify-center items-center text-white font-bold ">
                    <h1>{item.title}</h1>
                    <button>
                    <Link href={`/blog/${item.id}`}>Read post</Link>
                    </button>
                </div>
            ))}
        </div>
    );
}


