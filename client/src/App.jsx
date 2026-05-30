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

export const ServerUrl = "http://localhost:3000/api";

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
      <Route path='/interview' element={<Interview/>}/>
      <Route path='/history' element={<InterviewHistory/>}/>
      <Route path='/pricing' element={<Pricing/>}/> 
      <Route path='/report/:id' element={<InterviewReport/>}/>
    </Routes>
    </>
  )
}

export default App