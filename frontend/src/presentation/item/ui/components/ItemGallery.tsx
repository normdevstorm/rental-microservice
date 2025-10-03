import React, { useMemo } from "react";

/* ---------- Optional placeholder Header/Footer (swap with yours) ---------- */
// const Header = () => (
//   <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
//     <div className="mx-auto max-w-[1440px] px-6 lg:px-8 h-14 flex items-center justify-between">
//       <div className="font-semibold tracking-tight">Your Header</div>
//       <nav className="text-sm text-gray-600">Nav</nav>
//     </div>
//   </header>
// );
// const Footer = () => (
//   <footer className="w-full border-t bg-white">
//     <div className="mx-auto max-w-[1440px] px-6 lg:px-8 py-8 text-sm text-gray-600">
//       © {new Date().getFullYear()} Your Company
//     </div>
//   </footer>
// );
/* -------------------------------- Gallery -------------------------------- */
export const ItemGallery: React.FC<{ images: string[]; modelName: string }> = ({
  images,
  modelName,
}) => {
  // Ensure exactly 4 slots (repeat first as filler if fewer)
  const [main, ...rest] = useMemo(() => {
    const filled = [...images];
    while (filled.length < 4 && filled.length > 0) filled.push(filled[0]);
    if (filled.length === 0) {
      return [
        "https://picsum.photos/1200/800?random=1",
        "https://picsum.photos/600/600?random=2",
        "https://picsum.photos/600/600?random=3",
        "https://picsum.photos/600/600?random=4",
      ];
    }
    return filled.slice(0, 4);
  }, [images]);

  return (
    <section className="w-full bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
        <div className="h-[600px] py-6 md:py-8">
          <div className="flex h-full w-full flex-col gap-4 md:gap-6 lg:flex-row">
            {/* Left column: fixed 760px */}
            <div className="group relative h-[320px] overflow-hidden rounded-3xl ring-1 ring-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] lg:h-full lg:w-[760px]">
              <img
                src={main}
                alt={`${modelName} - main image`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="eager"
                sizes="(min-width:1024px) 760px, 100vw"
              />
            </div>

            {/* Right column: remaining width with 3 stacked images */}
            <div className="grid w-full flex-1 grid-rows-3 gap-4 md:gap-6 lg:h-full">
              {rest.map((src, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-3xl ring-1 ring-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
                >
                  <img
                    src={src}
                    alt={`${modelName} - gallery ${idx + 2}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                    sizes="(min-width:1024px) 33vw, 100vw"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* <div className="mt-3 text-sm text-gray-500">1 / 4</div> */}
        </div>
      </div>
    </section>
  );
};
