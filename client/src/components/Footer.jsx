import { Link } from "react-router-dom";
import { FaFacebook, FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-2">TaskEarn</h3>
            <p className="text-gray-400">
              Earn money by completing micro tasks from the comfort of your
              home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@taskearn.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Location: San Francisco, CA</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-blue-400 transition"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-blue-400 transition"
              >
                <FaLinkedin />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-gray-400 transition"
              >
                <FaGithub />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-blue-400 transition"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 mb-8" />

        {/* Copyright */}
        <div className="text-center text-gray-400">
          <p>
            &copy; {currentYear} TaskEarn Platform. All rights reserved. |
            <Link to="/" className="text-blue-400 hover:text-blue-300 ml-2">
              Privacy Policy
            </Link>{" "}
            |
            <Link to="/" className="text-blue-400 hover:text-blue-300 ml-2">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
