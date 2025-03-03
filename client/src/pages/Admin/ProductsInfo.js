import { Button, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/LoadersSlice";
import { GetProducts, updateProductStatus } from "../../Apicalls/products";
import moment from "moment";

const ProductsInfo = () => {
  const [product, setProduct] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(null);
      if (response.success) {
        dispatch(SetLoader(false));
        setProduct(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const onStatusUpdate = async (id, status) => {
    try {
      dispatch(SetLoader(true));
      const response = await updateProductStatus(id, status);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Product Image",
      dataIndex: "images",
      render: (text, record) => (
        <img
          src={record?.images?.length > 0 ? record.images[0] : ""}
          alt="product"
          className="h-20 w-20 object-cover rounded-md border border-gray-200 shadow-sm"
        />
      ),
    },
    {
      title: "Product",
      dataIndex: "name",
    },
    {
      title: "Seller",
      dataIndex: "name",
      render: (text, record) => record?.seller?.name,
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "MonYears",
      dataIndex: "monYears",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Added on",
      dataIndex: "createdAt",
      render: (text) => moment(text).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const { status, _id } = record;
        return (
          <div className="flex gap-2">
            {status === "pending" && (
              <Button
                type="primary"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                Approve
              </Button>
            )}
            {status === "pending" && (
              <Button
                type="danger"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
                onClick={() => onStatusUpdate(_id, "rejected")}
              >
                Reject
              </Button>
            )}
            {status === "approved" && (
              <Button
                type="danger"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
                onClick={() => onStatusUpdate(_id, "blocked")}
              >
                Block
              </Button>
            )}
            {status === "blocked" && (
              <Button
                type="primary"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                Unblock
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-5 bg-white rounded-lg shadow-md">
      <Table
        columns={columns}
        dataSource={product}
        rowKey="_id"
        className="rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default ProductsInfo;