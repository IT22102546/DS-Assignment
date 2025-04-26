import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';

// Utility function to sanitize HTML content
const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'a', 'p', 'strong', 'em', 'br', 'span', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
};

export default function BlogDetails() {
  const { slug } = useParams();
  const [blogItem, setBlogItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogBySlug = async () => {
      try {
        const response = await fetch(`/api/blogs/getblogbyslug/${slug}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBlogItem(data);
      } catch (error) {
        console.error('Error fetching blogs by slug:', error);
        setError(error.message);
      }
    };

    fetchBlogBySlug();
  }, [slug]);

  if (error) {
    return <div className="text-red-500 font-semibold text-center mt-10">Error: {error}</div>;
  }

  if (!blogItem) {
    return <div className="text-center text-lg font-medium text-gray-600 mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {blogItem.Blogname}
      </h1>
      <img
        src={blogItem.Picture || 'https://via.placeholder.com/400x200'}
        alt={blogItem.Blogname}
        className="w-full h-96 object-cover mb-6 rounded-lg shadow-md"
      />
      <div
        className="text-lg text-gray-700 leading-relaxed mb-4"
        dangerouslySetInnerHTML={{
          __html: sanitizeHTML(blogItem.descreption), // Ensure sanitized content
        }}
      />
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm font-medium text-gray-500">Category:</span>
        <span className="px-4 py-1 bg-blue-100 text-pink-600 rounded-md text-sm font-medium">
          {blogItem.category}
        </span>
      </div>
    </div>
  );
}