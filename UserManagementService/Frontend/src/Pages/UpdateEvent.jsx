import { Alert, Button, TextInput, Label } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";

export default function UpdateEvent() {
  const { productId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    occasions: [],
  });
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [occasionInput, setOccasionInput] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/getevents?productId=${productId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }

        const event = data.products.find(p => p._id === productId);
        setFormData({ 
          ...event, 
          occasions: event.occasions || [] 

        });
        setPublishError(null);
      } catch (error) {
        setPublishError(error.message);
      }
    };

    fetchEvent();
  }, [productId]);

  const handleAddOccasion = () => {
    if (occasionInput.trim() === "") return;
    setFormData({
      ...formData,

      occasions: [...formData.occasions, occasionInput]

    });
    setOccasionInput("");
  };

  const handleRemoveOccasion = (index) => {
    const newOccasions = [...formData.occasions];
    newOccasions.splice(index, 1);
    setFormData({
      ...formData,

      occasions: newOccasions

    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishError(null);
    setPublishSuccess(null);

    
    try {
      const res = await fetch(`/api/events/updateevent/${productId}/${currentUser._id}`, {
        method: "PUT",
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


      setPublishSuccess('Package updated successfully!');
      setTimeout(() => {
        navigate('/dashboard?tab=events');

      }, 1500);
    } catch (error) {
      console.error(error);
      setPublishError("Something went wrong");
    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)]">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-slate-50 rounded-xl shadow-md p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-pink-800 mb-6">
              Update Package
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
              <div className="flex-1">
                <Label
                  htmlFor="title"
                  value="Package Title"
                  className="text-[#623B1C]"
                />
                <TextInput
                  id="title"
                  type="text"
                  placeholder="e.g., Premium Birthday Package"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="border-[#FE8180] focus:ring-[#FE8180]"
                />
              </div>
              <div className="w-32">
                <Label
                  htmlFor="price"
                  value="Price (LKR)"
                  className="text-[#623B1C]"
                />
                <TextInput
                  id="price"
                  type="number"
                  placeholder="e.g., 25000"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="border-[#FE8180] focus:ring-[#FE8180]"
                />
              </div>
            </div>

            {/* Occasions */}
            <div>
              <Label value="Occasions" className="text-[#623B1C]" />
              <div className="flex items-center gap-2 mb-2">
                <TextInput
                  type="text"
                  placeholder="Add occasion (e.g., Birthday, Anniversary)"
                  value={occasionInput}
                  onChange={(e) => setOccasionInput(e.target.value)}
                  className="flex-1 border-[#FE8180] focus:ring-[#FE8180]"
                />
                <Button
                  type="button"
                  onClick={handleAddOccasion}
                  className="bg-[#FE8180] hover:bg-[#e57373]"
                >
                  <HiOutlinePlus className="mr-1" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.occasions?.map((occasion, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm text-[#623B1C]">{occasion}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOccasion(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <HiOutlineTrash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                color="gray"
                onClick={() => navigate("/dashboard?tab=events")}
                className="bg-[#F5F5F5] hover:bg-[#E0E0E0]"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#FE8180] hover:bg-[#e57373]">
                Update Package
              </Button>
            </div>

            {/* Status Messages */}
            {publishError && (
              <Alert color="failure" className="mt-4">
                {publishError}
              </Alert>
            )}
            {publishSuccess && (
              <Alert color="success" className="mt-4">
                {publishSuccess}
              </Alert>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}