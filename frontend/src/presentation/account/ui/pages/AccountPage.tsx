import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import AccountInfo from "../components/sections/AccountInfo";
import RentingItemInfo from "../components/sections/RentingItemInfo";
import BookingInfo from "../components/sections/BookingInfo";
import {
  AccountSideBarTab,
  AccountSideBarType,
} from "../../../../common/types/enums/enums";

interface AccountPageProps {
  selectTab: AccountSideBarType;
}

const AccountPage: React.FC<AccountPageProps> = ({ selectTab }) => {
  const [selectedTab, setSelectedTab] = useState<AccountSideBarType>(selectTab);
  useEffect(() => {
    setSelectedTab(selectTab);
  }, []);

  const renderContent = () => {
    switch (selectedTab) {
      case AccountSideBarTab.MY_PROFILE:
        return (
          <div>
            <AccountInfo />
          </div>
        );
      case AccountSideBarTab.MY_BOOKING:
        return (
          <div>
            <BookingInfo />
          </div>
        );
      case AccountSideBarTab.MY_ITEMS:
        return (
          <div>
            <RentingItemInfo />
          </div>
        );
      // case AccountSideBarTab.LOG_OUT:
      //   return <div>Logout content</div>;
      default:
        return <div>Select a tab</div>;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex w-full max-w-screen-xl">
        <Sidebar selectedTab={selectedTab} onSelectTab={setSelectedTab} />
        <div className="flex-1 p-4 overflow-x-hidden">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AccountPage;
