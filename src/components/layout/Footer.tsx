import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Logo */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-2">광동제약</h2>
          </div>

          {/* Links & Address */}
          <div className="space-y-4">
            {/* Footer Navigation */}
            <div className="flex flex-wrap gap-4 text-sm">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                방문신청약관
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                개인정보처리방침
              </button>
              <Link
                to="/faq"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </Link>
            </div>

            {/* Address */}
            <address className="text-xs text-muted-foreground not-italic">
              서울특별시 송파구 위례성대로 14 광동타워 서비스 문의 02 410 0321
              <br />
              Copyright © 2023 Kwangdong Pharmaceutical Co.,Ltd. All Rights Reserved.
            </address>
          </div>
        </div>
      </div>
    </footer>
  );
}
