import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './login.jsx'
import Header from './header.jsx'
import SignUp from './signup.jsx'
import ForgotPassword from './forgot.jsx'
import ResetPassword from './reset.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import ErrorPage from './error.jsx'
import Home from './home.jsx'
import Posts from './posts.jsx'
import Profile from './profile.jsx'
import PostsHeader from './postsHeader.jsx'
import CreatePost from './createPost.jsx'
import Likes from './likes.jsx'
import Messages from './messages.jsx'
import FindUsers from './findUsers.jsx'

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
      <>
        <Header/>
        <Home content={
          <>
            <PostsHeader/>
            <Posts/>
          </>
        } />
      </>
    )
  },
  {
    path: '/user/:userId',
    element: (
      <>
        <Header/>
        <Home content={
          <>
            <Profile content={<Posts/>}/>
          </>
        } />
      </>
    )
  },
  {
    path: '/create',
    element:(
      <>
        <Header/>
        <Home content={<CreatePost/>}/>
      </>
    )
  },
  {
    path: '/likes',
    element:(
      <>
        <Header/>
        <Home content={<Likes/>}/>
      </>
    )
  },
  {
    path: '/messages',
    element:(
      <>
        <Header/>
        <Home content={<Messages/>}/>
      </>
    )
  },
  {
    path: '/find-users',
    element:(
      <>
        <Header/>
        <Home content={<FindUsers/>}/>
      </>
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
