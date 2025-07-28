import { Heart, Mail, Phone, Globe } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 섹션 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-white">메디HR+</h3>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              병원 직원 만족도 조사와 데이터 분석을 통한 조직문화 개선 솔루션입니다. 
              AI 기반 설문 시스템으로 더 나은 의료 환경을 만들어갑니다.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">admin@mediconsol.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="text-sm">mediconsol.co.kr</span>
              </div>
            </div>
          </div>

          {/* 서비스 섹션 */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">서비스</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">설문 관리</a></li>
              <li><a href="#" className="hover:text-white transition-colors">리포트 분석</a></li>
              <li><a href="#" className="hover:text-white transition-colors">조직도 관리</a></li>
              <li><a href="#" className="hover:text-white transition-colors">직원 피드백</a></li>
              <li><a href="#" className="hover:text-white transition-colors">만족도 트렌드</a></li>
              <li><a href="#" className="hover:text-white transition-colors">직원 관리</a></li>
            </ul>
          </div>

          {/* 지원 섹션 */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">지원</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">사용 가이드</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">기술 지원</a></li>
              <li><a href="#" className="hover:text-white transition-colors">문의하기</a></li>
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <hr className="border-gray-700 my-8" />

        {/* 하단 카피라이트 */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2025 메디콘솔(Mediconsol). All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>mediconsol.co.kr</span>
            <span>•</span>
            <span>스마트 병원경영 솔루션</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer