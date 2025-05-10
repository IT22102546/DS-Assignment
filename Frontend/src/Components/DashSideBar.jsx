import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiArchive,
  HiArrowSmRight,
  HiBookmark,
  HiBookOpen,
  HiCake,
  HiColorSwatch,
  HiGift,
  HiInbox,
  HiNewspaper,
  HiOutlineBookmarkAlt,
  HiOutlineFlag,
  HiOutlineMail,
  HiOutlineMailOpen,
  HiOutlineTerminal,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import {
  FaDelicious,
  FaEvernote,
  FaFirstOrder,
  FaGift,
  FaPersonBooth,
} from "react-icons/fa";

export default function DashSideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/user/signout");
      dispatch(signOut());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile" key="profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={
                currentUser.isRider
                  ? "Delivery"
                  : currentUser.isAdmin && currentUser.isOwner
                  ? "Owner"
                  : currentUser.isAdmin
                  ? "Shop"
                  : currentUser.isTeam
                  ? "Suprise Team"
                  : "User"
              }
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=myorders" key="myorders">
            <Sidebar.Item
              active={tab === "myorders"}
              icon={FaFirstOrder}
              as="div"
            >
              My Orders
            </Sidebar.Item>
          </Link>

          {currentUser?.isRider && (
            <>
              <Link to="/dashboard?tab=dashdelivery" key="dashdelivery">
                <Sidebar.Item
                  active={tab === "dashdelivery"}
                  icon={HiInbox}
                  as="div"
                >
                  Orders
                </Sidebar.Item>
              </Link>
              <Link
                to="/dashboard?tab=dashAssignedDeliveries"
                key="dashAssignedDeliveries"
              >
                <Sidebar.Item
                  active={tab === "dashAssignedDeliveries"}
                  icon={HiInbox}
                  as="div"
                >
                  Assigned Deliveries
                </Sidebar.Item>
              </Link>

              <Link
                to="/dashboard?tab=dashInTransmitDeliveries"
                key="dashInTransmitDeliveries"
              >
                <Sidebar.Item
                  active={tab === "dashInTransmitDeliveries"}
                  icon={HiInbox}
                  as="div"
                >
                  Pending Deliveries
                </Sidebar.Item>
              </Link>

              <Link
                to="/dashboard?tab=dashDeliveredDeliveries"
                key="dashDeliveredDeliveries"
              >
                <Sidebar.Item
                  active={tab === "dashDeliveredDeliveries"}
                  icon={HiInbox}
                  as="div"
                >
                  Delivered Deliveries
                </Sidebar.Item>
              </Link>
            </>
          )}
          <hr />
          <h1 className="text-[10px]">ADMIN</h1>
          {currentUser?.isAdmin && currentUser?.isOwner && (
            <>
              <Link to="/dashboard?tab=users" key="users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=riderreq" key="riderreq">
                <Sidebar.Item
                  active={tab === "riderreq"}
                  icon={HiOutlineMail}
                  as="div"
                >
                  Rider Requests
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=shopreq" key="shopreq">
                <Sidebar.Item
                  active={tab === "shopreq"}
                  icon={HiOutlineMailOpen}
                  as="div"
                >
                  Shop Requests
                </Sidebar.Item>
              </Link>
            </>
          )}

          {currentUser?.isAdmin && (
            <>
              <Link to="/dashboard?tab=cakes" key="cakes">
                <Sidebar.Item active={tab === "cakes"} icon={HiCake} as="div">
                  Cakes
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=orders" key="orders">
                <Sidebar.Item
                  active={tab === "orders"}
                  icon={HiArchive}
                  as="div"
                >
                  Orders
                </Sidebar.Item>
              </Link>

              <hr />
              <h1 className="text-[10px]">Rider</h1>
              <Link to="/dashboard?tab=dashdelivery" key="dashdelivery">
                <Sidebar.Item
                  active={tab === "dashdelivery"}
                  icon={HiInbox}
                  as="div"
                >
                  Orders to deliver
                </Sidebar.Item>
              </Link>

              <Link
                to="/dashboard?tab=dashAssignedDeliveries"
                key="dashAssignedDeliveries"
              >
                <Sidebar.Item
                  active={tab === "dashAssignedDeliveries"}
                  icon={HiBookmark}
                  as="div"
                >
                  Assigned Deliveries
                </Sidebar.Item>
              </Link>

              <Link
                to="/dashboard?tab=dashInTransmitDeliveries"
                key="dashInTransmitDeliveries"
              >
                <Sidebar.Item
                  active={tab === "dashInTransmitDeliveries"}
                  icon={HiColorSwatch}
                  as="div"
                >
                  Pending Deliveries
                </Sidebar.Item>
              </Link>

              <Link
                to="/dashboard?tab=dashDeliveredDeliveries"
                key="dashDeliveredDeliveries"
              >
                <Sidebar.Item
                  active={tab === "dashDeliveredDeliveries"}
                  icon={HiGift}
                  as="div"
                >
                  Delivered
                </Sidebar.Item>
              </Link>
            </>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}
            key="signout"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
