import React from "react";



const AboutMiotoPage: React.FC = () => {
  const features = [
    {
      title: "Đa dạng xe",
      desc:
        "Hơn 10.000 xe gia đình đời mới toàn quốc: Sedan, SUV, MPV, bán tải…",
    },
    {
      title: "An tâm & bảo hiểm",
      desc:
        "Bảo vệ chuyến đi với gói bảo hiểm thuê xe; giảm thiểu rủi ro cho khách thuê.",
    },
    {
      title: "Giao xe tận nơi",
      desc:
        "Nhận xe tại nhà/sân bay; thủ tục đơn giản, thanh toán linh hoạt.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Tìm & chọn xe",
      desc:
        "Chọn xe theo địa điểm, thời gian và nhu cầu.",
    },
    {
      step: "02",
      title: "Đặt xe & thanh toán",
      desc:
        "Giữ chỗ nhanh; hủy miễn phí trong 1 giờ sau khi thanh toán giữ chỗ (theo chính sách).",
    },
    {
      step: "03",
      title: "Nhận xe",
      desc:
        "Nhận xe tại điểm hẹn hoặc giao tận nơi. Kiểm tra tình trạng xe trước chuyến.",
    },
    {
      step: "04",
      title: "Trải nghiệm & trả xe",
      desc:
        "Lái xe an toàn, hoàn tất hành trình, trả xe theo hướng dẫn của chủ xe.",
    },
  ];

  const stats = [
    { label: "Xe hoạt động", value: "10.000+" },
    { label: "Thành phố phủ sóng", value: "Toàn quốc" },
    { label: "Hình thức", value: "Ô tô • Xe máy" },
  ];

  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl">
    
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Mioto – Thuê xe ô tô & xe máy dễ dàng
            </h1>

            <p className="mt-4 text-lg md:text-xl text-white">
              Nền tảng chia sẻ xe kết nối chủ xe & khách thuê, nhanh chóng, an
              toàn và tiết kiệm.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
             
            </div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl shadow p-6 text-center border border-gray-100"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-green-700">
                {s.value}
              </div>
              <div className="mt-2 text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-6 md:py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Vì sao chọn Mioto?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <article
              key={f.title}
              className="bg-white rounded-xl shadow p-6 border border-gray-100"
            >
              <h3 className="mt-3 text-xl font-semibold text-gray-900">
                {f.title}
              </h3>
              <p className="mt-2 text-gray-600">{f.desc}</p>
            </article>
          ))}
        </div>
        
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Thuê xe trên Mioto hoạt động thế nào?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((st) => (
              <div
                key={st.step}
                className="rounded-xl p-6 bg-gray-50 border border-gray-100"
              >
                <div className="text-green-700 font-extrabold text-2xl">
                  {st.step}
                </div>
                <div className="mt-2 font-semibold text-gray-900">
                  {st.title}
                </div>
                <p className="mt-2 text-sm text-gray-600">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT / COMPANY */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Về Mioto & đơn vị vận hành
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              Nền tảng đặt xe
            </h3>
            <p className="text-gray-700">
              Mioto là nền tảng cho thuê xe ô tô và xe máy theo mô hình
              kinh tế chia sẻ, kết nối chủ xe với khách thuê trên toàn quốc.
              Nền tảng hỗ trợ đa dạng phương thức thanh toán, giao xe tận nơi
              và các chính sách bảo vệ chuyến đi.*
            </p>
           
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              Thông tin doanh nghiệp
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <span className="font-medium">Tên pháp lý: </span>
                Công ty Cổ phần Mioto Việt Nam
              </li>
              <li>
                <span className="font-medium">Địa chỉ: </span>
                561A Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. HCM
              </li>
              <li>
                <span className="font-medium">Hotline: </span>1900 9217
              </li>
              <li>
                <span className="font-medium">Email: </span>
                contact@mioto.vn
              </li>
              <li>
                <span className="font-medium">Website: </span>
                <a
                  className="underline text-green-600 hover:text-green-700"
                  href="https://www.mioto.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  mioto.vn
                </a>
              </li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              Nguồn tham khảo công khai: website & danh bạ doanh nghiệp.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl px-8 py-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Sẵn sàng cho hành trình?</h3>
            <p className="mt-1">
              Khám phá và đặt xe chỉ với vài thao tác trên Mioto.
            </p>
          </div>
          <div className="flex gap-3">
            {/* <a
              href="https://www.mioto.vn"
              target="_blank"
               rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-white text-green-700 font-semibold px-6 py-3 shadow hover:bg-gray-100"
            >
              Truy cập Mioto.vn
            </a> */}
            <a
              href="https://www.mioto.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-black text-white font-semibold px-6 py-3 shadow hover:bg-gray-800"
            >
              Tải ứng dụng
            </a>
          </div>
        </div>
      </section>

    </main>
  );
};

export default AboutMiotoPage;
