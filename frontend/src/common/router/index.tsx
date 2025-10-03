import { createBrowserRouter } from "react-router-dom";
import Home from "../components/Home";
import HomePage from "../../presentation/home/ui/pages/HomePage";
import SearchResultsPage from "../../presentation/home/ui/pages/SearchResultsPage";
import Login from "../../presentation/auth/ui/pages/login";
import RegisterItemPage from "../../pages/booking/ui/pages/RegisterItemPage";
import ConfirmPolicyPage from "../../pages/booking/ui/pages/ConfirmPolicyPage";
import RentalDetailPage from "../../pages/booking/ui/pages/RentalDetailPage";
import ListingCreatePage from "../../pages/rent-out/ui/pages/ListingCreatePage";
import AccountPage from "../../presentation/account/ui/pages/AccountPage";
import RegisterPage from "../../presentation/auth/ui/pages/register";
import { ItemDetailPage } from "../../presentation/item/ui/pages/ItemDetailPage";
import OwnerConfirmPage from "../../pages/booking/ui/pages/OwnerConfirmPage";
import { AccountSideBarTab } from "../types/enums/enums";
import AboutMiotoPage from "../../pages/aboutmioto/ui/AboutMiotoPage";
import EmailVerificationCode from "../../presentation/auth/ui/pages/email/VerifyEmail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/search",
        element: <SearchResultsPage />,
      },
      {
        path: "/about-mioto",
        element: <AboutMiotoPage />,
      },
      // { path: "/post", element: <PostList /> },
      // {
      //   path: "/currency-convert",
      //   element: <CurrencyConvertForm />,
      // },
      // { path: "/stopwatch", element: <StopWatch /> },
      // {
      //   path: "/custom-style-page",
      //   element: <CustomStyle />,
      // },
      {
        path: "/account",
        children: [
          {
            path: "/account",
            index: true,
            element: <AccountPage selectTab={AccountSideBarTab.MY_PROFILE} />,
          },
          {
            path: "/account/my-bookings",
            element: <AccountPage selectTab={AccountSideBarTab.MY_BOOKING} />,
          },
          {
            path: "/account/my-items",
            element: <AccountPage selectTab={AccountSideBarTab.MY_ITEMS} />,
          },
        ],
      },
      {
        path: "/item/:id",
        element: <ItemDetailPage />,
      },
      {
        path: "/booking",
        children: [
          {
            path: "/booking/register",
            element: <RegisterItemPage />,
          },
          {
            path: "/booking/confirm",
            element: <ConfirmPolicyPage />,
          },
          {
            path: "/booking/:id",
            element: <RentalDetailPage />,
          },
          {
            path: "/booking/owner-confirm/:id",
            element: <OwnerConfirmPage />,
          },
        ],
      },
      {
        path: "/rent-out/register",
        element: <ListingCreatePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/verify-email",
    element: <EmailVerificationCode />,
  },
]);

export default router;
