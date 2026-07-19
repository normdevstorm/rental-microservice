import { Outlet, useNavigate } from "react-router-dom";
import withAuth from "../WithAuth";
import localStorageService from "../../services/localStorageService";
import { logout } from "../../../api/authentication";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col ">
      {/* <div className="border border-solid border-black h-12 fixed top-0 w-full z-10 bg-gray-200 p-2"> */}
      {/* <div className="flex flex-row justify-between"> */}
      <Header />
      {/* Nội dung */}
      <div className="flex flex-col overflow-hidden min-h-screen">
        <div className="flex flex-row flex-1 border border-solid h-[calc(100vh-96px)]">
          {/* <div className="w-1/8">
            <div
                className={`${styles.homePage} border border-solid border-black h-full p-2`}
            >
              <div className={styles.link}>
                <NavLink to="/post">See post data</NavLink>
              </div>
              <div className={styles.link}>
                <NavLink to="/currency-convert">Currency conversion</NavLink>
              </div>
              <div className={styles.link}>
                <NavLink to="/stopwatch">Stopwatch</NavLink>
              </div>
              <div className={styles.link}>
                <NavLink to="/custom-style-page">Custom style page</NavLink>
              </div>
            </div>
          </div> */}
          <div className="flex-1 p-2 overflow-auto">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default withAuth(Home);
