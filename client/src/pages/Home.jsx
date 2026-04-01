import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Home() {
  return (
    <div>
      {/* Hero Section with Carousel */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
          >
            <SwiperSlide>
              <div className="text-center py-20">
                <h1 className="text-5xl font-bold mb-4">
                  Earn Money From Home
                </h1>
                <p className="text-xl mb-8">
                  Complete micro tasks and get paid instantly
                </p>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
                >
                  Get Started
                </Link>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="text-center py-20">
                <h1 className="text-5xl font-bold mb-4">
                  Post Tasks & Find Workers
                </h1>
                <p className="text-xl mb-8">
                  Build your business with our global task force
                </p>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
                >
                  Post a Task
                </Link>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="text-center py-20">
                <h1 className="text-5xl font-bold mb-4">
                  Simple, Fast & Secure
                </h1>
                <p className="text-xl mb-8">
                  Join thousands of users earning on our platform
                </p>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
                >
                  Join Now
                </Link>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* Top Workers Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">
            Top Earning Workers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Placeholder for workers */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition"
              >
                <img
                  src={`https://via.placeholder.com/150`}
                  alt="Worker"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">Worker {i}</h3>
                <p className="text-gray-600 mb-4">
                  Available Coins:{" "}
                  <span className="font-bold text-blue-600">1,250</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Extra Sections */}
      {/* Section 1: How It Works */}
      <section className="bg-gray-100 py-16">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-3">1. Post Task</h3>
              <p className="text-gray-600">
                Create and post your tasks with fair payment rates
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-3">2. Find Workers</h3>
              <p className="text-gray-600">
                Connect with experienced workers globally
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-3">3. Pay & Earn</h3>
              <p className="text-gray-600">
                Secure payment system for buyers and workers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Statistics */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">
            Platform Statistics
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">50K+</p>
              <p className="text-xl">Active Users</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">100K+</p>
              <p className="text-xl">Tasks Completed</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">$2M+</p>
              <p className="text-xl">Total Paid</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">150+</p>
              <p className="text-xl">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">
            What Users Say
          </h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
          >
            {[1, 2, 3, 4].map((i) => (
              <SwiperSlide key={i}>
                <div className="bg-white p-8 rounded-lg shadow-lg h-full">
                  <div className="flex gap-1 mb-4">{"⭐".repeat(5)}</div>
                  <p className="text-gray-600 mb-4">
                    TaskEarn has changed my life! I earn consistent income
                    completing tasks on my schedule. The platform is
                    user-friendly, secure, and pays on time.
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src="https://via.placeholder.com/50"
                      alt="User"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">User Name {i}</p>
                      <p className="text-gray-600 text-sm">Verified Member</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
}
