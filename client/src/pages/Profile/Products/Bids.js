import { Button, Divider, Modal, Table, message } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllBids, updateProductStatus } from "../../../Apicalls/products";
import { SetLoader } from "../../../redux/LoadersSlice";
import { AddNotification } from "../../../Apicalls/notification";

const Bids = ({ showBidsModel, setshowBidsModel, selectedProduct, getData }) => {
  const [bidsData, setbidsData] = useState([]);

  const dispatch = useDispatch();

  const getBidscall = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await getAllBids({
        product: selectedProduct._id,
      });
      dispatch(SetLoader(false));
      if (response.success) {
        message.success("Fetching Bids");
        setbidsData(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const sellThePlant = async (bid) => {
    try{
      console.log(bid);
      
      dispatch(SetLoader(true));
      const response = await updateProductStatus(selectedProduct._id, 'sold');
      await AddNotification({
        title:"Product Sold to you",
        message:`${bid.seller.name} accepted your Bid and sold the ${bid.product.name} to you for amount ${bid.bidAmount}`,
        user:bid.buyer._id,
        onClick:'/profile',
        read:false
      })
      dispatch(SetLoader(false));
      if(response.success){
        message.success('Product Sold');
        setshowBidsModel(false);
      }else{
        throw new Error(response.message);
      }
    }
    catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
    finally{
      getData();
    }
  };

  const columns = [
    {
      title: "Bids Placed On",
      dataIndex: "createdAt",
      render: (text, record) => {
        return moment(record.createdAt).format("DD-MM-YYYY hh:mm A");
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => {
        return record.buyer.name;
      },
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "Contact Details",
      dataIndex: "contactDetails",
      render: (text, record) => {
        return (
          <div>
            <p>Phone: {record.mobile}</p>
            <p>Email: {record.buyer.email}</p>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => sellThePlant(record)}
          className="bg-green-500"
        >
          Sell
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (selectedProduct) {
      getBidscall();
    }
  }, [selectedProduct]);

  return (
    <Modal
      title=""
      open={showBidsModel}
      onCancel={() => setshowBidsModel(false)}
      centered
      width={1200}
      footer={null}
    >
      <h1 className="text-xl text-primary">Bids</h1>
      <Divider />
      <h1 className="text-xl">Product Name : {selectedProduct.name}</h1>

      <Table columns={columns} dataSource={bidsData} rowKey="_id" />
    </Modal>
  );
};

export default Bids;
