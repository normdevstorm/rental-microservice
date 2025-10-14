import React, { useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import { useNavigate } from "react-router-dom";
import { userRepository } from "../../../data/user/repository/user_repository";

// Header.jsx
export default function Header() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Gọi API lấy profile khi Header mount
    userRepository.getUserProfile().then((profile) => {
      setUserName(profile?.name || "Tài khoản");
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <a className="flex items-center gap-3" href="/">
            <img
              loading="lazy"
              src="/mioto_logo.png"
              alt="Mioto"
              className="hidden sm:block h-8 w-auto"
            />
            <img
              loading="lazy"
              src="data:image/png;base64,PASTE_YOUR_BASE64_HERE"
              alt="Mioto"
              className="block sm:hidden h-8 w-auto"
            />
          </a>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/about-mioto")}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Về mioto
            </button>
            <button
              onClick={() => navigate("/rent-out/register")}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Trở thành chủ xe
            </button>
            <button
              onClick={() => navigate("/account/my-bookings")}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Chuyến của tôi
            </button>
          </nav>

          <UserMenu name={userName} />
        </div>
      </div>
    </header>
  );
}
