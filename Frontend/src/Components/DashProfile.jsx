import { Alert, Button, Modal, Spinner, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import { Link } from "react-router-dom";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOut, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
import { HiOutlineExclamationCircle, HiOutlineTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function DashProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading } = useSelector(state => state.user);
  const [image, setImage] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(null);
  const [description, setDescription] = useState(currentUser.description || '');
  const [formData, setFormData] = useState({
    serviceAreas: currentUser.serviceAreas ? [...currentUser.serviceAreas] : [],
    description: currentUser.description || '',
    events: currentUser.events || [],
    workImages: currentUser.workImages || [] // Added workImages to formData
  });
  const [events, setEvents] = useState(currentUser.events || []);
  const [workImages, setWorkImages] = useState(currentUser.workImages || []); // State for work images
  const [workImageFile, setWorkImageFile] = useState(null);
  const [workImageUrl, setWorkImageUrl] = useState(null);
  const [workImagePercent, setWorkImagePercent] = useState(0);
  const [workImageError, setWorkImageError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const filePickerRef = useRef(null);
  const workImagePickerRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const addNewEvent = () => {
    setEvents([...events, { name: '', description: '' }]);
  };

  const removeEvent = (index) => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
    setFormData({ ...formData, events: updatedEvents });
  };

  const handleEventChange = (index, field, value) => {
    const updatedEvents = [...events];
    updatedEvents[index][field] = value;
    setEvents(updatedEvents);
    setFormData({ ...formData, events: updatedEvents });
  };

  const allDistricts = [
    "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
    "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
    "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
    "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
    "Moneragala", "Ratnapura", "Kegalle"
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleWorkImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setWorkImageFile(file);
      setWorkImageUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image]);

  useEffect(() => {
    if (workImageFile) {
      uploadWorkImage();
    }
  }, [workImageFile]);

  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(progress.toFixed(0));
      },
      (error) => {
        setImageError("Image size should be less than 5mb");
        console.error("Upload error:", error);
        setImagePercent(null);
        setImage(null);
        setImageFileUrl(null);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
        } catch (error) {
          console.error("Error getting download URL:", error);
          setImageError("Error uploading image");
          setImagePercent(null);
          setImage(null);
          setImageFileUrl(null);
        }
      }
    );
  };

  const uploadWorkImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + workImageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, workImageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setWorkImagePercent(progress.toFixed(0));
      },
      (error) => {
        setWorkImageError("Image size should be less than 5mb");
        console.error("Upload error:", error);
        setWorkImagePercent(null);
        setWorkImageFile(null);
        setWorkImageUrl(null);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setWorkImageUrl(null);
          setWorkImageFile(null);
          setWorkImagePercent(null);
          setWorkImages(prev => [...prev, downloadURL]);
          setFormData(prev => ({ ...prev, workImages: [...prev.workImages, downloadURL] }));
        } catch (error) {
          console.error("Error getting download URL:", error);
          setWorkImageError("Error uploading image");
          setWorkImagePercent(null);
          setWorkImageFile(null);
          setWorkImageUrl(null);
        }
      }
    );
  };

  const removeWorkImage = (index) => {
    const updatedImages = [...workImages];
    updatedImages.splice(index, 1);
    setWorkImages(updatedImages);
    setFormData({ ...formData, workImages: updatedImages });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => {
        let updatedServiceAreas = [...prevData.serviceAreas];
        if (checked) {
          if (!updatedServiceAreas.includes(value)) {
            updatedServiceAreas.push(value);
          }
        } else {
          updatedServiceAreas = updatedServiceAreas.filter((area) => area !== value);
        }
        return { ...prevData, serviceAreas: updatedServiceAreas };
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value
      }));
    }
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
    setFormData(prevData => ({
      ...prevData,
      description: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`http://localhost:4000/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setUpdateUserError(data.message);
        setUpdateSuccess(null);
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess("User profile updated successfully");
      setUpdateUserError(null);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdateUserError(error.message);
      setUpdateSuccess(null);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure());
        return;
      }
      dispatch(deleteUserSuccess());
      navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/user/signout');
      dispatch(signOut());
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>

      <h1 className='my-7 text-center text-pink-800 font-semibold text-3xl'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Profile Image Upload */}
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {imagePercent > 0 && imagePercent < 100 && (
            <CircularProgressbar
              value={imagePercent}
              text={`${imagePercent}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imagePercent / 100})`,
                },
              }}
              aria-label='Uploading Image'
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full border-8 border-[lightgray] ${imagePercent && imagePercent < 100 ? 'opacity-60' : ''}`}
            aria-label='User Profile Image'
          />
        </div>
        {imageError && <Alert color='failure'>{imageError}</Alert>}

        <TextInput
          type='text'
          id='username'
          placeholder={currentUser.isAdmin ? 'Shop Name' : 'username'}
          defaultValue={currentUser.username}
          onChange={handleChange}
        />

        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />

        <TextInput
          type='text'
          id='adress'
          placeholder='adress'
          defaultValue={currentUser.adress}
          onChange={handleChange}
        />

        <TextInput
          type='text'
          id='mobile'
          placeholder='mobile'
          defaultValue={currentUser.mobile}
          onChange={handleChange}
        />

        {currentUser.isRider && (
          <>
            <TextInput
              type="number"
              id="age"
              placeholder="age"
              defaultValue={currentUser.age}
              onChange={handleChange}
            />
            <TextInput
              type="text"
              id="Idnumber"
              placeholder="Idnumber"
              defaultValue={currentUser.IdNumber}
              onChange={handleChange}
            />
          </>
        )}

        {currentUser.isTeam && (
          <div className="space-y-4">
            {/* Service Areas Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Service Areas:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {allDistricts.map((district) => (
                  <div key={district} className="flex items-center">
                    <input
                      type="checkbox"
                      id={district}
                      value={district}
                      checked={formData.serviceAreas.includes(district)}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={district} className="ml-2 block text-sm text-gray-700">
                      {district}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Description Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Your Team Description
              </label>
              <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={handleDescriptionChange}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, false] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                  formats={[
                    'header',
                    'bold', 'italic', 'underline', 'strike', 'blockquote',
                    'list', 'bullet',
                    'link', 'image'
                  ]}
                  placeholder="Write your team description here..."
                  className="h-48"
                />
              </div>
            </div>

            {/* Event Covers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Covers
              </label>
              <Button
                type="button"
                onClick={addNewEvent}

                className="mb-4 bg-[#FE8180] hover:bg-[#e57373] text-white"

              >
                + Add Event
              </Button>
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Event {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeEvent(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <TextInput
                      type="text"
                      placeholder="Event Name"
                      value={event.name}
                      onChange={(e) => handleEventChange(index, 'name', e.target.value)}
                      className="mb-2"
                    />
                    <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={event.description}
                        onChange={(value) => handleEventChange(index, 'description', value)}
                        modules={{
                          toolbar: [
                            ['bold', 'italic', 'underline'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['link'],
                            ['clean']
                          ]
                        }}
                        placeholder="Event description..."
                        className="h-32"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Images Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Showcase Your Work (Upload up to 4 images)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleWorkImageChange}
                ref={workImagePickerRef}
                hidden
                disabled={workImages.length >= 4}
              />
              <Button
                type="button"
                onClick={() => workImagePickerRef.current.click()}
                disabled={workImages.length >= 4}

                className="mb-2 bg-[#FE8180] hover:bg-[#e57373] text-white"

              >
                {workImagePercent > 0 ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    {workImagePercent}%
                  </>
                ) : (
                  '+ Add Work Image'
                )}
              </Button>
              {workImageError && <Alert color="failure">{workImageError}</Alert>}
              {workImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {workImages.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Work sample ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeWorkImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <HiOutlineTrash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Password Field */}
        <div>
          <div className="relative">
            <TextInput
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              id="password"
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute top-2 right-3 focus:outline-none"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5c5.185 0 9.448 4.014 9.95 9.048a.944.944 0 0 1 0 .904C21.448 16.486 17.185 20.5 12 20.5S2.552 16.486 2.05 13.452a.944.944 0 0 1 0-.904C2.552 8.514 6.815 4.5 12 4.5zM12 6a9 9 0 0 0-8.72 6.752.944.944 0 0 1 0 .496A9 9 0 0 0 12 18a9 9 0 0 0 8.72-4.752.944.944 0 0 1 0-.496A9 9 0 0 0 12 6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12.75a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15a7 7 0 01-7-7M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
          className="bg-slate-400 text-black"
          disabled={loading}
        >
          {loading ? 'Loading..' : 'Update Account'}
        </Button>

        {/* Admin Links */}
        {currentUser.isAdmin && (
          <Link to='/addcake'>
            <Button
              type='button'
              gradientDuoTone='purpleToBlue'
              className='w-full , text-black bg-slate-400 '
              outline
            >
              Add Cakes
            </Button>
          </Link>
        )}

        {currentUser.isAdmin && (
          <Link to='/addsweets'>
            <Button
              type='button'
              gradientDuoTone='purpleToBlue'
              className='w-full , text-black bg-slate-400 '
              outline
            >
              Add Sweets.
            </Button>
          </Link>
        )}

        {currentUser.isAdmin && (
          <Link to='/addgift'>
            <Button
              type='button'
              gradientDuoTone='purpleToBlue'
              className='w-full , text-black bg-slate-400 '
              outline
            >
              Add Gift Boxes
            </Button>
          </Link>
        )}

        {currentUser.isAdmin && (
          <Link to='/addnature'>
            <Button
              type='button'
              gradientDuoTone='purpleToBlue'
              className='w-full , text-black bg-slate-400 '
              outline
            >
              Add Nature Products
            </Button>
          </Link>
        )}

        {currentUser.isOwner && (
          <Link to='/addblogs'>
            <Button
              type='button'
              gradientDuoTone='purpleToBlue'
              className='w-full , text-black bg-slate-400 '
              outline
            >
              Add Blogs.
            </Button>
          </Link>
        )}

        {currentUser.isTeam && (
          <Link to='/addevents'>
            <Button
              type='button'
              gradientDuoTone='purpleToBlue'
              className='w-full , text-black bg-slate-400 '
              outline
            >
              Add Events
            </Button>
          </Link>
        )}
      </form>

      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={() => setShowModel(true)} className='cursor-pointer'>
          Delete Account
        </span>
        <span onClick={handleSignOut} className='cursor-pointer'>
          Sign Out
        </span>
      </div>

      {updateSuccess && (
        <Alert color='success' className='mt-5'>
          {updateSuccess}
        </Alert>
      )}

      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}

      <Modal show={showModel} onClose={() => setShowModel(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">Are you sure you want to Delete your Account</h3>
          </div>
          <div className='flex justify-center gap-4'>
            <Button color='failure' onClick={handleDeleteUser} className="bg-red-600">
              Yes, I am sure
            </Button>
            <Button color='gray' onClick={() => setShowModel(false)} className="bg-green-600">
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}