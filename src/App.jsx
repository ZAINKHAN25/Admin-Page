import { BrowserRouter, Routes , Route } from "react-router-dom";
import './App.css'

import Home from './components/Home/App.jsx'
import Login from './components/Login/App.jsx'
import Verifytoken from './components/Verifytoken/App.jsx'
import NotFound from './components/NotFound/App.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="verifytoken" element={<Verifytoken/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  )
}


// this is Comment
export default App;