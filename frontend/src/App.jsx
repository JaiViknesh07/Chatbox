import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import  useAuth  from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './components/Chat';

const App = () => {

  function PrivateRoute({ children }){
    const { user } = useAuth();
    return user ? children : <Navigate to={'/'} />;
  }
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login />}/>
            <Route path='/register' element={<Register />}/>
            <Route path='/chat' element={<PrivateRoute><Chat /></PrivateRoute>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App;