export const metadata = {
  title: {
    absolute: 'About | Portfolio Builder',
  },
}
 


export default async function BlogPost({ params }) {
    const { id } = await params;
    const currentData = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    const currentPost = await currentData.json();

    // Fetch the blog post data based on the ID
    // This is a placeholder - replace with actual data fetching logic
    const blogPost = {
        id,
        title: `Blog Post ${id}`,
        content: `This is the content of blog post ${id}.`
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4">{currentPost.title}</h1>
            <p className="text-lg text-gray-600">{currentPost.body}</p>
        </div>
    );
}
