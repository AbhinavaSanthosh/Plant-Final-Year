import { Tabs } from "antd";
import React from "react";
import Products from "./Products/Products";
import UserBids from "./UserBids";
import { useSelector } from "react-redux";
import moment from "moment";

const Profile = () => {
  const { user } = useSelector((state) => state.users);

  // Define the tabs as an array of objects
  const items = [
    {
      key: "1",
      label: "Products",
      children: <Products />,
    },
    {
      key: "2",
      label: "My Bids",
      children: <UserBids />,
    },
    {
      key: "3",
      label: "General",
      children: (
        <div className="flex flex-col w-1/3">
          <span className="text-xl flex justify-between uppercase">
            Name: <span className="text-xl"> {user.name}</span>
          </span>

          <span className="text-xl flex justify-between">
            Email: <span className="text-xl"> {user.email}</span>
          </span>

          <span className="text-xl flex justify-between uppercase">
            Create Account Date:{" "}
            <span className="text-xl">
              {moment(user.createdAt).format("MMM D, YYYY hh:mm A")}
            </span>
          </span>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default Profile;
