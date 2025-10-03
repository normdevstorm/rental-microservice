// Footer.tsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white-100 text-gray-700 py-10 px-6 md:px-20">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    {/* Cột 1: Logo & liên hệ */}
    <div>
      <div className="flex items-center mb-4">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgG9EmwaZR_pL5y_twJTAVRxjSNMLYhcsVdM1saESMbdZPqnEFOt5wOfbcFtFM6J4dsA&usqp=CAU" alt="MIOTO Logo" className = "font-bold text-green-600  "/>
      </div>
      <p className="mb-1">1900 9217</p>
      <p className="mb-1">Tổng đài hỗ trợ: 7AM - 10PM</p>
      <p className="mb-1">Email: contact@mioto.vn</p>
      <p className="text-blue-500 mt-2 cursor-pointer hover:underline">Gửi mail cho Mioto</p>
    </div>

    {/* Cột 2: Chính sách */}
    <div>
      <h3 className="font-semibold mb-3 text-gray-900">Chính Sách</h3>
      <ul className="space-y-2 text-sm">
        <li className="hover:text-blue-500 cursor-pointer">Chính sách & quy định</li>
        <li className="hover:text-blue-500 cursor-pointer">Quy chế hoạt động</li>
        <li className="hover:text-blue-500 cursor-pointer">Chính sách bảo mật</li>
        <li className="hover:text-blue-500 cursor-pointer">Giải quyết khiếu nại</li>
      </ul>
    </div>

    {/* Cột 3: Tìm hiểu thêm */}
    <div>
      <h3 className="font-semibold mb-3 text-gray-900">Tìm Hiểu Thêm</h3>
      <ul className="space-y-2 text-sm">
        <li className="hover:text-blue-500 cursor-pointer">Hướng dẫn chung</li>
        <li className="hover:text-blue-500 cursor-pointer">Hướng dẫn đặt xe</li>
        <li className="hover:text-blue-500 cursor-pointer">Hướng dẫn thanh toán</li>
        <li className="hover:text-blue-500 cursor-pointer">Hỏi và trả lời</li>
      </ul>
    </div>

    {/* Cột 4: Đối tác */}
    <div>
      <h3 className="font-semibold mb-3 text-gray-900">Đối Tác</h3>
      <ul className="space-y-2 text-sm">
        <li className="hover:text-blue-500 cursor-pointer">Đăng ký chủ xe Mioto</li>
        <li className="hover:text-blue-500 cursor-pointer">Đăng ký GPS MITRACK 4G</li>
        <li className="hover:text-blue-500 cursor-pointer">Đăng ký cho thuê xe dài hạn MICAR</li>
      </ul>
    </div>
  </div>
</footer>
  );
};

export default Footer;
