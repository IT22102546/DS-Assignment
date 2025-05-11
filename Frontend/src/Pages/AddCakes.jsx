import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; 

export default function AddCakes() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([null, null, null, null]);
  const [imageUploadProgress, setImageUploadProgress] = useState([null, null, null, null]);
  const [imageUploadError, setImageUploadError] = useState([null, null, null, null]);
  const [formData, setFormData] = useState({
    title: "",
    category: "uncategorized",
    type: "uncategorized",
    price: "",
    description: "",
    images: [],
    mainImage: "",
    userId: currentUser?._id || "", 
  });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const apiUrl = import.meta.env.VITE_Inventory_API_URL;
  const handleFileChange = (index, file) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);
  };

  const handleUploadImage = (index) => {
    const file = files[index];
    if (!file) {
      const newErrors = [...imageUploadError];
      newErrors[index] = "Please select an image";
      setImageUploadError(newErrors);
      return;
    }

    const newErrors = [...imageUploadError];
    newErrors[index] = null;
    setImageUploadError(newErrors);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const newProgress = [...imageUploadProgress];
        newProgress[index] = progress.toFixed(0);
        setImageUploadProgress(newProgress);
      },
      (error) => {
        console.error(error);
        const newErrors = [...imageUploadError];
        newErrors[index] = "Image upload failed";
        setImageUploadError(newErrors);
        const newProgress = [...imageUploadProgress];
        newProgress[index] = null;
        setImageUploadProgress(newProgress);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const newProgress = [...imageUploadProgress];
        newProgress[index] = null;
        setImageUploadProgress(newProgress);
        const newErrors = [...imageUploadError];
        newErrors[index] = null;
        setImageUploadError(newErrors);

        const newImages = [...formData.images];
        newImages[index] = downloadURL;
        setFormData({ ...formData, images: newImages, mainImage: newImages[mainImageIndex] });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/inventory/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      setPublishError(null);
      navigate(`/cake/${data.slug}`);
    } catch (error) {
      console.error(error);
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Add Cake</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value="uncategorized">Uncategorized</option>
            <option value="Birthday">Birthday Cakes</option>
            <option value="Wedding">Wedding Cakes</option>
            <option value="Custom">Custom Cakes</option>
          </Select>
        </div>

        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput type="file" accept="image/*" onChange={(e) => handleFileChange(index, e.target.files[0])} />
            <Button onClick={() => handleUploadImage(index)} type="button" size="sm" outline disabled={imageUploadProgress[index]}>
              {imageUploadProgress[index] ? (
                <div className="w-16 h-16">
                  <CircularProgressbar value={imageUploadProgress[index]} text={`${imageUploadProgress[index] || 0}`} />
                </div>
              ) : (
                "Upload Image"
              )}
            </Button>
            <Button
              onClick={() => setMainImageIndex(index)}
              type="button"
              size="sm"
              className={`bg-slate-400 ${mainImageIndex === index ? "bg-teal-500" : ""}`}
            >
              {mainImageIndex === index ? "Main Image" : "Set as Main Image"}
            </Button>
          </div>
        ))}

        {imageUploadError.map((error, index) => error && <Alert key={index} color="failure">{error}</Alert>)}
        {formData.images.map((image, index) => image && <img key={index} src={image} alt="Upload Preview" className="w-full h-82 object-cover" />)}

        <ReactQuill
          theme="snow"
          placeholder="Description..."
          className="h-52 mb-12"
          onChange={(value) => {
            const sanitizedValue = value.replace(/<\/?[^>]+(>|$)/g, "");
            setFormData({ ...formData, description: sanitizedValue });
          }}
        />

        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
          <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
            <option value="uncategorized">Uncategorized</option>
            <option value="Vegan">Vegan</option>
            <option value="Non-vegan">Non-vegan</option>
            <option value="Sugar-Free">Sugar-Free</option>
            <option value="Gluten-Free">Gluten-Free</option>
            <option value="Halal">Halal</option>
          </Select>
        </div>

        <Button type="submit" className="bg-slate-400">Add Cake</Button>
        {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
