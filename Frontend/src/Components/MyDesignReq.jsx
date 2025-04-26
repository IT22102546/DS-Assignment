import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'flowbite-react';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

export default function MyDesignRequests() {
  const [designRequests, setDesignRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNormalDesigns, setShowNormalDesigns] = useState(true);
  const [showImageDesigns, setShowImageDesigns] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchDesignRequests = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/designs/getDesignRequestsByUser/${currentUser._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('No Available requests');
        }

        const data = await response.json();
        // Sort by creation date (newest first)
        const sortedDesigns = data.designs.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDesignRequests(sortedDesigns);
        setFilteredRequests(sortedDesigns);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchDesignRequests();
    }
  }, [currentUser]);

  useEffect(() => {
    const filtered = designRequests.filter(request => {
      const isNormalDesign = !request.isImageDesign;
      const isImageDesign = request.isImageDesign;
      
      return (showNormalDesigns && isNormalDesign) || 
             (showImageDesigns && isImageDesign);
    });
    setFilteredRequests(filtered);
  }, [showNormalDesigns, showImageDesigns, designRequests]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <p className="text-lg">Loading your design requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-purple-800">
        My Design Requests
      </h1>
      
      {/* Filter Checkboxes - Centered */}
      <div className="flex justify-center space-x-6 mb-8">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="normalDesigns"
            checked={showNormalDesigns}
            onChange={() => setShowNormalDesigns(!showNormalDesigns)}
            className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
          />
          <label htmlFor="normalDesigns" className="ml-2 text-gray-700">
            Normal Designs
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="imageDesigns"
            checked={showImageDesigns}
            onChange={() => setShowImageDesigns(!showImageDesigns)}
            className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
          />
          <label htmlFor="imageDesigns" className="ml-2 text-gray-700">
            Image Designs
          </label>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        {filteredRequests.length === 0 ? (
          <div className="flex items-center justify-center w-full py-12">
            <p className="text-gray-500 text-lg">
              No design requests found matching your filters.
            </p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRequests.map((designRequest) => (
              <Card
                key={designRequest._id}
                className={`w-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                  designRequest.isImageDesign ? 'h-full' : 'h-64'
                }`}
              >
                <div className="flex flex-col h-full p-4">
                  <h2 className="text-xl font-semibold text-purple-700 mb-3 truncate">
                    {designRequest.shopName}
                  </h2>
                  
                  {/* Image Section - Only for image designs */}
                  {designRequest.isImageDesign && designRequest.designImage && (
                    <div className="mb-3 w-full aspect-square overflow-hidden rounded-lg">
                      <img 
                        src={designRequest.designImage} 
                        alt="Design Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Details Section */}
                  <div className={`space-y-2 ${designRequest.isImageDesign ? 'flex-grow mb-4' : ''}`}>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Type:</span> {designRequest.isImageDesign ? 'Image' : 'Normal'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Cake:</span> {designRequest.cakeType}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Shape:</span> {designRequest.cakeShape}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Size:</span> {designRequest.cakeSize}
                    </p>
                    
                    {/* Additional Image Design Details */}
                    {designRequest.isImageDesign && (
                      <>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Color:</span> {designRequest.baseColor}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Flavor:</span> {designRequest.flavor}
                        </p>
                        {designRequest.cakeMessage && (
                          <p className="text-sm text-gray-600 truncate">
                            <span className="font-medium">Message:</span> {designRequest.cakeMessage}
                          </p>
                        )}
                        {designRequest.additionalDetails && (
                          <p className="text-sm text-gray-600 truncate">
                            <span className="font-medium">Notes:</span> {designRequest.additionalDetails}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* Status Section */}
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      {designRequest.isAccept ? (
                        <div className="flex items-center space-x-2">
                          <FaCheckCircle className="text-green-500 text-xl" />
                          <p className="text-sm text-green-600 font-medium">
                            Accepted
                          </p>
                        </div>
                      ) : designRequest.isReject ? (
                        <div className="flex items-center space-x-2">
                          <FaTimesCircle className="text-red-500 text-xl" />
                          <p className="text-sm text-red-600 font-medium">
                            Rejected
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <FaHourglassHalf className="text-yellow-500 text-xl" />
                          <p className="text-sm text-yellow-600 font-medium">
                            Pending
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}