import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import Header from './Components/Header'
import DashBoard from './Pages/DashBoard'
import PrivateRoute from './Components/PrivateRoute'
import AddCakes from './Pages/AddCakes'
import OnlyAdminPrivateRoute from './Components/OnlyAdminPrivateRoute'
import PostCake from './Pages/PostCake'
import Cart from './Pages/Cart'
import CakePage from './Pages/CakePage'
import UpdateCake from './Pages/UpdateCake'
import OrderSummary from './Pages/OrderSummary'
import CheckoutSuccess from './Pages/CheckoutSuccess'
import DesignCake from './Pages/DesignCake'
import DesignForm from './Pages/DesignForm'
import Footer from './Components/Footer'
import AboutUs from './Pages/AboutUs'
import Booking from './Pages/Booking'
import Sweets from './Pages/Sweets'
import AddSweets from './Pages/AddSweets'
import PostSweet from './Pages/PostSweet'
import UpdateSweet from './Pages/UpdateSweets'
import DeliverySignUp from './Pages/DeliverySignUp'
import ShopSignUp from './Pages/ShopSignUp'
import Career from './Pages/Career'
import AddBlogs from './Pages/AddBlogs'
import BlogDetails from './Pages/BlogDetails'
import UpdateBlog from './Pages/UpdateBlog'
import Blogs from './Pages/Blogs'
import DesignCakeSuccess from './Pages/DesignCakeSuccess'
import BookingCakeSuccess from './Pages/BookingCakeSuccess'
import CODForm from './Pages/CODForm'
import TeamSignUp from './Pages/TeamSignUp'
import AddEvents from './Pages/AddEvents'
import PostEvent from './Pages/PostEvent'
import UpdateEvent from './Pages/UpdateEvent'
import OnlyTeamPrivateRoute from './Components/OnlyTeamPrivateRote'
import Suprise from './Pages/Suprise'
import AddNature from './Pages/AddNature'
import PostNature from './Pages/PostNature'
import UpdateNature from './Pages/UpdateNature'
import Nature from './Pages/Nature'
import AddGift from './Pages/AddGift'
import PostGift from './Pages/PostGift'
import UpdateGift from './Pages/UpdateGift'
import GiftPage from './Pages/GiftPage'
import BookingSummary from './Pages/BookingSummary'
import CakeShops from './Pages/CakeShops'
import AllProducts from './Pages/AllProducts'
import ForgetPassword from './Pages/ForgetPassword'
import ResetPassword from './Pages/ResetPassword'

import DesignImageForm from './Pages/DesignImageForm'
import UpdateOrder from './Components/UpdateOrder'

import { color } from 'framer-motion'




export default function App() {
  return (
    
    <BrowserRouter>

        <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/cakes" element={<CakePage/>}/>
        <Route path="/gift" element={<GiftPage/>}/>
        <Route path="/design" element={<DesignCake/>}/>
        <Route path="/aboutus" element={<AboutUs/>}/>
        <Route path="/booking" element={<Booking/>}/>
        <Route path="/sweets" element={<Sweets/>}/>
        <Route path="/nature" element={<Nature/>}/>
        <Route path="/careers" element={<Career/>}/>
        <Route path="/signupdelivery" element={<DeliverySignUp/>}/>
        <Route path="/signupshops" element={<ShopSignUp/>}/>
        <Route path="/signupteam" element={<TeamSignUp/>}/>
        <Route path="/blogs/:slug" element={<BlogDetails />} />
        <Route path="/blogs" element={<Blogs/>} />
        <Route path="/suprise" element={<Suprise/>} />
        <Route path="/cake/:cakeSlug" element={<PostCake/>} />
        <Route path="/event/:eventSlug" element={<PostEvent/>} />
        <Route path="/sweet/:sweetSlug" element={<PostSweet/>} />
        <Route path="/nature/:natureSlug" element={<PostNature/>} />
        <Route path="/gift/:giftSlug" element={<PostGift/>} /> 
        <Route path="/shops" element={<CakeShops/>} /> 
        <Route path="/allproducts" element={<AllProducts/>} /> 
        <Route path="/forgetPassword" element={<ForgetPassword/>}/>
        <Route path="/resetpassword/:id/:token" element={<ResetPassword/>} />

      <Route element={<PrivateRoute/>}>
        <Route path="/dashboard" element={<DashBoard/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/order-summary" element={<OrderSummary/>}/>
        <Route path="/order-pay-success" element={<CheckoutSuccess/>}/>
        <Route path="/designform" element={<DesignForm/>}/>
        <Route path="/designImageform" element={<DesignImageForm/>}/>
        <Route path="/designcakesuccess" element={<DesignCakeSuccess/>}/>
        <Route path="/bookingcakesuccess" element={<BookingCakeSuccess/>}/>
        <Route path="/cod-form" element={<CODForm/>} />
        <Route path="/bookingsummary" element={<BookingSummary/>} />
        
      </Route>



      <Route element={<OnlyAdminPrivateRoute/>}>
          <Route path="/addcake" element={<AddCakes/>} />
          <Route path="/addgift" element={<AddGift/>} />
          <Route path="/addnature" element={<AddNature/>} />
          <Route path="/update-cake/:productId" element={<UpdateCake/>}/>
          <Route path="/update-sweet/:productId" element={<UpdateSweet/>}/>
          <Route path="/update-nature/:productId" element={<UpdateNature/>}/>
          <Route path="/update-gift/:productId" element={<UpdateGift/>}/>
          <Route path="/addsweets" element={<AddSweets/>}/>
          <Route path="/addblogs" element={<AddBlogs/>}/>
          <Route path="/update-blog/:id" element={<UpdateBlog/>} />
          <Route path='/update-order/:orderId' element={<UpdateOrder />} />
      </Route>

      <Route element={<OnlyTeamPrivateRoute/>}>

        <Route path="/addevents" element={<AddEvents/>} />
        <Route path="/update-event/:productId" element={<UpdateEvent/>}/>
        
      </Route>

     

      </Routes>

      <Footer/>
    </BrowserRouter>
  )
}
