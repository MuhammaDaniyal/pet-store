import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#D6D4CE]">
      <div className="mx-auto max-w-6xl px-8 py-8 sm:px-12 sm:py-10">
        {/* Top Section - Logo and Quick Links */}
        <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Branding */}
          <div>
            <h3 className="text-[11px] font-bold tracking-[0.28em] text-[#0A0A0A]">
              PETSTORE
            </h3>
            <p className="mt-3 text-[12px] leading-relaxed text-[#8A8880]">
              Your trusted partner in pet care and supplies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[12px] font-semibold text-[#0A0A0A]">QUICK LINKS</h4>
            <nav className="mt-3 flex flex-col gap-3 text-[12px]">
              <Link href="/" className="text-[#8A8880] transition-colors hover:text-[#0A0A0A]">
                Home
              </Link>
              <Link href="/about" className="text-[#8A8880] transition-colors hover:text-[#0A0A0A]">
                About
              </Link>
              <Link href="/shop" className="text-[#8A8880] transition-colors hover:text-[#0A0A0A]">
                Shop
              </Link>
              <Link href="/contact" className="text-[#8A8880] transition-colors hover:text-[#0A0A0A]">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[12px] font-semibold text-[#0A0A0A]">CONTACT US</h4>
            <div className="mt-3 flex flex-col gap-2 text-[12px] text-[#8A8880]">
              <p>
                <span className="font-medium text-[#0A0A0A]">Email:</span>
                <br />
                <a
                  href="mailto:support@petstore.com"
                  className="transition-colors hover:text-[#0A0A0A]"
                >
                  support@petstore.com
                </a>
              </p>
              <p>
                <span className="font-medium text-[#0A0A0A]">Phone:</span>
                <br />
                <a
                  href="tel:+1234567890"
                  className="transition-colors hover:text-[#0A0A0A]"
                >
                  (123) 456-7890
                </a>
              </p>
              <p>
                <span className="font-medium text-[#0A0A0A]">Address:</span>
                <br />
                123 Pet Street, Pet City, PC 12345
              </p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-6 border-t border-[#E5E3DD] py-6">
          <h4 className="mb-4 text-[12px] font-semibold text-[#0A0A0A]">FOLLOW US</h4>
          <div className="flex gap-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[#8A8880] transition-colors hover:text-[#0A0A0A]"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[#8A8880] transition-colors hover:text-[#0A0A0A]"
            >
              Instagram
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[#8A8880] transition-colors hover:text-[#0A0A0A]"
            >
              Twitter
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[#8A8880] transition-colors hover:text-[#0A0A0A]"
            >
              YouTube
            </a>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="border-t border-[#E5E3DD] pt-6 text-center text-[11px] tracking-[0.2em] text-[#8A8880]">
          <p>PETSTORE © {new Date().getFullYear()} ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </footer>
  );
}
