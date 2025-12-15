import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

const BlogPost = () => {
    const { id } = useParams();
    const post = blogPosts.find(p => p.id === id);

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Post not found</h2>
                <Link to="/blog" className="text-indigo-600 hover:underline">Back to Blog</Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen pb-20 dark:bg-gray-950 transition-colors duration-300">
            {/* Hero Image */}
            <div className="w-full h-[400px] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full z-20 p-8 md:p-16 text-white max-w-5xl mx-auto">
                    <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                        <ArrowLeft size={20} className="mr-2" /> Back to Blog
                    </Link>
                    <div className="flex items-center space-x-4 mb-4 text-sm font-medium">
                        <span className="bg-indigo-600 px-3 py-1 rounded-full">{post.category}</span>
                        <span className="flex items-center"><Calendar size={14} className="mr-1" /> {post.date}</span>
                        <span className="flex items-center"><Clock size={14} className="mr-1" /> 5 min read</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">{post.title}</h1>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 max-w-4xl py-12">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 md:p-12 -mt-20 relative z-30 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl mr-4">
                            {post.author.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">{post.author}</p>
                            <p className="text-sm text-gray-500">Professional Contributor</p>
                        </div>
                    </div>

                    <div
                        className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-indigo-600"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </div>
        </article>
    );
};

export default BlogPost;
