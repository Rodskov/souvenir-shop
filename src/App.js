import { BrowserRouter, Routes, Route } from "react-router-dom";
//Pages
import Header from "./components/header/Header";
//Components
import { Home, Contact, Login, SignUp, Reset, Admin, Cart } from './pages';
import AdminOnlyRoute from "./components/adminOnlyRoute/AdminOnlyRoute";
import ProductDetails from "./components/product/productDetails/ProductDetails";
import CheckoutDetails from "./pages/checkout/CheckoutDetails";
import Checkout from "./pages/checkout/Checkout";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess";
import History from "./pages/orderHistory/History";
import OrderDetails from "./pages/orderDetails/OrderDetails";

// Try comment
function App() {
 
  return (
    <>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/" element={ <Home/>} />
          <Route path="/contact" element={ <Contact/>} />
          <Route path="/login" element={ <Login/>} />
          <Route path="/register" element={ <SignUp/>} />
          <Route path="/reset" element={ <Reset/>} />
          <Route path="/cart" element={ <Cart/>} />

          <Route 
            path="/admin/*" 
            element={
              <AdminOnlyRoute>
                <Admin/>
              </AdminOnlyRoute>
            } 
          />

          <Route path="/product-details/:id" element={ <ProductDetails/>} />
          <Route path="/cart" element={ <Cart/>} />
          <Route path="/checkout-details" element={ <CheckoutDetails/>} />
          <Route path="/checkout" element={ <Checkout/>} />
          <Route path="/checkout-success" element={ <CheckoutSuccess/>} />
          <Route path="/order-history" element={ <History/>} />
          <Route path="/order-details/:id" element={ <OrderDetails/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
