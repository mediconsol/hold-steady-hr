import { useState } from "react"
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  LineChart,
  Calendar,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Eye,
  Award
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

interface TrendData {
  period: string
  score: number
  responseRate: number
  participants: number
}

interface DepartmentTrend {
  department: string
  currentScore: number
  previousScore: number
  trend: "up" | "down" | "stable"
  trendValue: number
  riskLevel: "low" | "medium" | "high"
  monthlyData: TrendData[]
}

interface CategoryTrend {
  category: string
  scores: number[]
  periods: string[]
  trend: "up" | "down" | "stable"
  change: number
}

const mockOverallTrend: TrendData[] = [
  { period: "2024-01", score: 7.2, responseRate: 83, participants: 132 },
  { period: "2024-02", score: 7.1, responseRate: 85, participants: 135 },
  { period: "2024-03", score: 7.4, responseRate: 85, participants: 135 },
  { period: "2024-04", score: 7.3, responseRate: 87, participants: 138 },
  { period: "2024-05", score: 7.5, responseRate: 86, participants: 138 },
  { period: "2024-06", score: 7.4, responseRate: 87, participants: 138 },
  { period: "2024-07", score: 7.6, responseRate: 87, participants: 138 },
  { period: "2024-08", score: 7.7, responseRate: 88, participants: 140 },
  { period: "2024-09", score: 7.6, responseRate: 87, participants: 138 },
  { period: "2024-10", score: 7.8, responseRate: 89, participants: 142 },
  { period: "2024-11", score: 7.9, responseRate: 91, participants: 145 },
  { period: "2024-12", score: 8.0, responseRate: 89, participants: 142 }
]

const mockDepartmentTrends: DepartmentTrend[] = [
  {
    department: "간호부",
    currentScore: 8.2,
    previousScore: 7.9,
    trend: "up",
    trendValue: 0.3,
    riskLevel: "low",
    monthlyData: [
      { period: "2024-09", score: 7.9, responseRate: 94, participants: 89 },
      { period: "2024-10", score: 8.0, responseRate: 95, participants: 90 },
      { period: "2024-11", score: 8.1, responseRate: 94, participants: 89 },
      { period: "2024-12", score: 8.2, responseRate: 94, participants: 89 }
    ]
  },
  {
    department: "원무과", 
    currentScore: 7.8,
    previousScore: 7.5,
    trend: "up",
    trendValue: 0.3,
    riskLevel: "low",
    monthlyData: [
      { period: "2024-09", score: 7.5, responseRate: 100, participants: 12 },
      { period: "2024-10", score: 7.6, responseRate: 100, participants: 12 },
      { period: "2024-11", score: 7.7, responseRate: 100, participants: 12 },
      { period: "2024-12", score: 7.8, responseRate: 100, participants: 12 }
    ]
  },
  {
    department: "물리치료실",
    currentScore: 9.1,
    previousScore: 9.0,
    trend: "up", 
    trendValue: 0.1,
    riskLevel: "low",
    monthlyData: [
      { period: "2024-09", score: 9.0, responseRate: 87, participants: 7 },
      { period: "2024-10", score: 9.0, responseRate: 87, participants: 7 },
      { period: "2024-11", score: 9.1, responseRate: 87, participants: 7 },
      { period: "2024-12", score: 9.1, responseRate: 87, participants: 7 }
    ]
  },
  {
    department: "진료지원부",
    currentScore: 6.8,
    previousScore: 7.2,
    trend: "down",
    trendValue: -0.4,
    riskLevel: "high",
    monthlyData: [
      { period: "2024-09", score: 7.2, responseRate: 86, participants: 13 },
      { period: "2024-10", score: 7.0, responseRate: 83, participants: 12 },
      { period: "2024-11", score: 6.9, responseRate: 80, participants: 12 },
      { period: "2024-12", score: 6.8, responseRate: 80, participants: 12 }
    ]
  },
  {
    department: "행정팀",
    currentScore: 7.9,
    previousScore: 7.2,
    trend: "up",
    trendValue: 0.7,
    riskLevel: "low", 
    monthlyData: [
      { period: "2024-09", score: 7.2, responseRate: 91, participants: 11 },
      { period: "2024-10", score: 7.4, responseRate: 91, participants: 11 },
      { period: "2024-11", score: 7.7, responseRate: 91, participants: 11 },
      { period: "2024-12", score: 7.9, responseRate: 91, participants: 11 }
    ]
  }
]

const mockCategoryTrends: CategoryTrend[] = [
  {
    category: "업무 환경",
    scores: [7.5, 7.6, 7.7, 7.8],
    periods: ["9월", "10월", "11월", "12월"],
    trend: "up",
    change: 0.3
  },
  {
    category: "소통 & 관계", 
    scores: [7.8, 8.0, 8.1, 8.1],
    periods: ["9월", "10월", "11월", "12월"],
    trend: "up",
    change: 0.3
  },
  {
    category: "성장 & 발전",
    scores: [7.3, 7.2, 7.1, 7.2],
    periods: ["9월", "10월", "11월", "12월"],
    trend: "stable",
    change: -0.1
  },
  {
    category: "복지 & 보상",
    scores: [6.7, 6.8, 6.9, 6.9],
    periods: ["9월", "10월", "11월", "12월"],
    trend: "up", 
    change: 0.2
  },
  {
    category: "조직문화",
    scores: [7.8, 7.9, 8.0, 8.0],
    periods: ["9월", "10월", "11월", "12월"],
    trend: "up",
    change: 0.2
  }
]

const Trends = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("last-6-months")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedView, setSelectedView] = useState("monthly")

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <ArrowUp className="w-4 h-4 text-green-600" />
      case "down":
        return <ArrowDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getRiskBadge = (riskLevel: "low" | "medium" | "high") => {
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

  const currentOverallScore = mockOverallTrend[mockOverallTrend.length - 1]?.score || 0
  const previousOverallScore = mockOverallTrend[mockOverallTrend.length - 2]?.score || 0
  const overallTrend = currentOverallScore > previousOverallScore ? "up" : 
                      currentOverallScore < previousOverallScore ? "down" : "stable"
  const overallChange = Number((currentOverallScore - previousOverallScore).toFixed(1))

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">만족도 트렌드</h1>
                <p className="text-gray-600">시간별 만족도 변화와 부서별 트렌드를 분석하세요</p>
              </div>
              
              <div className="flex gap-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-3-months">최근 3개월</SelectItem>
                    <SelectItem value="last-6-months">최근 6개월</SelectItem>
                    <SelectItem value="last-12-months">최근 12개월</SelectItem>
                    <SelectItem value="this-year">올해</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedView} onValueChange={setSelectedView}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">월별</SelectItem>
                    <SelectItem value="quarterly">분기별</SelectItem>
                    <SelectItem value="yearly">연도별</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  리포트
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">현재 만족도</p>
                      <p className={`text-3xl font-bold ${getScoreColor(currentOverallScore)}`}>
                        {currentOverallScore}
                      </p>
                      <div className="flex items-center mt-1">
                        {getTrendIcon(overallTrend)}
                        <span className={`text-sm ml-1 ${
                          overallTrend === 'up' ? 'text-green-600' : 
                          overallTrend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {overallTrend === 'up' ? '+' : ''}{overallChange} vs 이전달
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">최고 부서</p>
                      <p className="text-2xl font-bold text-green-600">물리치료실</p>
                      <p className="text-sm text-green-600 mt-1">9.1점</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">주의 부서</p>
                      <p className="text-2xl font-bold text-red-600">진료지원부</p>
                      <p className="text-sm text-red-600 mt-1">6.8점 (-0.4)</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-full">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">개선 영역</p>
                      <p className="text-2xl font-bold text-orange-600">복지&보상</p>
                      <p className="text-sm text-orange-600 mt-1">6.9점</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Zap className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">전체 트렌드</TabsTrigger>
                <TabsTrigger value="departments">부서별 분석</TabsTrigger>
                <TabsTrigger value="categories">영역별 분석</TabsTrigger>
                <TabsTrigger value="insights">인사이트</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-primary" />
                      전체 만족도 트렌드
                    </CardTitle>
                    <CardDescription>
                      시간에 따른 전체 만족도 변화 추이
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Simulated Chart Area */}
                    <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 flex items-center justify-center border">
                      <div className="text-center">
                        <LineChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">만족도 트렌드 차트</p>
                        <div className="flex justify-center gap-8 mt-6">
                          {mockOverallTrend.slice(-6).map((data, index) => (
                            <div key={index} className="text-center">
                              <div 
                                className="w-4 bg-blue-500 rounded-t mb-2 mx-auto"
                                style={{ height: `${data.score * 8}px` }}
                              ></div>
                              <p className="text-xs text-gray-600">{data.period.split('-')[1]}월</p>
                              <p className="text-xs font-medium">{data.score}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">평균 점수</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {(mockOverallTrend.reduce((sum, data) => sum + data.score, 0) / mockOverallTrend.length).toFixed(1)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">최고 점수</p>
                        <p className="text-2xl font-bold text-green-600">
                          {Math.max(...mockOverallTrend.map(d => d.score)).toFixed(1)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm text-gray-600">최저 점수</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {Math.min(...mockOverallTrend.map(d => d.score)).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="departments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      부서별 만족도 트렌드
                    </CardTitle>
                    <CardDescription>
                      각 부서의 만족도 변화와 리스크 레벨
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockDepartmentTrends.map((dept, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-4">
                              <div>
                                <h4 className="font-semibold text-lg">{dept.department}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  {getRiskBadge(dept.riskLevel)}
                                  <div className="flex items-center gap-1">
                                    {getTrendIcon(dept.trend)}
                                    <span className={`text-sm ${
                                      dept.trend === 'up' ? 'text-green-600' : 
                                      dept.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                                    }`}>
                                      {dept.trend === 'up' ? '+' : dept.trend === 'down' ? '' : '±'}{dept.trendValue}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-sm text-gray-600">이전달</p>
                                <p className="text-lg font-medium text-gray-700">{dept.previousScore}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">현재</p>
                                <p className={`text-2xl font-bold ${getScoreColor(dept.currentScore)}`}>
                                  {dept.currentScore}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Mini Chart */}
                          <div className="flex items-end justify-between h-16 mt-4 px-4">
                            {dept.monthlyData.map((data, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-1">
                                <div 
                                  className={`w-8 rounded-t transition-all ${
                                    dept.trend === 'up' ? 'bg-green-400' :
                                    dept.trend === 'down' ? 'bg-red-400' : 'bg-gray-400'
                                  }`}
                                  style={{ height: `${data.score * 6}px` }}
                                ></div>
                                <span className="text-xs text-gray-500">{data.period.split('-')[1]}월</span>
                              </div>
                            ))}
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
                      <TrendingUp className="w-5 h-5 text-primary" />
                      영역별 만족도 트렌드
                    </CardTitle>
                    <CardDescription>
                      각 만족도 영역별 시간에 따른 변화
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {mockCategoryTrends.map((category, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold">{category.category}</h4>
                            <div className="flex items-center gap-2">
                              {getTrendIcon(category.trend)}
                              <span className={`text-sm font-medium ${
                                category.trend === 'up' ? 'text-green-600' : 
                                category.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {category.change > 0 ? '+' : ''}{category.change}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-end justify-between h-20 mb-3">
                            {category.scores.map((score, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-1">
                                <div 
                                  className={`w-6 rounded-t ${
                                    category.trend === 'up' ? 'bg-green-400' :
                                    category.trend === 'down' ? 'bg-red-400' : 'bg-gray-400'
                                  }`}
                                  style={{ height: `${score * 8}px` }}
                                ></div>
                                <span className="text-xs text-gray-500">{category.periods[idx]}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">현재 점수</span>
                            <span className={`font-semibold ${getScoreColor(category.scores[category.scores.length - 1])}`}>
                              {category.scores[category.scores.length - 1]}
                            </span>
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
                        <TrendingUp className="w-5 h-5" />
                        긍정적 트렌드
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">전체 만족도 상승</h4>
                        <p className="text-sm text-green-700">
                          12개월 연속 상승세를 보이며 8.0점 달성. 목표치인 7.5점을 크게 상회
                        </p>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">행정팀 대폭 개선</h4>
                        <p className="text-sm text-green-700">
                          최근 4개월간 0.7점 상승으로 가장 큰 개선폭을 보임
                        </p>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">물리치료실 우수 유지</h4>
                        <p className="text-sm text-green-700">
                          지속적으로 9.0점 이상을 유지하며 벤치마크 부서로 자리매김
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        주의 필요 영역
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-red-50 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-2">진료지원부 만족도 하락</h4>
                        <p className="text-sm text-red-700">
                          4개월 연속 하락하여 6.8점 기록. 즉시 원인 분석 및 대책 필요
                        </p>
                      </div>
                      
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h4 className="font-medium text-orange-800 mb-2">복지&보상 영역 저조</h4>
                        <p className="text-sm text-orange-700">
                          전 영역 중 가장 낮은 6.9점. 복지 제도 개선 검토 필요
                        </p>
                      </div>
                      
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">성장&발전 정체</h4>
                        <p className="text-sm text-yellow-700">
                          교육 프로그램 효과성 재검토 및 개인 성장 지원 강화 필요
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      예측 및 권장사항
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                        <h4 className="font-medium text-blue-800 mb-2">단기 예측 (1-3개월)</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• 전체 만족도 8.1-8.2점 예상</li>
                          <li>• 진료지원부 추가 하락 우려</li>
                          <li>• 간호부 안정적 유지 전망</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 border-l-4 border-green-500 bg-green-50">
                        <h4 className="font-medium text-green-800 mb-2">개선 액션</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• 진료지원부 긴급 면담 실시</li>
                          <li>• 복지 제도 개선 TF 구성</li>
                          <li>• 우수 부서 사례 공유</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                        <h4 className="font-medium text-purple-800 mb-2">장기 목표</h4>
                        <ul className="text-sm text-purple-700 space-y-1">
                          <li>• 2025년 전체 8.5점 달성</li>
                          <li>• 모든 부서 7.5점 이상 유지</li>
                          <li>• 만족도 편차 1.0점 이내</li>
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

export default Trends