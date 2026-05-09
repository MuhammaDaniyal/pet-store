"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, LayoutDashboard, Package, UserRound, LogOut, Loader2 } from "lucide-react";

const sidebarLinks = [
    { href: "/account", label: "Dashboard", icon: LayoutDashboard },
    { href: "/account/profile", label: "Profile", icon: UserRound },
    { href: "/account/orders", label: "Orders", icon: Package },
    { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

const AccountSideBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    
    // 1. Add state to track if the logout process is running
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        // 2. Set loading to true as soon as they click
        setIsLoggingOut(true); 
        
        try {
            await fetch("/api/logout", {
                method: "POST",
            });
            
            // 3. Redirect to sign-in page instead of home
            router.push("/sign-in");
            router.refresh(); 
        } catch (error) {
            console.error("Failed to sign out:", error);
            // If it fails, let them click the button again
            setIsLoggingOut(false); 
        }
    };

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

                    {/* Subtle Divider */}
                    <div className="my-4 h-px w-full bg-black/5 dark:bg-white/10" />

                    {/* 4. Update the Logout Button */}
                    <button 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {/* Show spinning loader if logging out, otherwise show standard LogOut icon */}
                        {isLoggingOut ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <LogOut className="h-4 w-4" />
                        )}
                        
                        {/* Change text dynamically */}
                        {isLoggingOut ? "Logging out..." : "Sign out"}
                    </button>
                </nav>
            </div>
        </aside>
    );
};

export default AccountSideBar;