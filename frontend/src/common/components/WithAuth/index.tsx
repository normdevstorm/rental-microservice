import { ComponentType, useEffect, useState } from "react";
import { authRepository } from "../../../data/auth/repository/auth_reponsitory";
import { useNavigate } from "react-router";
import localStorageService from "../../services/localStorageService";
import { useAppSelector } from "../../../store";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const ComponentWithAuth = (props: P) => {
    // ///TODO: delete check token valid logic right when api is ready
    // const token = localStorage.getItem("accessToken");
    // const isAuthenticated = true;
    // const navigate = useNavigate();
    // const [isAuthenticated, setAuthenticated] = useState<boolean>(
    //   useAppSelector((state) => state.auth.authenticated)
    // );

    const isAuthenticated = useAppSelector((state) => state.auth.authenticated);
    const navigate = useNavigate();
    useEffect(() => {
      const checkAuth = async () => {
        console.log("WithAuth - isAuthenticated:", isAuthenticated);
        if (!isAuthenticated) {
          localStorageService.clearKey("accessToken");
          localStorageService.clearKey("refreshToken");
          navigate("/login", { replace: true });
        }
      };
      checkAuth();
    }, [isAuthenticated]);

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default withAuth;
