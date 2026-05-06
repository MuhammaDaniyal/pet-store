import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-8 py-8 sm:px-12 sm:py-10">
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
              <p>
                <span className="font-medium text-primary">Email:</span>
                <br />
                <a
                  href="mailto:support@petstore.com"
                  className="transition-colors hover:text-primary"
                >
                  support@petstore.com
                </a>
              </p>
              <p>
                <span className="font-medium text-primary">Phone:</span>
                <br />
                <a
                  href="tel:+1234567890"
                  className="transition-colors hover:text-primary"
                >
                  (123) 456-7890
                </a>
              </p>
              <p>
                <span className="font-medium text-primary">Address:</span>
                <br />
                123 Pet Street, Pet City, PC 12345
              </p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-6 border-t border-[#E5E3DD] py-6">
          <h4 className="mb-4 text-[12px] font-semibold text-primary">FOLLOW US</h4>
          <div className="flex gap-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-muted transition-colors hover:text-primary"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-muted transition-colors hover:text-primary"
            >
              Instagram
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-muted transition-colors hover:text-primary"
            >
              Twitter
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-muted transition-colors hover:text-primary"
            >
              YouTube
            </a>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="border-t border-[#E5E3DD] pt-6 text-center text-[11px] tracking-[0.2em] text-muted">
          <p>PETSTORE © {new Date().getFullYear()} ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </footer>
  );
}
