import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {UserProvider} from './userProvider.jsx'
import Login from './login.jsx'
import Header from './header.jsx'
import SignUp from './signup.jsx'
import ForgotPassword from './forgot.jsx'
import ResetPassword from './reset.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import ErrorPage from './error.jsx'
import Home from './home.jsx'
import Profile from './profile.jsx'
import CreatePost from './createPost.jsx'
import Likes from './likes.jsx'
import Messages from './messages.jsx'
import FindUsers from './findUsers.jsx'
import HomePosts from './homePosts.jsx'

const router=createBrowserRouter([
  {
    path:"/",
    element: <Login/>
  },
  {
    path:"/sign-up",
    element: <SignUp />
  },
  {
    path:'/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword/>
  },
  {
    path: '/home',
    element: (
      <UserProvider>
        <Header/>
        <Home content={
          <HomePosts/>
        }/>
      </UserProvider>        
    )
  },
  {
    path: '/user/:userId',
    element: (
      <UserProvider>
        <Header/>
        <Home content={
          <>
            <Profile/>
          </>
        } />
      </UserProvider>
    )
  },
  {
    path: '/create',
    element:(
      <UserProvider>
        <Header/>
        <Home content={<CreatePost/>}/>
      </UserProvider>
    )
  },
  {
    path: '/likes',
    element:(
      <UserProvider>
        <Header/>
        <Home content={<Likes/>}/>
      </UserProvider>
    )
  },
  {
    path: '/messages/:messageId?',
    element:(
      <UserProvider>
        <Header/>
        <Home content={<Messages/>}/>
      </UserProvider>
    )
  },
  {
    path: '/find-users',
    element:(
      <UserProvider>
        <Header/>
        <Home content={<FindUsers/>}/>
      </UserProvider>
    )
  },
  {
    path: '*',
    element: <ErrorPage/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
