import React, { useEffect, useMemo, useState } from "react";
import VerifiedField from "../VerifiedFieldProps";
import { userRepository } from "../../../../../data/user/repository/user_repository";
import { UserResponse } from "../../../../../data/user/model/response/user_response";
import { authRepository } from "../../../../../data/auth/repository/auth_reponsitory";
import localStorageService from "../../../../../common/services/localStorageService";

// (Tuỳ chọn) Định nghĩa type cho dễ dùng
type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  //  role?: UserRoleType[];
  identityCard?: string;
  avatar?: string;
  isActive?: boolean;
  licenseNumber?: string;
  createdAt?: string;
  // Nếu BE có cờ verified:
  emailVerified?: boolean;
  phoneVerified?: boolean;
  identityCardVerified?: boolean;
  licenseNumberVerified?: boolean;
};

const formatDateForInput = (isoOrYmd?: string | null) => {
  if (!isoOrYmd) return "";
  // Nếu đã là yyyy-MM-dd -> trả về luôn
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoOrYmd)) return isoOrYmd;

  // Nếu là ISO -> convert sang yyyy-MM-dd
  const d = new Date(isoOrYmd);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const formatDateForDisplay = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  // Ví dụ hiển thị dd/MM/yyyy
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const AccountInfo: React.FC = () => {
  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dữ liệu hiển thị (ban đầu để trống, sẽ fill từ API)
  const [name, setName] = useState("");
  const [joinedAt, setJoinedAt] = useState(""); // format sẵn cho display
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Form fields
  // const [dob, setDob] = useState("");     // input date -> "yyyy-MM-dd"
  // const [gender, setGender] = useState<"Nam" | "Nữ" | "Khác" | "">("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [identityCard, setIdentityCard] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  // (Tuỳ chọn) verified từ BE – fallback về logic cũ nếu BE chưa có
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [phoneVerified, setPhoneVerified] = useState<boolean | null>(null);
  const [identityCardVerified, setIdentityCardVerified] = useState<
    boolean | null
  >(null);
  const [licenseNumberVerified, setLicenseNumberVerified] = useState<
    boolean | null
  >(null);

  // Lấy profile khi mount
  useEffect(() => {
    let ignore = false;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res: UserProfile = await userRepository.getUserProfile();
        if (ignore) return;

        // Fill các field
        setName(res.name || "");
        // setJoinedAt(res.joinedAt ? formatDateForDisplay(res.joinedAt) : "");
        setAvatarUrl(res.avatar ?? null);

        // setDob(formatDateForInput(res.dob ?? ""));
        // setGender((res.gender as any) || "");
        setPhone(res.phone || "");
        setEmail(res.email || "");
        setAddress(res.address || "");
        setLicenseNumber(res.licenseNumber || "");
        setCreatedAt(res.createdAt || "");
        setIdentityCard(res.identityCard || "");

        setEmailVerified(
          typeof res.emailVerified === "boolean" ? res.emailVerified : null
        );
        setPhoneVerified(
          typeof res.phoneVerified === "boolean" ? res.phoneVerified : null
        );
        setIdentityCardVerified(
          typeof res.identityCardVerified === "boolean"
            ? res.identityCardVerified
            : null
        );
        setLicenseNumberVerified(
          typeof res.licenseNumberVerified === "boolean"
            ? res.licenseNumberVerified
            : null
        );
      } catch (e: any) {
        console.error("getUserProfile error:", e);
        setError(e?.message || "Không thể tải thông tin tài khoản.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      ignore = true; // tránh setState sau unmount
    };
  }, []);

  // Toggle Sửa/Lưu
  const handleToggleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    // Đang ở chế độ Sửa -> nhấn Lưu
    try {
      setLoading(true);
      setError(null);

      // Chuẩn bị payload gửi BE
      const payload: Omit<UserResponse, "id" | "role"> = {
        // dob: dob || null,         // yyyy-MM-dd
        // gender: gender || null,   // "Nam"/"Nữ"/"Khác"
        name: name,
        email: email,
        address: address,
        identityCard: identityCard,
        licenseNumber: licenseNumber,
        phone: phone,
      };

      const updated = await userRepository.updateUserProfile(payload);

      // Fill lại dữ liệu từ response (đảm bảo đồng bộ server)

      setPhone(updated.phone || "");
      setEmail(updated.email || "");
      setAddress(updated.address || "");
      setIdentityCard(updated.identityCard || "");
      setLicenseNumber(updated.licenseNumber || "");

      // Nếu server trả về name/joinedAt/...
      if (updated.name) setName(updated.name);
      if (typeof updated.avatar !== "undefined")
        setAvatarUrl(updated.avatar ?? null);

      setIsEditing(false);
    } catch (e: any) {
      console.error("updateUserProfile error:", e);
      setError(e?.message || "Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // verified hiển thị (ưu tiên flag BE, fallback logic cũ)
  const emailIsVerified = useMemo(() => {
    if (emailVerified !== null) return emailVerified && !isEditing;
    return !!email && !isEditing;
  }, [emailVerified, email, isEditing]);

  const phoneIsVerified = useMemo(() => {
    if (phoneVerified !== null) return phoneVerified && !isEditing;
    return !!phone && !isEditing;
  }, [phoneVerified, phone, isEditing]);
  const identityCardIsVerified = useMemo(() => {
    if (identityCardVerified !== null)
      return identityCardVerified && !isEditing;
    return !!identityCard && !isEditing;
  }, [identityCardVerified, identityCard, isEditing]);
  const licenseNumberIsVerified = useMemo(() => {
    if (licenseNumberVerified !== null)
      return licenseNumberVerified && !isEditing;
    return !!licenseNumber && !isEditing;
  }, [licenseNumberVerified, licenseNumber, isEditing]);

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-40" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-24 bg-gray-100 rounded" />
            <div className="h-24 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 space-y-8 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Thông tin tài khoản
        </h2>
        <button
          className="text-green-600 border border-green-500 rounded px-4 py-1 hover:bg-green-50 transition"
          onClick={handleToggleEdit}
        >
          {isEditing ? "Lưu" : "✏️ Sửa"}
        </button>
      </div>

      {/* Avatar & Name */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xl shadow-inner overflow-hidden">
          <img
            src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAMAAzAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAQYCBAUDB//EAC8QAQACAgEBBQYGAwEAAAAAAAABAgMRBCEFEjFBURUiUmFxsRMyM3KBoRQ0QpH/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAXEQEBAQEAAAAAAAAAAAAAAAAAAREx/9oADAMBAAIRAxEAPwD6GA0yAAAAAAAAAAAAAAAAAAAAAAACgAgAAAAAAAAAAAAAAAAAAAAAAAKACAAAAAAAAAJiJtOqxM/wCB7RxORbrXFeY/ai3F5FfzYbxHzgV5BManU9PqCAAAAAAAAAAoAIAAAAAAH0HR7I4n4t/wAW/WlfD5yaMuD2XN4i/I92PKrrYsGPFXu0pWP4egy0I0kB45eNiyxPfpEz6+bj83s6+GJvjnvY/s7yJiJjU+EroqY3O0uN/jZtx+S3WGlCspAAAAAAAFABAAAAAACI3MRHms/ExRhwUpHjrqrvFr3+Tjr62WeOiVYkBFAAAAafamGMvEtPnXrCvfdaste9jtWfOFWtHdtMeky1EqABAAAAAAUAEAAAAAAbHZ/+7h/csiscW3c5GO3pZZ4SrEgIoAAACJ8FWzfq3/dP3WfLaK4rWnyhVrz3rzPrMysSoAVAAAAAAUAEAAAAAAI6TErJwM8Z+PW3nHSVbbnZnL/xsvdtPuW6T8ksVYRFZ31idx5JRQAAGOW9cdZtadRANLtbP+HxprE+9fppwd7lsc7kzyc8237sdKw12kABAAAAAAUAEAAAAAADQKN/gdpTgiMeaZtj8p9HaxZseWsWpeLQqzKmS+O3epaYn5SlixaxXK9o8qsajJ0+cbL9ocm8anJP8RpMV3c/IxYKTOS/h/64fO51+TPdjdcceW/Fq2ta89687n5yhcQAEAAAAAAABQAQAAAAGzw+Fk5M+lI/6l2ON2fhwanXet6yUcTHxM+X8mO2vm2Kdlci3j3a/V39a6R4Ca04fsfN8dD2Pm+OjuBtHD9j5vjoex83x0dwTaY4fsbN8dCex83x0dwXRwL9lcivhqfo1snHzY597HPT5LQiYiY1MbNFTHf5PZuHNuax3LerjcnjZeNbu5I+lo81THiH1jqKgAgACgAgAA3uzeD/AJFvxMn6cf28OFxp5Oatf+Y/NKyUrFKxWsdI6FqwpWtKxWsaiGRs2yoI2bBIGwA2bADZsANkyA882OmWk1vXcS9Ik2Cuc/hzxcm/HHPhLUj6LVyMVc+Kcd46T/StcjFODLbHaOsf21OJjzAEABQAQBlip38la+sxAO32VhjFx4vMe/k6y3tsKREViI8oiGSKnZtiIrLZtiAy2bYgMtm2IDLZtiAy2bYgMtm2Ioy3vTl9s4ItjrmiOsdLfR0nnyaRkwXpPnWRFaDr5+IqAAoAINjs+N8vFE+rXbPZ3+7j+s/YHe2nbHZtFZbRtGzYJ2bRs2Cdm0bNgy2jaNmwTs2jZsE7No2bBOyJRs2CdnjExPmjaNgruaNZrx6TLBnyP18n75+7BUABX//Z"
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{name || "—"}</h3>
          <p className="text-sm text-gray-500">Tham gia: {joinedAt || "—"}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
        {/* Column 1 */}
        <div className="space-y-4">
          {/* Phone */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
            <VerifiedField
              label="Số điện thoại"
              value={phone}
              isEditing={isEditing}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              verified={phoneIsVerified}
              verifiedLabel="Đã xác thực"
              unverifiedLabel="Chưa xác thực"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
            <VerifiedField
              label="GPLX"
              value={licenseNumber}
              isEditing={isEditing}
              onChange={(e) => setLicenseNumber(e.target.value)}
              verifiedLabel="Đã xác thực"
              unverifiedLabel="Chưa xác thực"
              verified={licenseNumberIsVerified}
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          {/* Email */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
            <VerifiedField
              label="Email"
              value={email}
              isEditing={isEditing}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              verifiedLabel="Đã xác thực"
              unverifiedLabel="Chưa xác thực"
              verified={emailIsVerified}
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
            <VerifiedField
              label="CMND/CCCD"
              value={identityCard}
              isEditing={isEditing}
              onChange={(e) => setIdentityCard(e.target.value)}
              verifiedLabel="Đã xác thực"
              unverifiedLabel="Chưa xác thực"
              verified={identityCardIsVerified}
            />
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
        <VerifiedField
          label="Địa chỉ"
          value={address}
          isEditing={isEditing}
          onChange={(e) => setAddress(e.target.value)}
          enable={false}
        />
      </div>
    </div>
  );
};

export default AccountInfo;
