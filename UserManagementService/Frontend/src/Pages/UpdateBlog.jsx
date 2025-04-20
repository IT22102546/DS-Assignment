import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css"; // Import React Quill styles
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";

export default function UpdateBlog() {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [Blogname, setname] = useState([]);
  const [des, setdes] = useState();
  const [category, setcat] = useState();
  const [image, setimage] = useState();

  const navigate = useNavigate();

  const handleUploadImage = () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          console.error("Upload error:", error);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, Picture: downloadURL });
            setimage(downloadURL);
          });
        }
      );
    } catch (error) {
      setImageUploadError("Failed to upload image");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchevent = async () => {
      try {
        const res = await fetch(`/api/blogs/getblog/${id}`);
        const data = await res.json();
        if (res.ok) {
          setname(data.Blogname);
          setcat(data.category);
          setdes(data.descreption);
          setimage(data.Picture);
          setFormData({
            Blogname: data.Blogname,
            category: data.category,
            descreption: data.descreption,
            Picture: data.Picture,
          });
        } else {
          console.log("Error fetching news:", data.message);
        }
      } catch (error) {
        console.log("Fetch error:", error.message);
      }
    };

    fetchevent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting Update Request:", formData);

      const res = await fetch(`/api/blogs/updateblog/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Update Error:", data.message);
        setPublishError(data.message);
        return;
      }

      setPublishError(null);
      navigate("/dashboard?tab=blogs");
    } catch (error) {
      console.error("Update Error:", error.message);
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] min-h-screen">
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-pink-800 text-3xl my-7 font-semibold">
          Update Blog
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              placeholder="Blog Title"
              required
              id="blogName"
              className="flex-1"
              onChange={(e) =>
                setFormData({ ...formData, Blogname: e.target.value })
              }
              value={formData.Blogname}
            />
            <Select
              className="text-black"
              onChange={(e) => {
                setcat(e.target.value); // Update UI
                setFormData({ ...formData, category: e.target.value }); // Sync with formData
              }}
              value={formData.category || category || "uncategorized"} // Ensure fallback value
            >
              <option value="uncategorized">Select a category</option>
              <option value="Cakes">Cakes</option>
              <option value="Sweets">Sweets</option>
            </Select>
          </div>

          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button
              onClick={handleUploadImage}
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              outline
              disabled={imageUploadProgress}
            >
              {imageUploadProgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}`}
                  />
                </div>
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>

          {imageUploadError && (
            <Alert color="failure">{imageUploadError}</Alert>
          )}
          {image && (
            <img
              src={image}
              alt="upload"
              className="w-full h-82 object-cover"
            />
          )}

          <div className="mb-12">
            <ReactQuill
              value={formData.descreption || des}
              onChange={(value) =>
                setFormData({ ...formData, descreption: value })
              }
              placeholder="Write your description here..."
            />
          </div>

          <Button type="submit" className="max-w-md w-full bg-[#FE8180] hover:bg-[#e57373] mx-auto flex items-center justify-center">
            Update
          </Button>
          {publishError && (
            <Alert className="mt-5" color="failure">
              {publishError}
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}
