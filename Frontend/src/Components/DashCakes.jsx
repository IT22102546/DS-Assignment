import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiGift, HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import html2pdf from 'html2pdf.js';

export default function DashCake() {
  const { currentUser } = useSelector((state) => state.user);
  const [userProduct, setUserProduct] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [lastMonthProducts, setlastMonthProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const apiUrl = import.meta.env.VITE_Inventory_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/inventory/getadmincakes?searchTerm=${searchTerm}`, {
          headers: {
            'userid': currentUser._id, 
          },
        });
        
        
        const data = await res.json();
        if (res.ok) {
          setUserProduct(data.products);
          setTotalProducts(data.totalProducts);
          setlastMonthProducts(data.lastMonthProducts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  const handleDeleteProduct = async () => {
    setShowModel(false);
    try {
      const res = await fetch(
        `${apiUrl}/api/inventory/deletecake/${productIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserProduct((prev) =>
          prev.filter((product) => product._id !== productIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const generatePDFReport = () => {
    const content = `
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
          font-size: 14px; /* Adjust font size */
        }
        td {
          font-size: 12px; /* Adjust font size */
        }
      </style>
      <h1><b>Product Details Report</b></h1>
      <p>Total Products: ${totalProducts}</p>
      <p>Last Month Products: ${lastMonthProducts}</p>
      <br>
      <br>
      <table>
        <thead>
          <tr>
            <th>Updated At</th>
            <th>Title</th>
            <th>Category</th>
            <th>Unit Price</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          ${userProduct.map((product) => `
            <tr>
              <td>${new Date(product.createdAt).toLocaleDateString()}</td>
              <td>${product.title}</td>
              <td>${product.category}</td>
              <td>${product.price}</td>
              <td>${product.type}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    html2pdf().from(content).set({ margin: 1, filename: 'Cake_report.pdf' }).save();
  };

  const handleGenerateReport = () => {
    generatePDFReport();
  };

  const handleAssignFeature = async (productId) => {
    try {
      const res = await fetch(`${apiUrl}/api/inventory/featurecake/${productId}/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Feature Updated Successfully: ", data);
        setUserProduct((prev) =>
          prev.map((product) =>
            product._id === productId ? { ...product, isFeature: true } : product
          )
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log("Error in assigning feature: ", error.message);
    }
  };

  const handleReassignFeature = async (productId) => {
    try {
      const res = await fetch(`${apiUrl}/api/inventory/unfeaturecake/${productId}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUserProduct((prev) =>
          prev.map((product) =>
            product._id === productId ? { ...product, isFeature: false } : product
          )
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleunavailable = async (productId) => {
    try {
      const res = await fetch(`${apiUrl}/api/inventory/unavailable/${productId}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUserProduct((prev) =>
          prev.map((product) =>
            product._id === productId ? { ...product, isAvailable: false } : product
          )
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleAvailable = async (productId) => {
    try {
      const res = await fetch(`${apiUrl}/api/inventory/available/${productId}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUserProduct((prev) =>
          prev.map((product) =>
            product._id === productId ? { ...product, isAvailable: true } : product
          )
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <div className='flex justify-between'>
        <input
          type="text"
          placeholder="Search Cakes.."
          value={searchTerm}
          onChange={handleSearch}
          className="px-3 py-2 w-150 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mr-2 h-10 dark:bg-slate-800 placeholder-gray-500"
        />
        <div></div>
        <Button
          gradientDuoTone='purpleToBlue'
          outline
          onClick={handleGenerateReport}
          className=""
        >
          Generate Report
        </Button>
      </div>

      <div className='flex-wrap flex gap-4 justify-center p-3'>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Cake Made</h3>
              <p className='text-2xl'>{totalProducts}</p>
            </div>
            <HiGift className='bg-red-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
        </div>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>
                Last Month Production
              </h3>
              <p className='text-2xl text-black'>{lastMonthProducts}</p>
            </div>
            <HiGift className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
        </div>
      </div>
      {currentUser.isAdmin && userProduct.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Cake Image</Table.HeadCell>
              <Table.HeadCell>Cake Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Type</Table.HeadCell>
              <Table.HeadCell>Availability</Table.HeadCell>
              <Table.HeadCell>Feature</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {userProduct.map((product) => (
              <Table.Body className='divide-y' key={product._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(product.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/cake/${product.slug}`}>
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='font-medium text-gray-900 dark:text-white' to={`/product/${product.slug}`}>
                      {product.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{product.category}</Table.Cell>
                  <Table.Cell>{product.type}</Table.Cell>

                  <Table.Cell>
                    {product.isAvailable ? (
                      <Button color='failure' onClick={() => handleunavailable(product._id)}>
                        Make Unavailble
                      </Button>
                    ) : (
                      <Button color='success' onClick={() => handleAvailable(product._id)}>
                        Make Available
                      </Button>
                    )}
                  </Table.Cell>
                 
                  <Table.Cell>
                    {product.isFeature ? (
                      <Button color='failure' onClick={() => handleReassignFeature(product._id)}>
                        Reassign from Signature
                      </Button>
                    ) : (
                      <Button color='success' onClick={() => handleAssignFeature(product._id)}>
                        Assign as Signature
                      </Button>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer'
                      onClick={() => {
                        setShowModel(true);
                        setProductIdToDelete(product._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='text-teal-500 hover:underline' to={`/update-cake/${product._id}`}>
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>You have no products to show</p>
      )}
      <Modal show={showModel} onClose={() => setShowModel(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">Are you sure you want to Delete this Product</h3>
          </div>
          <div className='flex justify-center gap-4'>
            <Button color='failure' onClick={handleDeleteProduct}>
              Yes, I am sure
            </Button>
            <Button color='gray' onClick={() => setShowModel(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}