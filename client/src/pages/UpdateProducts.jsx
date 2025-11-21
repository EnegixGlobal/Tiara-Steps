import React, { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import Axios from "../Axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import TriangleLoader from "../components/TriangleLoader";

const UpdateProducts = () => {
  const { slug } = useParams();
  const [data, setData] = useState({
    name: "",
    desc: "",
    sku: "",
    price: "",
    mrp: "",
    color: "",
    brand: "",
    material: "",
    category: "",
    featured: "false",
    parentProductId: "",
  });
  const [link, setLink] = useState(null);
  const [imageLinks, setImageLinks] = useState([]);
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentProductId, setCurrentProductId] = useState(null);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await Axios.get(`/product/${slug}`);
        setLink(response.data.data.image);
        // Set multiple images if available, otherwise empty array
        setImageLinks(response.data.data.images && Array.isArray(response.data.data.images) 
          ? response.data.data.images 
          : []);
        const newFields = [...fields];
        response.data.data.sizeQuantity.forEach((field) => {
          newFields[field.size - 3] = {
            size: field.size,
            quantity: field.quantity,
          };
        });
        setFields(newFields);
        // Handle color - if it's an array, join it; if it's a string, use it as is
        const productColor = Array.isArray(response.data.data.color) 
          ? response.data.data.color.join(",") 
          : response.data.data.color || "";
        
        setData({
          ...data,
          brand: response.data.data.brand,
          color: productColor,
          desc: response.data.data.description,
          featured: response.data.data.isFeatured,
          material: response.data.data.material,
          name: response.data.data.name,
          price: response.data.data.price,
          mrp: response.data.data.mrp ?? response.data.data.price,
          sku: response.data.data.sku,
          category: response.data.data.category,
          parentProductId: response.data.data.parentProduct || "",
        });
        setCurrentProductId(response.data.data._id);
        setLoading(false);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong", {
          position: "bottom-right",
        });
        navigate("/admin/products");
      }
    };
    fetchProduct();
  }, []);

  const changeFields = (e) => {
    setFields(e);
  };

  const changeLink = (e) => {
    setLink(e);
  };

  const changeImageLinks = (e) => {
    setImageLinks(e);
  };
  const changeCategory = (e) => {
    setData({ ...data, category: e });
  };

  const changeColor = (e) => {
    setData({ ...data, color: e });
  };
  const handleInputChange = (event) => {
    setData({ ...data, [event.target.id]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtAdmin");
      if (!token) {
        return toast.error("Access denied.");
      }
      const validFields = fields.filter((field) => field && field.quantity > 0);
      console.log({ ...data, sizeQuantity: validFields, image: link });
      if (
        validFields.length === 0 ||
        !data.name ||
        !data.desc ||
        !data.sku ||
        !data.price ||
        !data.mrp ||
        !data.color ||
        !data.brand ||
        !data.material ||
        !link
      ) {
        return toast.error("Please fill all the fields.");
      }
      if (Number(data.mrp) < Number(data.price)) {
        return toast.error("MRP should be greater than or equal to selling price.");
      }

      const payload = {
        ...data,
        price: Number(data.price),
        mrp: Number(data.mrp),
        sizeQuantity: validFields,
        image: link,
        images: imageLinks && imageLinks.length > 0 ? imageLinks : [],
        parentProductId: data.parentProductId || "",
      };
      const response = await Axios.put(
        `/product/update/${slug}`,
        payload,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/admin/products");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  if (loading) return <TriangleLoader height="500px" />;
  return (
    <div className="font-sans my-[2%] mx-[3%] mb-[4%]">
      <h1 className="text-2xl leading-8 font-semibold text-left mb-4">
        Update Product
      </h1>
      <div className="flex flex-row gap-4 max-[600px]:flex-col">
        <ProductForm
          link={link}
          changeLink={changeLink}
          imageLinks={imageLinks}
          changeImageLinks={changeImageLinks}
          data={data}
          handleInputChange={handleInputChange}
          fields={fields}
          changeFields={changeFields}
          name="Update Product"
          changeCategory={changeCategory}
          changeColor={changeColor}
          handleSubmit={handleSubmit}
          handleCancel={() => navigate("/admin/products")}
          currentProductId={currentProductId}
        />
      </div>
    </div>
  );
};

export default UpdateProducts;
