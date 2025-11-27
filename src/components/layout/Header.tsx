import { Link, useLocation } from "react-router-dom";
import kwangdongLogo from "@/assets/kwangdong-primary-signature.png";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src={kwangdongLogo} 
                alt="광동제약" 
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              방문예약
            </Link>
            <Link
              to="/progress"
              className={`text-sm font-medium transition-colors ${
                isActive("/progress")
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              예약현황
            </Link>
            <Link
              to="/notice"
              className={`text-sm font-medium transition-colors ${
                isActive("/notice")
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              공지사항
            </Link>
            <Link
              to="/faq"
              className={`text-sm font-medium transition-colors ${
                isActive("/faq")
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              FAQ
            </Link>
          </nav>

          {/* Employee Mode Link */}
          <div className="hidden md:block">
            <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              임직원모드
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
