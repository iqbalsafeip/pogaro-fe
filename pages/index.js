import Barber from "./Barber";
import Dashboard from "./Dashboard";
import Detail from "./Detail";
import Home from "./Home";
import Katalog from "./Katalog";
import Login from "./Login";
import MetodePembayaran from "./MetodePembayaran";
import Profile from "./Profile";
import Register from "./Register";
import Reviews from "./Reviews";
import Servis from "./Servis";

export const authPages = [
  {
    name: "Login",
    component: Login,
  },
  {
    name: "Register",
    component: Register,
  },
];

const pages = [
  {
    name: "Dashboard",
    component: Dashboard,
  },
  {
    name: "Home",
    component: Home,
  },
  {
    name: "Detail",
    component: Detail,
  },
  {
    name: "Reviews",
    component: Reviews,
  },
  {
    name: "Barber",
    component: Barber,
  },
  {
    name: "Servis",
    component: Servis,
  },
  {
    name: "MetodePembayaran",
    component: MetodePembayaran,
  },
  {
    name : "Profile",
    component: Profile
  },
  {
    name: "Katalog",
    component: Katalog
  }
];

export default pages;
