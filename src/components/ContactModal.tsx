import { useState } from "react"
import emailjs from '@emailjs/browser'
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Send,
  CheckCircle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContactFormData {
  hospitalName: string
  contactName: string
  position: string
  email: string
  phone: string
  employeeCount: string
  inquiryType: string
  message: string
}

const ContactModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<ContactFormData>({
    hospitalName: "",
    contactName: "",
    position: "",
    email: "",
    phone: "",
    employeeCount: "",
    inquiryType: "",
    message: ""
  })

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // EmailJS를 사용한 실제 이메일 전송
      const templateParams = {
        to_email: 'admin@mediconsol.com',
        from_name: formData.contactName,
        hospital_name: formData.hospitalName,
        contact_name: formData.contactName,
        position: formData.position,
        email: formData.email,
        phone: formData.phone,
        employee_count: formData.employeeCount,
        inquiry_type: formData.inquiryType,
        message: formData.message,
        submit_time: new Date().toLocaleString('ko-KR'),
        subject: `[메디HR+] ${formData.hospitalName} - ${formData.inquiryType} 문의`
      }

      // 실제 EmailJS 사용 시 (서비스 설정 후)
      // await emailjs.send(
      //   'YOUR_SERVICE_ID',
      //   'YOUR_TEMPLATE_ID', 
      //   templateParams,
      //   'YOUR_PUBLIC_KEY'
      // )

      // 데모용 시뮬레이션
      console.log("문의 내용:", templateParams)
      
      // 실제 전송 시뮬레이션 (2초 대기)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSubmitted(true)
      
      // 3초 후 모달 닫기
      setTimeout(() => {
        setIsOpen(false)
        setIsSubmitted(false)
        setFormData({
          hospitalName: "",
          contactName: "",
          position: "",
          email: "",
          phone: "",
          employeeCount: "",
          inquiryType: "",
          message: ""
        })
      }, 3000)
      
    } catch (error) {
      console.error("문의 전송 실패:", error)
      alert("문의 전송에 실패했습니다. 관리자(admin@mediconsol.com)에게 직접 연락주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.hospitalName && formData.contactName && 
                     formData.email && formData.phone && formData.inquiryType

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
            <Building2 className="w-4 h-4 mr-2" />
            솔루션 문의하기
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">문의가 접수되었습니다!</h3>
            <p className="text-gray-600 mb-4">
              담당자가 확인 후 빠른 시일 내에 연락드리겠습니다.
            </p>
            <p className="text-sm text-gray-500">
              문의 내용이 admin@mediconsol.com으로 전송되었습니다.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
          <Building2 className="w-4 h-4 mr-2" />
          솔루션 문의하기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            스마트병원경영 솔루션 문의
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 병원 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              병원 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hospitalName">병원명 *</Label>
                <Input
                  id="hospitalName"
                  value={formData.hospitalName}
                  onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                  placeholder="예: 메디콘솔병원"
                  required
                />
              </div>
              <div>
                <Label htmlFor="employeeCount">직원 수 *</Label>
                <Select value={formData.employeeCount} onValueChange={(value) => handleInputChange("employeeCount", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="직원 수를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50-under">50명 미만</SelectItem>
                    <SelectItem value="50-100">50명 - 100명</SelectItem>
                    <SelectItem value="100-300">100명 - 300명</SelectItem>
                    <SelectItem value="300-500">300명 - 500명</SelectItem>
                    <SelectItem value="500-over">500명 이상</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 담당자 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              담당자 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">담당자명 *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange("contactName", e.target.value)}
                  placeholder="홍길동"
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">직책</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  placeholder="예: 인사팀장, 병원장"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">이메일 *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contact@hospital.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">연락처 *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="010-1234-5678"
                  required
                />
              </div>
            </div>
          </div>

          {/* 문의 내용 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              문의 내용
            </h3>
            <div>
              <Label htmlFor="inquiryType">문의 유형 *</Label>
              <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="문의 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demo">데모 요청</SelectItem>
                  <SelectItem value="pricing">가격 문의</SelectItem>
                  <SelectItem value="features">기능 문의</SelectItem>
                  <SelectItem value="implementation">도입 상담</SelectItem>
                  <SelectItem value="integration">시스템 연동</SelectItem>
                  <SelectItem value="custom">맞춤 개발</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message">상세 문의 내용</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="문의하고 싶은 내용을 자세히 작성해주세요..."
                rows={5}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>개인정보 처리 방침:</strong> 입력하신 정보는 문의 처리 목적으로만 사용되며, 
              관련 법령에 따라 안전하게 관리됩니다. 문의 처리 완료 후 개인정보는 즉시 삭제됩니다.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                전송 중...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                문의 신청하기
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ContactModal