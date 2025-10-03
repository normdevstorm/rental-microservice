import { useNavigate } from "react-router";
import {
  AccountSideBarTab,
  AccountSideBarType,
} from "../../../../common/types/enums/enums";
import { authRepository } from "../../../../data/auth/repository/auth_reponsitory";
import { useAppDispatch } from "../../../../store";
import { log } from "console";
import { logout } from "../../../auth/stores/authSlice";

interface SidebarProps {
  selectedTab: AccountSideBarType;
  onSelectTab: (tab: AccountSideBarType) => void;
}

const getTabLabel = (tab: AccountSideBarType) => {
  switch (tab) {
    case AccountSideBarTab.MY_PROFILE:
      return "My profile";
    case AccountSideBarTab.MY_BOOKING:
      return "My booking";
    case AccountSideBarTab.MY_ITEMS:
      return "My items";
    case AccountSideBarTab.LOG_OUT:
      return "Logout";
    default:
      return "";
  }
};

const getTabPath = (tab: AccountSideBarType, logoutFn: () => void) => {
  switch (tab) {
    case AccountSideBarTab.MY_PROFILE:
      return "/account";
    case AccountSideBarTab.MY_BOOKING:
      return "/account/my-bookings";
    case AccountSideBarTab.MY_ITEMS:
      return "/account/my-items";
    case AccountSideBarTab.LOG_OUT:
      logoutFn();
      return "/login";
    default:
      return "";
  }
};

const Sidebar: React.FC<SidebarProps> = ({ selectedTab, onSelectTab }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <div className="w-60 h-screen p-4 bg-white shadow-elevated rounded-lg">
      <h2 className="text-xl font-bold mb-4">Account</h2>
      <ul>
        {Object.values(AccountSideBarTab).map((tab) => (
          <li
            key={tab}
            onClick={async () => {
              onSelectTab(tab);
              navigate(
                await getTabPath(tab, async () => {
                  await authRepository.logout();
                  dispatch(logout());
                }),
                { replace: true }
              );
            }}
            className={`cursor-pointer p-2 flex items-center rounded-md transition-colors duration-200 ${
              selectedTab === tab
                ? "border-l-4 border-green-500 bg-green-200 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {getTabLabel(tab)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
