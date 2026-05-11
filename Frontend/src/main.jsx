import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './Layout/Root/Root';
import Login from './Pages/Website/Login/Login';
import VerifiedUser from './Layout/Root/VerifiedUser';
import MainLayout from './Layout/Design/MainLayout';
import Home from './Pages/Website/Home/Home';
import Place from './Pages/Website/Place/Place';
import Contact from './Pages/Website/Contact/Contact';
import About from './Pages/Website/About/About';
import Blog from './Pages/Website/Blog/Blog';
import VerifiedDashboard from './Layout/Root/VerifiedDashboard';
import DashboardLayout from './Layout/Design/DashboardLayout';
import User from './Pages/Dashboard/User/User';
import ContentCreator from './Pages/Dashboard/ContentCreator/ContentCreator';
import Admin from './Pages/Dashboard/Admin/Admin';
import Profile from './Component/Profile/Profile';
import AllBlogs from './Pages/Dashboard/Admin/Pages/Blogs/AllBlogs';
import CreatorActivites from './Pages/Dashboard/Admin/Pages/CreatorActivities/CreatorActivites';
import Message from './Pages/Dashboard/Admin/Pages/Message/Message';
import AllPlaces from './Pages/Dashboard/Admin/Pages/Places/AllPlaces';
import Sales from './Pages/Dashboard/Admin/Pages/Sales/Sales';
import UsersList from './Pages/Dashboard/Admin/Pages/Users/UsersList';
import MyReview from './Pages/Dashboard/User/Pages/MyReview/MyReview';
import SavedPlace from './Pages/Dashboard/User/Pages/SavedPlace/SavedPlace';
import SavedBlog from './Pages/Dashboard/User/Pages/SavedBlog/SavedBlog';
import Subscription from './Pages/Dashboard/User/Pages/Subscription/Subscription';
import SinglePlace from './Pages/Website/Place/SinglePlace';
import SingleBlog from './Pages/Website/Blog/SingleBlog';
import EditBlog from './Pages/Dashboard/ContentCreator/Pages/Blog/EditBlog';
import AddBlog from './Pages/Dashboard/ContentCreator/Pages/Blog/AddBlog';
import MyBlog from './Pages/Dashboard/ContentCreator/Pages/Blog/MyBlog';
import SingleAuthor from './Pages/Website/Author/SingleAuthor';
import Teammanagemment from './Pages/Dashboard/Admin/Pages/TeamManagement/Teammanagemment';
import Agent from './Pages/Dashboard/Agent/Agent';
import LaunchTour from './Pages/Dashboard/Agent/Pages/LaunchTour/LaunchTour';
import Tour from './Pages/Dashboard/Agent/Pages/Tour/Tour';
import Booking from './Pages/Dashboard/Agent/Pages/Booking/Booking';
import Update from './Pages/Dashboard/Agent/Pages/Update/Update';
import TourPage from './Pages/Website/Tour/TourPage';
import SingleTour from './Pages/Website/Tour/SingleTour';
import MyTour from './Pages/Dashboard/User/Pages/MyTour/MyTour';
import AddPlace from './Pages/Dashboard/ContentCreator/Pages/AddPlace/AddPlace';
import Tours from './Pages/Dashboard/Admin/Pages/Tours/Tours';

const router = createBrowserRouter([
  { path: "/", element: <Root />,
    children: [
      { path: "/", element: <Login />, },
    ],
  },

  { path: "/tripsnap", element: ( <VerifiedUser> <MainLayout /> </VerifiedUser> ),
    children: [
      { path: "/tripsnap", element: <Home /> },
      { path: "/tripsnap/place", element: <Place /> },
      { path: "/tripsnap/place/:id", element: <SinglePlace /> },
      { path: "/tripsnap/blog", element: <Blog /> },
      { path: "/tripsnap/blog/:id", element: <SingleBlog /> },
      { path: "/tripsnap/contact", element: <Contact /> },
      { path: "/tripsnap/about", element: <About /> },
      { path: "/tripsnap/users/:id", element: <SingleAuthor /> },
      { path: "/tripsnap/tour", element: <TourPage /> },
      { path: "/tripsnap/tour/:id", element: <SingleTour /> },
    ],
  },
  {
    path: "/dashboard",
    element: ( <DashboardLayout /> ),
    children: [
      { index: true, element: <h1>Dashboard Home</h1>, },
      { path: "user", element: <User />, children: [
          { index: true, element: <Profile /> },
          { path: "myreview", element: <MyReview /> },
          { path: "savedplace", element: <SavedPlace /> },
          { path: "savedblog", element: <SavedBlog /> },
          { path: "my-tour", element: <MyTour /> },
          { path: "subscription", element: <Subscription /> },
        ]
      },
      { path: "traveler", element: <ContentCreator />,
        children: [
          { index: true, element: <Profile /> },
          { path: "addblog", element: <AddBlog /> },
          { path: "addplace", element: <AddPlace /> },
          { path: "myblogs", element: <MyBlog /> },
          { path: "edit-blog/:id", element: <EditBlog /> },
        ]
      },
      { path: "admin", element: <Admin />,
        children: [
          { index: true, element: <Profile /> },
          { path: "blog", element: <AllBlogs /> },
          { path: "cratorActivities", element: <CreatorActivites /> },
          { path: "message", element: <Message /> },
          { path: "place", element: <AllPlaces /> },
          { path: "sales", element: <Sales /> },
          { path: "team-management", element: <Teammanagemment /> },
          { path: "user", element: <UsersList /> },
          { path: "tours", element: <Tours /> },
        ]
      },
      { path: "agent", element: <Agent />,
        children: [
          { index: true, element: <Profile /> },
          { path: "add-tour", element: <LaunchTour /> },
          { path: "our-tours", element: <Tour /> },
          { path: "bookings", element: <Booking /> },
          { path: "send-update", element: <Update /> },
        ]
      }
    ],
  }


]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
