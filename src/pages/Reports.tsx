import { useState } from "react"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Calendar,
  Download,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  PieChart,
  LineChart
} from "lucide-react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Footer from "@/components/layout/Footer"

interface DepartmentScore {
  department: string
  score: number
  trend: "up" | "down" | "stable"
  trendValue: number
  responseRate: number
  totalEmployees: number
}

interface SurveyResult {
  id: string
  title: string
  period: string
  totalResponses: number
  averageScore: number
  completionRate: number
}

const mockDepartmentScores: DepartmentScore[] = [
  { department: "간호부", score: 8.2, trend: "up", trendValue: 0.5, responseRate: 94, totalEmployees: 95 },
  { department: "원무과", score: 7.8, trend: "up", trendValue: 0.3, responseRate: 100, totalEmployees: 12 },
  { department: "물리치료실", score: 9.1, trend: "stable", trendValue: 0.1, responseRate: 87, totalEmployees: 8 },
  { department: "진료지원부", score: 6.8, trend: "down", trendValue: -0.4, responseRate: 80, totalEmployees: 15 },
  { department: "행정팀", score: 7.9, trend: "up", trendValue: 0.7, responseRate: 91, totalEmployees: 12 },
  { department: "약제부", score: 8.5, trend: "up", trendValue: 0.2, responseRate: 100, totalEmployees: 6 },
]

const mockSurveyResults: SurveyResult[] = [
  { id: "1", title: "2024년 4분기 직원 만족도", period: "2024.10-12", totalResponses: 142, averageScore: 7.8, completionRate: 89 },
  { id: "2", title: "2024년 3분기 직원 만족도", period: "2024.07-09", totalResponses: 138, averageScore: 7.6, completionRate: 87 },
  { id: "3", title: "2024년 2분기 직원 만족도", period: "2024.04-06", totalResponses: 135, averageScore: 7.4, completionRate: 85 },
  { id: "4", title: "2024년 1분기 직원 만족도", period: "2024.01-03", totalResponses: 132, averageScore: 7.2, completionRate: 83 },
]

const satisfactionCategories = [
  { category: "업무 환경", score: 7.8, change: 0.3, color: "bg-blue-500" },
  { category: "소통 & 관계", score: 8.1, change: 0.5, color: "bg-green-500" },
  { category: "성장 & 발전", score: 7.2, change: -0.1, color: "bg-yellow-500" },
  { category: "복지 & 보상", score: 6.9, change: 0.2, color: "bg-purple-500" },
  { category: "조직문화", score: 8.0, change: 0.4, color: "bg-pink-500" },
]

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-q4")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 7) return "text-yellow-600"
    return "text-red-600"
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">리포트 분석</h1>
                <p className="text-gray-600">설문 결과와 데이터 분석을 통한 조직 인사이트</p>
              </div>
              
              <div className="flex gap-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-q4">2024년 4분기</SelectItem>
                    <SelectItem value="2024-q3">2024년 3분기</SelectItem>
                    <SelectItem value="2024-q2">2024년 2분기</SelectItem>
                    <SelectItem value="2024-q1">2024년 1분기</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 부서</SelectItem>
                    <SelectItem value="nursing">간호부</SelectItem>
                    <SelectItem value="admin">원무과</SelectItem>
                    <SelectItem value="physical">물리치료실</SelectItem>
                    <SelectItem value="support">진료지원부</SelectItem>
                    <SelectItem value="office">행정팀</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  내보내기
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">전체 만족도</p>
                      <p className="text-3xl font-bold text-green-600">7.8</p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +0.3 지난 분기 대비
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">응답률</p>
                      <p className="text-3xl font-bold text-blue-600">89%</p>
                      <p className="text-sm text-blue-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +2% 지난 분기 대비
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">참여 직원</p>
                      <p className="text-3xl font-bold text-purple-600">142명</p>
                      <p className="text-sm text-gray-500 mt-1">총 160명 중</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">리스크 부서</p>
                      <p className="text-3xl font-bold text-orange-600">1개</p>
                      <p className="text-sm text-orange-600 mt-1">진료지원부</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="departments" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="departments">부서별 분석</TabsTrigger>
                <TabsTrigger value="categories">영역별 분석</TabsTrigger>
                <TabsTrigger value="trends">트렌드 분석</TabsTrigger>
                <TabsTrigger value="insights">인사이트</TabsTrigger>
              </TabsList>

              <TabsContent value="departments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      부서별 만족도 현황
                    </CardTitle>
                    <CardDescription>
                      각 부서의 만족도 점수와 응답률을 확인하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockDepartmentScores.map((dept, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Users className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{dept.department}</h4>
                              <p className="text-sm text-gray-600">
                                {dept.totalEmployees}명 중 {Math.round(dept.totalEmployees * dept.responseRate / 100)}명 응답 
                                ({dept.responseRate}%)
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className={`text-2xl font-bold ${getScoreColor(dept.score)}`}>
                                {dept.score}
                              </p>
                              <div className="flex items-center gap-1 text-sm">
                                {getTrendIcon(dept.trend)}
                                <span className={dept.trend === 'up' ? 'text-green-600' : dept.trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                                  {dept.trend === 'up' ? '+' : dept.trend === 'down' ? '' : '±'}{dept.trendValue}
                                </span>
                              </div>
                            </div>
                            
                            <div className="w-24">
                              <div className="flex justify-between text-xs mb-1">
                                <span>응답률</span>
                                <span>{dept.responseRate}%</span>
                              </div>
                              <Progress value={dept.responseRate} className="h-2" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-primary" />
                      영역별 만족도 분석
                    </CardTitle>
                    <CardDescription>
                      만족도 조사의 각 영역별 점수와 변화
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {satisfactionCategories.map((category, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">{category.category}</h4>
                            <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                          </div>
                          
                          <div className="flex items-baseline justify-between">
                            <span className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                              {category.score}
                            </span>
                            <div className="flex items-center text-sm">
                              {category.change > 0 ? (
                                <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                              ) : category.change < 0 ? (
                                <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                              ) : null}
                              <span className={category.change > 0 ? 'text-green-600' : category.change < 0 ? 'text-red-600' : 'text-gray-600'}>
                                {category.change > 0 ? '+' : ''}{category.change}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <Progress value={(category.score / 10) * 100} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-primary" />
                      분기별 트렌드 분석
                    </CardTitle>
                    <CardDescription>
                      시간에 따른 만족도 변화 추이
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockSurveyResults.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{result.title}</h4>
                              <p className="text-sm text-gray-600">{result.period}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-8">
                            <div className="text-center">
                              <p className="text-sm text-gray-600">응답 수</p>
                              <p className="text-lg font-semibold">{result.totalResponses}명</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">평균 점수</p>
                              <p className={`text-lg font-semibold ${getScoreColor(result.averageScore)}`}>
                                {result.averageScore}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">완료율</p>
                              <p className="text-lg font-semibold text-blue-600">{result.completionRate}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        주요 성과
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-800">전체 만족도 상승</p>
                        <p className="text-sm text-green-700">지난 분기 대비 0.3점 향상 (7.5 → 7.8)</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-800">응답률 개선</p>
                        <p className="text-sm text-green-700">목표 응답률 85%를 넘어 89% 달성</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-800">물리치료실 우수</p>
                        <p className="text-sm text-green-700">9.1점으로 최고 만족도 부서</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-600">
                        <AlertTriangle className="w-5 h-5" />
                        개선 필요 영역
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="font-medium text-orange-800">진료지원부 관리 필요</p>
                        <p className="text-sm text-orange-700">6.8점으로 평균 이하, 0.4점 하락</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="font-medium text-orange-800">복지 & 보상 영역</p>
                        <p className="text-sm text-orange-700">6.9점으로 가장 낮은 만족도</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="font-medium text-orange-800">성장 & 발전 기회</p>
                        <p className="text-sm text-orange-700">7.2점으로 소폭 하락, 교육 프로그램 강화 필요</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      추천 액션 플랜
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border-l-4 border-red-500 bg-red-50">
                        <h4 className="font-medium text-red-800 mb-2">즉시 조치 필요</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• 진료지원부 개별 면담 실시</li>
                          <li>• 업무 부담 분석 및 조정</li>
                          <li>• 팀 내 갈등 요소 파악</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                        <h4 className="font-medium text-yellow-800 mb-2">단기 개선 (1-3개월)</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• 복지 제도 개선 방안 수립</li>
                          <li>• 교육 프로그램 확대</li>
                          <li>• 소통 채널 강화</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 border-l-4 border-green-500 bg-green-50">
                        <h4 className="font-medium text-green-800 mb-2">장기 전략 (3-6개월)</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• 조직문화 개선 프로그램</li>
                          <li>• 성과 인정 시스템 도입</li>
                          <li>• 정기 피드백 체계 구축</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <Footer />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default Reports