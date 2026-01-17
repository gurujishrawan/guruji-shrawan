"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

/* ================= VIDEO DATA (YOUR LINKS) ================= */
const videos = [
  { id: "9QVnaoOZLe4", title: "Understanding Life & Awareness" },
  { id: "Uy0vnC-8sOc", title: "Clarity in Daily Living" },
  { id: "f2ZrDTv8u5A", title: "Fear, Desire & Freedom" },

  // Shorts
  { id: "9y24DYIi8AI", title: "Short Reflection on Truth" },
  { id: "Rbmmy93I8kI", title: "Self-Inquiry in One Minute" },
  { id: "uZWLyDM55SU", title: "A Simple Question to Yourself" },
  { id: "jUFO29xoZeo", title: "Silence Speaks More" },
  { id: "tCInReBSoeY", title: "Look Inward, Not Outward" },
  { id: "KuLZo8FcPFU", title: "Freedom Begins Here" },
];

export default function VideoGallery({ title }) {
  return (
    <section className="bg-[#f7f5f2] py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold">{title}</h2>
          <a
            href="https://youtube.com/@gurujishrawan"
            target="_blank"
            className="text-sm text-[#e4572e]"
          >
            See all videos →
          </a>
        </div>

        {/* Slider */}
        <Swiper
          spaceBetween={24}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {videos.map((video) => (
            <SwiperSlide key={video.id}>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                className="group block"
              >
                {/* Thumbnail Card */}
                <div className="relative overflow-hidden rounded-md shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 w-12 h-12 rounded-full flex items-center justify-center text-black text-lg transition group-hover:scale-110">
                      ▶
                    </div>
                  </div>
                </div>

                {/* Title */}
                <p className="mt-3 text-sm font-medium leading-snug text-[#1c1c1c]">
                  {video.title}
                </p>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
