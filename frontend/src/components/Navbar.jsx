import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Server, Settings } from "lucide-react";

export default function Navbar() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, icon, label }) => (
        <Link
            to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive(to)
                    ? "bg-cyan-900/50 text-cyan-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </Link>
    );

    return (
        <nav className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-900/20">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="w-5 h-5 text-white"
                            strokeWidth={2.5}
                        >
                            <path d="M12 2v20M2 12h20" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                        Solar Scheduler
                    </h1>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-2 bg-slate-950/50 p-1 rounded-xl border border-slate-800">
                    <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                    <NavItem to="/devices" icon={<Server size={18} />} label="Devices" />
                    <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
                </div>

                {/* Status Indicator */}
                <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    System Online
                </div>
            </div>
        </nav>
    );
}
