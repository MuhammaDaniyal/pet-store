import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-[#F0EBE1] dark:bg-surface/50">
      {/* Localized Grain Overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* Content Container (z-10 to sit above the grain) */}
      <div className="relative z-10 mx-auto max-w-6xl px-8 py-8 sm:px-12 sm:py-10">
        {/* Top Section - Logo and Quick Links */}
        <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Branding */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.28em] text-primary">
              PETSTORE
            </h3>
            <p className="mt-3 text-[12px] leading-relaxed text-muted">
              Your trusted partner in pet care and supplies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[12px] font-semibold text-primary">QUICK LINKS</h4>
            <nav className="mt-3 flex flex-col gap-3 text-[12px]">
              <Link href="/" className="text-muted transition-colors hover:text-primary">
                Home
              </Link>
              <Link href="/about" className="text-muted transition-colors hover:text-primary">
                About
              </Link>
              <Link href="/shop" className="text-muted transition-colors hover:text-primary">
                Shop
              </Link>
              <Link href="/contact" className="text-muted transition-colors hover:text-primary">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[12px] font-semibold text-primary">CONTACT US</h4>
            <div className="mt-3 flex flex-col gap-2 text-[12px] text-muted">
              <p className="flex items-center gap-2">
                <span className="font-medium text-primary"><Mail size={16} /></span>
                <a
                  href="mailto:support@petstore.com"
                  className="transition-colors hover:text-primary"
                >
                  support@petstore.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium text-primary"><Phone size={16} /></span>
                <a
                  href="tel:+1234567890"
                  className="transition-colors hover:text-primary"
                >
                  (123) 456-7890
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium text-primary"><MapPin size={16} /></span>
                <span>123 Pet Street, Pet City, PC 12345</span>
              </p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-6 border-t border-border/50 py-6">
          <h4 className="mb-4 text-[12px] font-semibold text-primary">FOLLOW US</h4>
          <div className="flex gap-6">
            <a href="https://facebook.com" className="text-[12px] text-muted transition-colors hover:text-primary"><FaFacebook className="group-hover:scale-110 transition-transform" size={16} /></a>
            <a href="https://instagram.com" className="text-[12px] text-muted transition-colors hover:text-primary"><FaInstagram className="group-hover:scale-110 transition-transform" size={16} /></a>
            <a href="https://twitter.com" className="text-[12px] text-muted transition-colors hover:text-primary"><FaTwitter className="group-hover:scale-110 transition-transform" size={16} /></a>
            <a href="https://youtube.com" className="text-[12px] text-muted transition-colors hover:text-primary"><FaYoutube className="group-hover:scale-110 transition-transform" size={16} /></a>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="border-t border-border/50 pt-6 text-center text-[11px] tracking-[0.2em] text-muted">
          <p>PETSTORE © {new Date().getFullYear()} ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </footer>
  );
}