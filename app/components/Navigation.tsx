'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import ContactForm from '../components/ContactForm';

interface Category {
  id: number;
  documentId: string;
  name: string;
  Icon?: {
    id: number;
    name: string;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  } | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface JobListing {
  id: number;
  documentId: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string; // full-time, part-time, contract, etc.
  description: any;
  requirements: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await fetch('http://localhost:1337/api/categories?populate=Icon');
        const categoriesData = await categoriesResponse.json();
        console.log('Categories:', categoriesData);
        setCategories(categoriesData.data || []);

        const jobListingsResponse = await fetch('http://localhost:1337/api/job-listings');
        const jobListingsData = await jobListingsResponse.json();
        console.log('Job Listings:', jobListingsData);
        setJobListings(jobListingsData.data || []);

        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getJobEmoji = (categoryName: string | undefined): string => {
    if (!categoryName) return '💼';
    
    switch (categoryName.toLowerCase()) {
      case 'technology':
      case 'it':
      case 'software':
        return '💻';
      case 'healthcare':
      case 'medical':
        return '🏥';
      case 'finance':
      case 'banking':
        return '💰';
      case 'education':
      case 'teaching':
        return '📚';
      case 'marketing':
      case 'sales':
        return '📈';
      case 'engineering':
        return '⚙️';
      case 'design':
      case 'creative':
        return '🎨';
      case 'customer service':
        return '📞';
      case 'human resources':
      case 'hr':
        return '👥';
      case 'logistics':
      case 'transportation':
        return '🚚';
      default:
        return '💼';
    }
  };

  const getDescription = (description: any): string => {
    if (!description) return 'No description available';
    
    if (typeof description === 'string') {
      return description;
    }
    
    if (Array.isArray(description) && description.length > 0) {
      const firstParagraph = description[0];
      if (firstParagraph && firstParagraph.children && firstParagraph.children.length > 0) {
        return firstParagraph.children[0].text || 'No description available';
      }
    }
    
    return 'No description available';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-16 flex items-center justify-center h-96">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Component */}
      <Navigation />

      {/* Header Section - Consistent padding for fixed navigation */}
      <div className="bg-white shadow-sm pt-16">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">💼 Job Loader</h1>
          <p className="text-gray-600 mt-2">Find your perfect career opportunity - Connect talent with opportunity</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Job Categories Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.isArray(categories) && categories.map((category) => {
              if (!category || !category.id) return null;
              
              console.log('Category:', category.name, 'Icon:', category.Icon);
              
              return (
                <div key={category.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-center">
                    <div className="text-3xl mb-2 flex justify-center items-center">
                      {category.Icon && category.Icon.url ? (
                        <img 
                          src={`http://localhost:1337${category.Icon.url}`}
                          alt={category.Icon.alternativeText || category.name}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            console.log('Image failed to load:', category.Icon?.url);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-4xl">{getJobEmoji(category.name)}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {category.name || 'Unknown Category'}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Job Listings Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Job Opportunities</h2>
          {!Array.isArray(jobListings) || jobListings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-4xl mb-4">💼</div>
              <p className="text-gray-600 mb-4">No job listings found. Add some job opportunities in your Strapi admin!</p>
              <a
                href="http://localhost:1337/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Strapi Admin
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobListings.map((job) => {
                if (!job || !job.id) return null;
                
                return (
                  <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 flex-1">
                        {job.title || 'Job Title Not Specified'}
                      </h3>
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {job.type || 'Full-time'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">🏢</span>
                        <span>{job.company || 'Company Not Specified'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📍</span>
                        <span>{job.location || 'Location Not Specified'}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">💰</span>
                          <span>{job.salary}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4 text-sm">
                      {getDescription(job.description)}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* API Status Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✅</span>
                <span className="font-medium">Categories API</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {Array.isArray(categories) ? categories.length : 0} categories loaded
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-blue-600 mr-2">💼</span>
                <span className="font-medium">Job Listings API</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {Array.isArray(jobListings) ? jobListings.length : 0} job opportunities loaded
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <ContactForm />
    </div>
  );
}