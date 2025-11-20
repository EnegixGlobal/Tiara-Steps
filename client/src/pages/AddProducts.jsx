import React, { useState } from "react";
import ProductForm from "../components/ProductForm";
import Axios from "../Axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddProducts = () => {
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
  });
  const [link, setLink] = useState(null);
  const [imageLinks, setImageLinks] = useState([]);
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  const changeFields = (e) => {
    setFields(e);
  };

  const changeLink = (e) => {
    setLink(e);
  };

  const changeImageLinks = (e) => {
    setImageLinks(e);
  };

  const handleInputChange = (event) => {
    setData({ ...data, [event.target.id]: event.target.value });
  };

  const changeCategory = (e) => {
    setData({ ...data, category: e });
  };

  const changeColor = (e) => {
    setData({ ...data, color: e });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtAdmin");
      if (!token) {
        return toast.error("Access denied.");
      }
      const validFields = fields.filter((field) => field && field.quantity > 0);
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
        !data.featured ||
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
      };
      const response = await Axios.post(
        "/product/create",
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

  return (
    <div className="font-sans my-[2%] mx-[3%] mb-[4%]">
      <h1 className="text-2xl leading-8 font-semibold text-left mb-4">
        Add Product
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
          name="Add Product"
          changeCategory={changeCategory}
          changeColor={changeColor}
          handleSubmit={handleSubmit}
          handleCancel={() => navigate("/admin/products")}
        />
      </div>
    </div>
  );
};

export default AddProducts;
