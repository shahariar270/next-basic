export default async function BlogPost({ params }) {
    const { id } = await params;

    // Fetch the blog post data based on the ID
    // This is a placeholder - replace with actual data fetching logic
    const blogPost = {
        id,
        title: `Blog Post ${id}`,
        content: `This is the content of blog post ${id}.`
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>
            <p className="text-lg text-gray-600">{blogPost.content}</p>
        </div>
    );
}
