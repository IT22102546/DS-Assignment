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


import Footer from './Components/Footer'
import AboutUs from './Pages/AboutUs'
import DeliverySignUp from './Pages/DeliverySignUp'
import ShopSignUp from './Pages/ShopSignUp'
import Career from './Pages/Career'

import CODForm from './Pages/CODForm'

import CakeShops from './Pages/CakeShops'
import AllProducts from './Pages/AllProducts'
import ForgetPassword from './Pages/ForgetPassword'
import ResetPassword from './Pages/ResetPassword'


import UpdateOrder from './Components/UpdateOrder'






export default function App() {
  return (
    
    <BrowserRouter>

        <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/cakes" element={<CakePage/>}/>
        <Route path="/aboutus" element={<AboutUs/>}/>
        <Route path="/careers" element={<Career/>}/>
        <Route path="/signupdelivery" element={<DeliverySignUp/>}/>
        <Route path="/signupshops" element={<ShopSignUp/>}/>
        <Route path="/cake/:cakeSlug" element={<PostCake/>} />
        <Route path="/shops" element={<CakeShops/>} /> 
        <Route path="/allproducts" element={<AllProducts/>} /> 
        <Route path="/forgetPassword" element={<ForgetPassword/>}/>
        <Route path="/resetpassword/:id/:token" element={<ResetPassword/>} />

      <Route element={<PrivateRoute/>}>
        <Route path="/dashboard" element={<DashBoard/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/order-summary" element={<OrderSummary/>}/>
        <Route path="/order-pay-success" element={<CheckoutSuccess/>}/>
        <Route path="/cod-form" element={<CODForm/>} />
      </Route>



      <Route element={<OnlyAdminPrivateRoute/>}>
          <Route path="/addcake" element={<AddCakes/>} />
          
          <Route path="/update-cake/:productId" element={<UpdateCake/>}/>
          <Route path='/update-order/:orderId' element={<UpdateOrder />} />
      </Route>

      

     

      </Routes>

      <Footer/>
    </BrowserRouter>
  )
}
