import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from './redux/userSlice';
import Interview from './pages/InterviewPage';
import InterviewHistory from './pages/InterviewHistory';
import InterviewReport from './pages/InterviewReport';
import Pricing from './pages/Pricing';
import ProtectedRoute from './components/ProtectedRoute';

export const ServerUrl = "https://interview-ai-backend-fiog.onrender.com/";

const App = () => {

  const getUser = async() =>{
    try {
      const response = await axios.get(ServerUrl + '/user/current', {withCredentials:true});
      dispatch(setUserData(response.data.user))
    } catch (error) {
      console.log(error)
      dispatch(setUserData(null))
    }
  }
  const dispatch = useDispatch();
  useEffect(() => {
    getUser();
  },[dispatch])
    
  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/auth' element={<Auth/>}/>
      <Route path='/interview' element={<ProtectedRoute><Interview/></ProtectedRoute>}/>
      <Route path='/history' element={<ProtectedRoute><InterviewHistory/></ProtectedRoute>}/>
      <Route path='/pricing' element={<ProtectedRoute><Pricing/></ProtectedRoute>}/>
      <Route path='/report/:id' element={<ProtectedRoute><InterviewReport/></ProtectedRoute>}/>
    </Routes>
    </>
  )
}

export default App
