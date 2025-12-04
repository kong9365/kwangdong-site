import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import kwangdongLogo from "@/assets/kwangdong-primary-signature.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: "/", label: "방문예약" },
    { path: "/progress", label: "예약현황" },
    { path: "/visit/checkin", label: "방문수속" },
    { path: "/notice", label: "공지사항" },
    { path: "/faq", label: "FAQ" },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-primary border-b border-primary/20 sticky top-0 z-50 shadow-sm relative">
      {/* Logo - 왼쪽 가장자리에 배치 */}
      <div className="absolute left-0 top-0 bg-white h-16 px-4 sm:px-6 flex items-center z-10">
        <Link to="/" className="flex items-center">
          <img 
            src={kwangdongLogo} 
            alt="광동제약" 
            className="h-10 sm:h-12 w-auto"
          />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ml-0 sm:ml-[180px]">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-primary-foreground bg-primary-foreground/10 px-3 py-1.5 rounded-md"
                    : "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 px-3 py-1.5 rounded-md"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Employee Mode Link */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/employee"
              className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-md ${
                isActive("/employee") || isActive("/admin/approval")
                  ? "text-primary-foreground bg-primary-foreground/10"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              임직원모드
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 rounded-md text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                aria-label="메뉴 열기"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle className="text-left">메뉴</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`text-base font-medium transition-colors py-2 px-3 rounded-md ${
                      isActive(item.path)
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-border pt-4 mt-4">
                  <Link
                    to="/employee"
                    onClick={handleLinkClick}
                    className={`text-base font-medium transition-colors py-2 px-3 rounded-md block ${
                      isActive("/employee") || isActive("/admin/approval")
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    임직원모드
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}