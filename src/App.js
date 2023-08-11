import './App.css';
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';
import Home from './pages/Home/Home'
import Authenticate from './pages/Authenticate/Authenticate';
import Activate from './pages/Activate/Activate';
import Rooms from './pages/Rooms/Rooms';
import Room from './pages/Room/Room';
import Navigation from './components/shared/Navigation/Navigation';
// import { Children } from 'react';
import { useSelector } from 'react-redux';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/Loader/Loader';


function App() {

  const { loading } = useLoadingWithRefresh();
  return loading ? ( 
    <Loader message={"Loading, Please wait..."}  /> ) : (
  <BrowserRouter>
    <Navigation /> 
      <Routes >
          <Route path="/" element={<GuestRoute><Home/></GuestRoute>} exact />
          <Route path="/authenticate" element={<GuestRoute><Authenticate/></GuestRoute>} />
          <Route path="/activate" element={<SemiProtectedRoute><Activate/></SemiProtectedRoute>} />
          <Route path="/rooms" element={<ProtectedRoute><Rooms/></ProtectedRoute>} />
          <Route path="/room/:id" element={<ProtectedRoute><Room/></ProtectedRoute>} />
      </Routes >
  </BrowserRouter>
  
  );
}

const GuestRoute = ({children}) => {
  
  const { isAuth } = useSelector((state) => state.auth);
  if (isAuth) {
    return <Navigate to='/rooms' />
  }

  return children;
};

const SemiProtectedRoute = ({children}) => {

  const { user, isAuth } = useSelector((state) => state.auth);
  if (!isAuth) {
    return <Navigate to='/' />
  } 
  else if (isAuth && !user.activated){
    return children;
  }

  return <Navigate to='/rooms' />

};

const ProtectedRoute = ({children}) => {
  
  const { user, isAuth } = useSelector((state) => state.auth);
  if (!isAuth) {
    return <Navigate to='/' />
  } 
  else if (isAuth && !user.activated){
    return <Navigate to='/activate' />
  }

  return children;
};

export default App;
