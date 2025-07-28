import { Info, Shield, Eye, Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const DemoNotice = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Info className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">데모 서비스 안내</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            이 서비스는 메디HR+ 솔루션의 기능을 체험해볼 수 있는 파일럿 버전입니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">데이터 보안</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                사용자가 입력한 모든 정보는 <strong>일체 저장되지 않으며</strong>, 
                세션 종료 시 자동으로 삭제됩니다.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">체험 목적</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                실제 서비스 구현을 위한 <strong>파일럿 버전</strong>으로, 
                기능 체험 및 피드백 수집을 목적으로 합니다.
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">AI 기능</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Google AI를 활용한 설문 생성 기능을 체험하고, 
                <strong>스마트한 HR 관리</strong>의 가능성을 확인해보세요.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            정식 서비스 도입을 원하시면 <strong>admin@mediconsol.com</strong>으로 문의해주세요
          </p>
        </div>
      </div>
    </section>
  )
}

export default DemoNotice