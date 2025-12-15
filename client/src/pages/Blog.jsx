import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';

const Blog = () => {
    return (
        <div className="container mx-auto px-4 py-16 dark:bg-gray-950 transition-colors duration-300">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Latest Insights</h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Expert advice, industry trends, and platform updates to help you grow.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogPosts.map((post, index) => (
                    <div
                        key={index}
                        className="group overflow-hidden rounded-2xl bg-white border border-gray-100 hover:shadow-xl transition-all dark:bg-gray-900 dark:border-gray-800"
                    >
                        <div className="aspect-video w-full overflow-hidden">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                    {post.category}
                                </span>
                                <div className="flex items-center text-xs text-gray-500">
                                    <Calendar size={12} className="mr-1" />
                                    {post.date}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors dark:text-white dark:group-hover:text-indigo-400">
                                <Link to={`/blog/${post.id}`}>
                                    {post.title}
                                </Link>
                            </h3>
                            <p className="text-gray-600 mb-6 line-clamp-2 dark:text-gray-400">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-gray-500">
                                        <User size={16} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{post.author}</span>
                                </div>
                                <Link to={`/blog/${post.id}`} className="text-indigo-600 font-semibold text-sm flex items-center group-hover:translate-x-1 transition-transform cursor-pointer dark:text-indigo-400">
                                    Read More <ArrowRight size={16} className="ml-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blog;
