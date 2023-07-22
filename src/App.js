import { BrowserRouter, Routes, Route } from "react-router-dom";
//Pages
import Header from "./components/header/Header";
//Components
import { Home, Contact, Login, SignUp, Reset, Admin, Cart } from './pages';
import AdminOnlyRoute from "./components/adminOnlyRoute/AdminOnlyRoute";

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

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
