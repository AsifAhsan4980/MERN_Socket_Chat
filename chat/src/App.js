import {Routes, Route} from "react-router-dom"
import {AuthProvider} from "./utils/auth";
import SignIn from "./components/auth/Signup";
import Registration from "./components/auth/Registration";
import Home from "./view/home";


function App() {
  return (
      <AuthProvider>
          <Routes>
              <Route exact path='/' element={<SignIn/>}/>
              <Route exact path='/registration' element={<Registration/>}/>
              <Route exact path='/home' element={<Home/>}/>
          </Routes>
      </AuthProvider>
  );
}

export default App;
