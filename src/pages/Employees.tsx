import { useState } from "react"
import { 
  Users, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  UserCheck,
  UserX,
  Star,
  Award,
  TrendingUp,
  TrendingDown,
  Calendar,
  Phone,
  Mail,
  Building2,
  Crown,
  User,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  Plus,
  Download,
  Eye,
  MessageSquare,
  BarChart3
} from "lucide-react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Footer from "@/components/layout/Footer"

interface EmployeeDetail {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  hireDate: string
  status: "active" | "inactive" | "leave"
  satisfactionScore: number
  performanceScore: number
  responseRate: number
  lastSurveyDate: string
  riskLevel: "low" | "medium" | "high"
  isManager: boolean
  reportsTo?: string
  teamSize?: number
  recentFeedbacks: number
  trainingCompleted: number
  totalTraining: number
  achievements: string[]
  notes: string
}

const mockEmployees: EmployeeDetail[] = [
  {
    id: "1",
    name: "김간호사",
    position: "간호사",
    department: "간호부",
    email: "nurse.kim@hospital.com",
    phone: "010-1234-5678",
    hireDate: "2022-01-15",
    status: "active",
    satisfactionScore: 8.2,
    performanceScore: 8.5,
    responseRate: 95,
    lastSurveyDate: "2024-11-20",
    riskLevel: "low",
    isManager: false,
    reportsTo: "박간호부장",
    recentFeedbacks: 2,
    trainingCompleted: 8,
    totalTraining: 10,
    achievements: ["우수직원상", "환자만족도 1위"],
    notes: "성실하고 책임감이 강한 직원. 환자 응대가 우수함."
  },
  {
    id: "2",
    name: "박간호부장",
    position: "간호부장",
    department: "간호부",
    email: "head.nurse@hospital.com",
    phone: "010-2345-6789",
    hireDate: "2020-03-01",
    status: "active",
    satisfactionScore: 8.8,
    performanceScore: 9.2,
    responseRate: 100,
    lastSurveyDate: "2024-11-22",
    riskLevel: "low",
    isManager: true,
    teamSize: 45,
    recentFeedbacks: 5,
    trainingCompleted: 15,
    totalTraining: 15,
    achievements: ["최우수관리자상", "팀워크 향상상", "혁신아이디어상"],
    notes: "뛰어난 리더십으로 팀을 이끌고 있음. 직원들의 신뢰가 높음."
  },
  {
    id: "3",
    name: "이원무",
    position: "원무직원",
    department: "원무과",
    email: "admin.lee@hospital.com",
    phone: "010-3456-7890",
    hireDate: "2023-06-01",
    status: "active",
    satisfactionScore: 7.1,
    performanceScore: 7.8,
    responseRate: 80,
    lastSurveyDate: "2024-11-15",
    riskLevel: "medium",
    isManager: false,
    reportsTo: "송원무과장",
    recentFeedbacks: 1,
    trainingCompleted: 5,
    totalTraining: 8,
    achievements: ["신입직원 우수상"],
    notes: "업무 적응이 빠르나 스트레스 관리 필요."
  },
  {
    id: "4",
    name: "최물리치료사",
    position: "물리치료사",
    department: "물리치료실",
    email: "pt.choi@hospital.com", 
    phone: "010-4567-8901",
    hireDate: "2021-09-15",
    status: "active",
    satisfactionScore: 9.2,
    performanceScore: 9.0,
    responseRate: 100,
    lastSurveyDate: "2024-11-25",
    riskLevel: "low",
    isManager: false,
    reportsTo: "이물리치료사",
    recentFeedbacks: 3,
    trainingCompleted: 12,
    totalTraining: 12,
    achievements: ["전문성 우수상", "환자회복률 1위", "동료추천상"],
    notes: "전문성이 뛰어나고 환자들의 만족도가 매우 높음."
  },
  {
    id: "5",
    name: "정진료지원",
    position: "진료지원직원", 
    department: "진료지원부",
    email: "support.jung@hospital.com",
    phone: "010-5678-9012",
    hireDate: "2022-11-01",
    status: "active",
    satisfactionScore: 6.2,
    performanceScore: 6.8,
    responseRate: 60,
    lastSurveyDate: "2024-10-28",
    riskLevel: "high",
    isManager: false,
    reportsTo: "김진료지원팀장",
    recentFeedbacks: 0,
    trainingCompleted: 3,
    totalTraining: 10,
    achievements: [],
    notes: "최근 업무 만족도가 크게 하락. 면담 및 지원 필요."
  }
]

const getStatusBadge = (status: EmployeeDetail["status"]) => {
  const statusConfig = {
    active: { label: "재직", color: "bg-green-100 text-green-800" },
    inactive: { label: "휴직", color: "bg-yellow-100 text-yellow-800" },
    leave: { label: "퇴사", color: "bg-gray-100 text-gray-800" }
  }
  
  const config = statusConfig[status]
  return <Badge className={`${config.color} border-0`}>{config.label}</Badge>
}

const getRiskBadge = (riskLevel: EmployeeDetail["riskLevel"]) => {
  const riskConfig = {
    low: { label: "안정", color: "bg-green-100 text-green-800" },
    medium: { label: "주의", color: "bg-yellow-100 text-yellow-800" },
    high: { label: "위험", color: "bg-red-100 text-red-800" }
  }
  
  const config = riskConfig[riskLevel]
  return <Badge className={`${config.color} border-0`}>{config.label}</Badge>
}

const getScoreColor = (score: number) => {
  if (score >= 8.5) return "text-green-600"
  if (score >= 7.5) return "text-blue-600"
  if (score >= 7.0) return "text-yellow-600"
  return "text-red-600"
}

const Employees = () => {
  const [employees, setEmployees] = useState<EmployeeDetail[]>(mockEmployees)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedRisk, setSelectedRisk] = useState("all")
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetail | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || emp.department === selectedDepartment
    const matchesStatus = selectedStatus === "all" || emp.status === selectedStatus
    const matchesRisk = selectedRisk === "all" || emp.riskLevel === selectedRisk
    return matchesSearch && matchesDepartment && matchesStatus && matchesRisk
  })

  const handleEmployeeClick = (employee: EmployeeDetail) => {
    setSelectedEmployee(employee)
    setIsDetailOpen(true)
  }

  const stats = {
    total: employees.filter(e => e.status === 'active').length,
    highPerformers: employees.filter(e => e.performanceScore >= 8.5 && e.status === 'active').length,
    atRisk: employees.filter(e => e.riskLevel === 'high' && e.status === 'active').length,
    avgSatisfaction: employees.filter(e => e.status === 'active').reduce((sum, e) => sum + e.satisfactionScore, 0) / employees.filter(e => e.status === 'active').length
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <Header />
          
          <main className="flex-1 p-6 space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">직원 관리</h1>
                <p className="text-gray-600">직원들의 성과와 만족도를 추적하고 관리하세요</p>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  리포트 다운로드
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  직원 추가
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">전체 직원</p>
                      <p className="text-2xl font-bold">{stats.total}명</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">고성과자</p>
                      <p className="text-2xl font-bold text-green-600">{stats.highPerformers}명</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">주의 필요</p>
                      <p className="text-2xl font-bold text-red-600">{stats.atRisk}명</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">평균 만족도</p>
                      <p className={`text-2xl font-bold ${getScoreColor(stats.avgSatisfaction)}`}>
                        {stats.avgSatisfaction.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-64 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="직원 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 부서</SelectItem>
                  <SelectItem value="간호부">간호부</SelectItem>
                  <SelectItem value="원무과">원무과</SelectItem>
                  <SelectItem value="물리치료실">물리치료실</SelectItem>
                  <SelectItem value="진료지원부">진료지원부</SelectItem>
                  <SelectItem value="행정팀">행정팀</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="active">재직</SelectItem>
                  <SelectItem value="inactive">휴직</SelectItem>
                  <SelectItem value="leave">퇴사</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 위험도</SelectItem>
                  <SelectItem value="low">안정</SelectItem>
                  <SelectItem value="medium">주의</SelectItem>
                  <SelectItem value="high">위험</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Employee List */}
            <div className="grid gap-4">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleEmployeeClick(employee)}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {employee.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{employee.name}</h3>
                            {employee.isManager && <Crown className="w-5 h-5 text-yellow-500" />}
                            {getStatusBadge(employee.status)}
                            {getRiskBadge(employee.riskLevel)}
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {employee.position}
                            </div>
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {employee.department}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              입사: {employee.hireDate}
                            </div>
                            {employee.isManager && employee.teamSize && (
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                팀원 {employee.teamSize}명
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-4 gap-4">
                            <div className="text-center p-2 bg-blue-50 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">만족도</p>
                              <p className={`text-lg font-bold ${getScoreColor(employee.satisfactionScore)}`}>
                                {employee.satisfactionScore}
                              </p>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">성과</p>
                              <p className={`text-lg font-bold ${getScoreColor(employee.performanceScore)}`}>
                                {employee.performanceScore}
                              </p>
                            </div>
                            <div className="text-center p-2 bg-purple-50 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">응답률</p>
                              <p className="text-lg font-bold text-purple-600">{employee.responseRate}%</p>
                            </div>
                            <div className="text-center p-2 bg-orange-50 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">교육 진도</p>
                              <p className="text-lg font-bold text-orange-600">
                                {employee.trainingCompleted}/{employee.totalTraining}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              편집
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              면담 기록
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="w-4 h-4 mr-2" />
                              성과 리포트
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        {employee.achievements.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-yellow-600">
                            <Star className="w-4 h-4" />
                            <span>{employee.achievements.length}개 성과</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">직원이 없습니다</h3>
                <p className="text-gray-600">
                  {searchTerm ? "검색 조건에 맞는 직원이 없습니다." : "직원을 추가해보세요."}
                </p>
              </div>
            )}

            {/* Employee Detail Modal */}
            {selectedEmployee && (
              <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {selectedEmployee.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {selectedEmployee.name}
                      {selectedEmployee.isManager && <Crown className="w-5 h-5 text-yellow-500" />}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">개요</TabsTrigger>
                      <TabsTrigger value="performance">성과</TabsTrigger>
                      <TabsTrigger value="training">교육</TabsTrigger>
                      <TabsTrigger value="feedback">피드백</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>기본 정보</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">직급:</span>
                              <span className="font-medium">{selectedEmployee.position}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">부서:</span>
                              <span className="font-medium">{selectedEmployee.department}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">입사일:</span>
                              <span className="font-medium">{selectedEmployee.hireDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">상태:</span>
                              {getStatusBadge(selectedEmployee.status)}
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">위험도:</span>
                              {getRiskBadge(selectedEmployee.riskLevel)}
                            </div>
                            {selectedEmployee.reportsTo && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">보고 대상:</span>
                                <span className="font-medium">{selectedEmployee.reportsTo}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>연락처</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span>{selectedEmployee.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{selectedEmployee.phone}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>성과 지표</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-2">만족도 점수</p>
                              <p className={`text-3xl font-bold ${getScoreColor(selectedEmployee.satisfactionScore)}`}>
                                {selectedEmployee.satisfactionScore}
                              </p>
                              <Progress value={selectedEmployee.satisfactionScore * 10} className="mt-2" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-2">성과 점수</p>
                              <p className={`text-3xl font-bold ${getScoreColor(selectedEmployee.performanceScore)}`}>
                                {selectedEmployee.performanceScore}
                              </p>
                              <Progress value={selectedEmployee.performanceScore * 10} className="mt-2" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-2">설문 응답률</p>
                              <p className="text-3xl font-bold text-blue-600">{selectedEmployee.responseRate}%</p>
                              <Progress value={selectedEmployee.responseRate} className="mt-2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {selectedEmployee.notes && (
                        <Card>
                          <CardHeader>
                            <CardTitle>관리자 노트</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">{selectedEmployee.notes}</p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>성과 트렌드</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">성과 트렌드 차트</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>수상 이력</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {selectedEmployee.achievements.length > 0 ? (
                              <div className="space-y-2">
                                {selectedEmployee.achievements.map((achievement, index) => (
                                  <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                                    <Award className="w-4 h-4 text-yellow-600" />
                                    <span className="text-yellow-800">{achievement}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-600">수상 이력이 없습니다.</p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="training" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>교육 진행률</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-4">
                            <span>전체 진행률</span>
                            <span className="font-semibold">
                              {selectedEmployee.trainingCompleted}/{selectedEmployee.totalTraining} 
                              ({Math.round((selectedEmployee.trainingCompleted / selectedEmployee.totalTraining) * 100)}%)
                            </span>
                          </div>
                          <Progress 
                            value={(selectedEmployee.trainingCompleted / selectedEmployee.totalTraining) * 100} 
                            className="h-3"
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="feedback" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>최근 피드백</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                              최근 피드백 {selectedEmployee.recentFeedbacks}건
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            )}
            
            {/* Footer */}
            <Footer />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default Employees