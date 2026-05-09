"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutDashboard, Package, UserRound } from "lucide-react";

const sidebarLinks = [
    { href: "/account", label: "Dashboard", icon: LayoutDashboard },
    { href: "/account/profile", label: "Profile", icon: UserRound },
    { href: "/account/orders", label: "Orders", icon: Package },
    { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

const AccountSideBar = () => {
    const pathname = usePathname();

    return (
        <aside className="md:col-span-1 md:sticky md:top-6 h-fit">
            <div className="rounded-[28px] border border-border bg-surface p-4 shadow-[0_18px_50px_rgba(26,83,92,0.06)]">
                <div className="border-b border-border/70 pb-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted">
                        Account center
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-primary">Your space</h2>
                    <p className="mt-2 text-sm leading-relaxed text-secondary">
                        Manage profile, orders, and saved items from one place.
                    </p>
                </div>

                <nav className="mt-4 space-y-2">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={isActive ? "page" : undefined}
                                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
                                    isActive
                                        ? "border-accent/40 bg-accent text-white shadow-[0_12px_30px_rgba(255,107,53,0.22)]"
                                        : "border-border bg-background/60 text-primary hover:border-accent/30 hover:bg-accent/10"
                                }`}
                            >
                                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-accent"}`} />
                                <span className="text-sm font-medium">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default AccountSideBar;
