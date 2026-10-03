import './style/app.css'
import NavBar from './component/NavBar'
import { Routes ,Route } from 'react-router-dom'
import AddTask from './component/AddTask'
import List from './component/List'
import SignUp from './component/SignUp'
import UpdateTask from './component/UpdateTask'
import Login from './component/Login'
import Protected from './component/Protected'
function App() { 

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Protected><List/></Protected>}/>
        <Route path='/add' element={<Protected><AddTask/></Protected>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/update/:id' element={<UpdateTask/>}/>
      </Routes>      
    </>
  )
}

export default App
