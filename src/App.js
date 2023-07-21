import { BrowserRouter, Routes, Route } from "react-router-dom";
//Pages
import Header from "./components/header/Header";
//Components
import { Home, Contact, Login, SignUp, Reset } from './pages';

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
