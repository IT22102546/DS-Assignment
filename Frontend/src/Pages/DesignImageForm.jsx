import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Button, FileInput, TextInput, Select } from 'flowbite-react';

export default function DesignImageForm() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [color, setColor] = useState('');
  const [flavor, setFlavor] = useState('');
  const [message, setMessage] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopId, setShopId] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (location.state && location.state.shopName) {
      setShopName(location.state.shopName);
      setShopId(location.state.shopId);
    }
  }, [location]);

  const handleImageChange = (file) => {
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
      setImageUploadError(null);
      toast.success('Image selected successfully!');
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      setImageUploadError('Please select an image');
      return;
    }
    
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + imageFile.name;
      const storageRef = ref(storage, `designs/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setImageUrl(downloadURL);
            toast.success('Image uploaded successfully!');
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    // Validate required fields
    if (!imageUrl) {
      toast.error('Please upload an image first');
      setLoading(false);
      return;
    }
  
    if (!color || !flavor) {
      toast.error('Please fill all required fields');
      setLoading(false);
      return;
    }
  
    try {
      const designData = {
        shopId,
        shopName,
        userId: currentUser._id,
        isImageDesign: true,
        baseColor: color,
        flavor,
        cakeMessage: message,
        additionalDetails,
        designImage: imageUrl, // Firebase URL from uploaded image
        // Default values for image designs
        cakeType: 'custom',
        cakeShape: 'custom',
        cakeSize: 'custom',
        veganOption: 'non-vegan',
        addons: [] // Empty array for image designs
      };
  
      const response = await fetch('/api/designs/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(designData),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit design');
      }
  
      toast.success('Cake design submitted successfully!');
      navigate('/designCakeSuccess');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to submit your design. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] min-h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        {shopName && <p className="mb-4 text-center text-gray-600">Designing for <span className="font-medium text-pink-500">{shopName}</span></p>}
        
        <h2 className="text-3xl font-bold text-center mb-6 text-pink-800">Design Your Cake</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Upload Sample Image:</label>
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files[0])}
            className="w-full"
            required
          />
          <Button
  onClick={handleUploadImage}
  type="button"
  className="mt-2 bg-pink-600 hover:bg-pink-700 text-white"
  disabled={!imageFile || imageUploadProgress}
>
  {imageUploadProgress ? (
    <div className="w-16 h-16">
      <CircularProgressbar
        value={imageUploadProgress}
        text={`${imageUploadProgress || 0}%`}
      />
    </div>
  ) : (
    'Upload Image'
  )}
</Button>
          {imageUploadError && (
            <div className="text-red-500 mt-2">{imageUploadError}</div>
          )}
          {imageUrl && (
            <img src={imageUrl} alt="Cake Preview" className="mt-4 w-full rounded-lg" />
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Select Cake's base Color:</label>
          <TextInput
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Enter color name or HEX code"
            className="w-full"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Select Cake Flavor:</label>
          <Select
            value={flavor}
            onChange={(e) => setFlavor(e.target.value)}
            className="w-full"
            required
          >
            <option value="">Select a Flavor</option>
            <option value="vanilla">Vanilla</option>
            <option value="chocolate">Chocolate</option>
            <option value="strawberry">Strawberry</option>
            <option value="red velvet">Red Velvet</option>
          </Select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Message on Cake:</label>
          <TextInput
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message"
            className="w-full"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Additional Design Details:</label>
          <textarea
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder="Enter any additional details or special instructions for the design"
            className="w-full px-4 py-3 border rounded-lg h-32 resize-none"
          />
        </div>
        
        <Button
  type="submit"
  disabled={loading || !imageUrl}
  className={`w-full bg-pink-600 hover:bg-pink-700 text-white ${
    loading ? 'opacity-50 cursor-not-allowed' : ''
  }`}
>
  {loading ? 'Submitting...' : 'Submit Design'}
</Button>

        <ToastContainer />
      </form>
    </div>
  );
}