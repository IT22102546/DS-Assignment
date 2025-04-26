import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../Components/DashSideBar";
import DashProfile from "../Components/DashProfile";
import DashUsers from "../Components/DashUsers";
import DashCake from "../Components/DashCakes";
import DashOrders from "../Components/DashOrders";
import DashSweets from "../Components/DashSweets";
import DashRiderRequests from "../Components/DashRiderRequests";
import DashShopRequests from "../Components/DashShopRequests";
import DashBookings from "../Components/DashBookings";
import DashMyBookings from "../Components/DashMyBookings";
import DashDesign from "../Components/DashDesign";
import MyDesignReq from "../Components/MyDesignReq";
import DashBlogs from "../Components/DashBlogs";
import DashTeamRequests from "../Components/DashTeamRequest";
import DashEvents from "../Components/DashEvents";
import DashNature from "../Components/DashNature";
import DashGift from "../Components/DashGift";
import DashEventBooking from "../Components/DashEventBooking";
import DashMyEventBooking from "../Components/DashMyEventBookings";
import DashMyOrders from "../Components/DashMyOrders";
import DashDeliveryPerson from "../Components/DashDeliveryPerson";


export default function DashBoard() {
  const location = useLocation();
  const[tab,setTab]= useState();

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
  },[location.search]);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] text-gray-800 placeholder-gray-700"
>
      <div className="md:w-56" >
        <DashSideBar/>
      </div>
      {tab==='profile' && <DashProfile/>}
      {tab === 'users' && <DashUsers/>}
      {tab === 'cakes' && <DashCake/>}
      {tab == 'orders' && <DashOrders/>}
      {tab == 'sweets' && <DashSweets/>}
      {tab == 'riderreq' && <DashRiderRequests/>}
      {tab == 'shopreq' && <DashShopRequests/>}
      {tab == 'teamreq' && <DashTeamRequests/>}
      {tab == 'bookings' && <DashBookings/>}
      {tab == 'mybookings' && <DashMyBookings/>}
      {tab == 'designs' && <DashDesign/>}
      {tab == 'mydesignreq' && <MyDesignReq/>}
      {tab == 'blogs' && <DashBlogs/>}
      {tab == 'blogs' && <DashBlogs/>}
      {tab == 'events' && <DashEvents/>}
      {tab == 'nature' && <DashNature/>}
      {tab == 'gift' && <DashGift/>}
      {tab == 'eventbooking' && <DashEventBooking/>}
      {tab == 'myeventbookings' && <DashMyEventBooking/>}
      {tab == 'myorders' && <DashMyOrders/>}
      {tab == 'dashDelivery' && <DashDeliveryPerson/>}

      {/*

        {tab === 'products' && <DashProduct/>}
        {tab === 'membership' && <DashMembership/>}
        {tab === 'photo' && <DashPhotos/>}
        {tab === 'achievements' && <DashAchievement/>}
        {tab === 'bearer' && <DashBearers/>}
        {tab === 'activities' && <DashActivities/>}
        
      
      */}
      
      

      {/*
     
      {tab === 'myorders' && <DashMyOrders/>}

       */}

   
     
    </div>
  )
}