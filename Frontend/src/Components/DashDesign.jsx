import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Button, Table, Modal, Badge } from 'flowbite-react';
import { FaCheckCircle, FaTimesCircle, FaImage, FaExpand } from 'react-icons/fa';

export default function DashDesign() {
  const [designs, setDesigns] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState({});
  const [activeButton, setActiveButton] = useState(null);
  const [showNormalDesigns, setShowNormalDesigns] = useState(true);
  const [showImageDesigns, setShowImageDesigns] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const { currentUser } = useSelector((state) => state.user);

  const fetchDesigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/designs/getDesignsByShopId/${currentUser._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('No Available designs.');
      }

      const data = await response.json();
      const sortedDesigns = data.designs.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setDesigns(sortedDesigns);
      setFilteredDesigns(sortedDesigns);
      
      const userIds = data.designs.map((design) => design.userId);
      const uniqueUserIds = [...new Set(userIds)];

      const userPromises = uniqueUserIds.map((id) =>
        fetch(`/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((res) => res.json())
      );

      const userResponses = await Promise.all(userPromises);
      const userMap = userResponses.reduce((acc, user) => {
        acc[user._id] = user.username;
        return acc;
      }, {});
      
      setUsers(userMap);

    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchDesigns();
    }
  }, [currentUser]);

  useEffect(() => {
    const filtered = designs.filter(design => {
      const isNormalDesign = !design.isImageDesign;
      const isImageDesign = design.isImageDesign;
      
      return (showNormalDesigns && isNormalDesign) || 
             (showImageDesigns && isImageDesign);
    });
    setFilteredDesigns(filtered);
  }, [showNormalDesigns, showImageDesigns, designs]);

  const handleActionClick = async (designId, action) => {
    const response = await fetch(`/api/designs/updateStatus/${designId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        action,
      }),
    });

    if (response.ok) {
      fetchDesigns();
      setActiveButton(null);
    } else {
      setError('Error updating status.');
    }
  };

  const openDesignDetails = (design) => {
    setSelectedDesign(design);
    setShowModal(true);
  };

  const handleImageClick = (imageUrl) => {
    if (!imageUrl) return;
    setCurrentImage(imageUrl);
    setShowImageModal(true);
  };

  const handleFullscreen = async () => {
    try {
      const imgElement = document.getElementById('fullScreenImage');
      if (!imgElement) return;
      
      if (!document.fullscreenElement) {
        await imgElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setShowImageModal(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg">Loading design requests...</p>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-red-600">Error: {error}</p>
    </div>;
  }

  return (
    <div className="p-6 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">Design Requests</h1>
      
      <div className="flex space-x-6 mb-6">
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

      {filteredDesigns.length === 0 ? (

        <p className="text-center text-gray-600">No design requests available.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Design Type</Table.HeadCell>
              <Table.HeadCell>Details</Table.HeadCell>
              <Table.HeadCell>Cake Type</Table.HeadCell>
              <Table.HeadCell>Cake Shape</Table.HeadCell>
              <Table.HeadCell>Cake Size</Table.HeadCell>
              <Table.HeadCell>Vegan Option</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {filteredDesigns.map((design) => (
                <Table.Row key={design._id} className="hover:bg-gray-100">
                  <Table.Cell>{users[design.userId]}</Table.Cell>
                  <Table.Cell>
                    {design.isImageDesign ? (
                      <div className="flex items-center">
                        <FaImage className="mr-1 text-blue-500" />
                        <span>Image Design</span>
                      </div>
                    ) : 'Normal Design'}
                  </Table.Cell>
                  <Table.Cell>
                    {design.isImageDesign ? (
                      <div className="space-y-1">
                        <div className="relative group mb-2">
                          <img 
                            src={design.designImage} 
                            alt="Design preview" 
                            className="h-20 w-20 object-cover rounded cursor-pointer border border-gray-200"
                            onClick={() => handleImageClick(design.designImage)}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-200 rounded">
                            <FaExpand className="text-white opacity-0 group-hover:opacity-100" />
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Base Color: </span>
                          {design.baseColor}
                        </div>
                        <div>
                          <span className="font-medium">Flavor: </span>
                          {design.flavor}
                        </div>
                        {design.cakeMessage && (
                          <div>
                            <span className="font-medium">Message: </span>
                            {design.cakeMessage}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>{design.cakeType}</Table.Cell>
                  <Table.Cell>{design.cakeShape}</Table.Cell>
                  <Table.Cell>{design.cakeSize}</Table.Cell>
                  <Table.Cell>
                    <Badge color={design.veganOption === 'Yes' ? 'success' : 'gray'}>
                      {design.veganOption}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {design.isAccept ? (
                      <span className="flex items-center text-green-600">
                        <FaCheckCircle className="mr-1" /> Confirmed
                      </span>
                    ) : design.isReject ? (
                      <span className="flex items-center text-red-600">
                        <FaTimesCircle className="mr-1" /> Rejected
                      </span>
                    ) : (
                      <span className="text-yellow-600">Pending</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {!design.isAccept && !design.isReject && (
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            handleActionClick(design._id, 'confirm');
                            setActiveButton('confirm');
                          }}
                          color="success"
                          size="xs"
                          disabled={activeButton === 'confirm'}
                        >
                          Confirm
                        </Button>
                        <Button
                          onClick={() => {
                            handleActionClick(design._id, 'reject');
                            setActiveButton('reject');
                          }}
                          color="failure"
                          size="xs"
                          disabled={activeButton === 'reject'}
                        >
                          Reject
                        </Button>
                        {design.isImageDesign && (
                          <Button
                            onClick={() => openDesignDetails(design)}
                            color="purple"
                            size="xs"
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      <Modal 
        show={showImageModal} 
        onClose={() => {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          setShowImageModal(false);
        }} 
        size="7xl"
        dismissible
      >
        <Modal.Header className="border-none p-0">
          <div className="absolute top-2 right-2 z-10">
            <Button 
              color="gray" 
              size="xs" 
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                }
                setShowImageModal(false);
              }}
            >
              Close
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body className="p-0 bg-black flex items-center justify-center min-h-[80vh]">
          {currentImage ? (
            <div className="relative w-full h-full">
              <img 
                id="fullScreenImage"
                src={currentImage} 
                alt="Full-size design preview" 
                className="max-w-full max-h-[80vh] object-contain cursor-pointer"
                onClick={handleFullscreen}
              />
              <div className="absolute bottom-4 right-4">
                <Button 
                  color="light" 
                  size="xs" 
                  onClick={handleFullscreen}
                  className="opacity-70 hover:opacity-100"
                >
                  <FaExpand className="mr-1" /> Fullscreen
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No image available</div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Design Details</Modal.Header>
        <Modal.Body>
          {selectedDesign && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold">Customer:</h3>
                <p>{users[selectedDesign.userId]}</p>
              </div>
              <div>
                <h3 className="font-bold">Design Type:</h3>
                <p>{selectedDesign.isImageDesign ? 'Image Design' : 'Normal Design'}</p>
              </div>
              {selectedDesign.isImageDesign && (
                <>
                  <div>
                    <h3 className="font-bold">Design Image:</h3>
                    <img 
                      src={selectedDesign.designImage} 
                      alt="Design" 
                      className="max-w-full h-auto mt-2 border rounded"
                      onClick={() => handleImageClick(selectedDesign.designImage)}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">Base Color:</h3>
                    <p>{selectedDesign.baseColor}</p>
                  </div>
                </>
              )}
              <div>
                <h3 className="font-bold">Cake Type:</h3>
                <p>{selectedDesign.cakeType}</p>
              </div>
              <div>
                <h3 className="font-bold">Cake Shape:</h3>
                <p>{selectedDesign.cakeShape}</p>
              </div>
              <div>
                <h3 className="font-bold">Cake Size:</h3>
                <p>{selectedDesign.cakeSize}</p>
              </div>
              <div>
                <h3 className="font-bold">Flavor:</h3>
                <p>{selectedDesign.flavor}</p>
              </div>
              <div>
                <h3 className="font-bold">Vegan Option:</h3>
                <p>{selectedDesign.veganOption}</p>
              </div>
              {selectedDesign.cakeMessage && (
                <div>
                  <h3 className="font-bold">Message:</h3>
                  <p>{selectedDesign.cakeMessage}</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}