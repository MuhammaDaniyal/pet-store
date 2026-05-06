import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
    { href: "/account", label: "Dashboard" },
    { href: "/account/profile", label: "Profile" },
    { href: "/account/orders", label: "Orders" },
    { href: "/account/wishlist", label: "Wishlist" },
];

const AccountSideBar = () => {
    const pathname = usePathname();

    return (
        <aside className="md:col-span-1">
            <nav className="space-y-2">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`block px-4 py-2 rounded-md transition-colors ${isActive
                                    ? "bg-accent text-white font-medium"
                                    : "text-secondary hover:bg-[#E8E6E0]"
                                }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>)
}

export default AccountSideBar
