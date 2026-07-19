import { useState, useRef, useEffect } from "react";
import { authRepository } from "../../../data/auth/repository/auth_reponsitory";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../../store";
import { logout } from "../../../presentation/auth/stores/authSlice";

export default function UserMenu({ name = "Tài khoản" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <img
          alt={name}
          // src={`https://i.pravatar.cc/40?u=${encodeURIComponent(name)}`}
          src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAMAAzAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAQYCBAUDB//EAC8QAQACAgEBBQYGAwEAAAAAAAABAgMRBCEFEjFBURUiUmFxsRMyM3KBoRQ0QpH/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAXEQEBAQEAAAAAAAAAAAAAAAAAAREx/9oADAMBAAIRAxEAPwD6GA0yAAAAAAAAAAAAAAAAAAAAAAACgAgAAAAAAAAAAAAAAAAAAAAAAAKACAAAAAAAAAJiJtOqxM/wCB7RxORbrXFeY/ai3F5FfzYbxHzgV5BManU9PqCAAAAAAAAAAoAIAAAAAAH0HR7I4n4t/wAW/WlfD5yaMuD2XN4i/I92PKrrYsGPFXu0pWP4egy0I0kB45eNiyxPfpEz6+bj83s6+GJvjnvY/s7yJiJjU+EroqY3O0uN/jZtx+S3WGlCspAAAAAAAFABAAAAAACI3MRHms/ExRhwUpHjrqrvFr3+Tjr62WeOiVYkBFAAAAafamGMvEtPnXrCvfdaste9jtWfOFWtHdtMeky1EqABAAAAAAUAEAAAAAAbHZ/+7h/csiscW3c5GO3pZZ4SrEgIoAAACJ8FWzfq3/dP3WfLaK4rWnyhVrz3rzPrMysSoAVAAAAAAUAEAAAAAAI6TErJwM8Z+PW3nHSVbbnZnL/xsvdtPuW6T8ksVYRFZ31idx5JRQAAGOW9cdZtadRANLtbP+HxprE+9fppwd7lsc7kzyc8237sdKw12kABAAAAAAUAEAAAAAADQKN/gdpTgiMeaZtj8p9HaxZseWsWpeLQqzKmS+O3epaYn5SlixaxXK9o8qsajJ0+cbL9ocm8anJP8RpMV3c/IxYKTOS/h/64fO51+TPdjdcceW/Fq2ta89687n5yhcQAEAAAAAAABQAQAAAAGzw+Fk5M+lI/6l2ON2fhwanXet6yUcTHxM+X8mO2vm2Kdlci3j3a/V39a6R4Ca04fsfN8dD2Pm+OjuBtHD9j5vjoex83x0dwTaY4fsbN8dCex83x0dwXRwL9lcivhqfo1snHzY597HPT5LQiYiY1MbNFTHf5PZuHNuax3LerjcnjZeNbu5I+lo81THiH1jqKgAgACgAgAA3uzeD/AJFvxMn6cf28OFxp5Oatf+Y/NKyUrFKxWsdI6FqwpWtKxWsaiGRs2yoI2bBIGwA2bADZsANkyA882OmWk1vXcS9Ik2Cuc/hzxcm/HHPhLUj6LVyMVc+Kcd46T/StcjFODLbHaOsf21OJjzAEABQAQBlip38la+sxAO32VhjFx4vMe/k6y3tsKREViI8oiGSKnZtiIrLZtiAy2bYgMtm2IDLZtiAy2bYgMtm2Ioy3vTl9s4ItjrmiOsdLfR0nnyaRkwXpPnWRFaDr5+IqAAoAINjs+N8vFE+rXbPZ3+7j+s/YHe2nbHZtFZbRtGzYJ2bRs2Cdm0bNgy2jaNmwTs2jZsE7No2bBOyJRs2CdnjExPmjaNgruaNZrx6TLBnyP18n75+7BUABX//Z"
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="hidden sm:inline text-sm font-medium text-gray-800">
          {name}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-lg p-2">
          <a
            className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-sm"
            href="/account"
          >
            Tài khoản
          </a>

          <button
            className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-sm"
            onClick={() => navigate("/account/my-bookings")}
          >
            Chuyến của tôi
          </button>
          <button
            onClick={async () => {
              await authRepository.logout();
              dispatch(logout());
              navigate("/login");
            }}
            className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-red-600"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
