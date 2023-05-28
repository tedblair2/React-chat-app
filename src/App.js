import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register'
import './index.css';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import ErrorPage from './components/ErrorPage';
import Default from './components/Default';
import Chat,{loader as chatLoader} from './components/Chat';

function App() {
  const {currentUser}=useContext(AuthContext)

  const ProtectedRoute=({children})=>{
    if(!currentUser){
        return <Navigate to="/login"/>
    }
    return children
  }

  const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute> <Home/> </ProtectedRoute>,
    errorElement:<ErrorPage/>,
    children:[
      {
        errorElement:<ErrorPage/>,
        children:[
          {index:true,element:<Default/>},
          {
            path:"chats/:userId",
            element:<Chat/>,
            loader:chatLoader
          }
        ]
      }
    ]
  },
  {
    path:"login",
    element:<Login/>
  },
  {
    path:"register",
    element:<Register/>
  }
]);
  return <RouterProvider router={router} />;
}

export default App;
library.add(fab, fas, far)
