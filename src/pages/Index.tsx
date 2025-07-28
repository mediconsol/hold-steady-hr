import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Activity, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Heart,
  BarChart3,
  PlayCircle
} from "lucide-react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Header } from "@/components/layout/Header"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import heroImage from "@/assets/hero-medical.jpg"
import { SurveyModal } from "@/components/SurveyModal"
import Footer from "@/components/layout/Footer"
import DemoNotice from "@/components/DemoNotice"
import ContactModal from "@/components/ContactModal"

const Index = () => {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <Header />
          
          {/* Main Content */}
          <main className="flex-1 p-6 space-y-6 animate-fade-in">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-primary text-primary-foreground shadow-elevated">
              <div className="absolute inset-0 bg-black/20"></div>
              <img 
                src={heroImage} 
                alt="Medical Dashboard" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
              />
              <div className="relative p-8 lg:p-12">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-8 h-8" />
                    <h1 className="text-3xl lg:text-4xl font-bold">메디HR+</h1>
                  </div>
                  <p className="text-lg lg:text-xl text-primary-foreground/90 mb-6">
                    직원 만족도 조사와 데이터 분석을 통한 조직문화 개선 솔루션
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="secondary" size="lg" className="shadow-card" onClick={() => navigate('/surveys')}>
                      AI와 함께 설문 만들기
                    </Button>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white border-0 shadow-lg hover:shadow-2xl transform hover:scale-102 transition-all duration-500 ease-in-out hover:brightness-110 font-semibold relative overflow-hidden group"
                      onClick={() => setIsSurveyOpen(true)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-amber-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                      <PlayCircle className="w-5 h-5 mr-2 transition-transform duration-700 group-hover:rotate-12" />
                      설문 체험하기
                    </Button>
                    <ContactModal />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="전체 만족도"
                value="7.8/10"
                description="지난달 대비"
                icon={Heart}
                trend={{ value: 5.2, isPositive: true }}
                variant="success"
              />
              <StatsCard
                title="활성 직원"
                value="142명"
                description="총 직원 수"
                icon={Users}
                trend={{ value: 2.1, isPositive: true }}
                variant="default"
              />
              <StatsCard
                title="이직 리스크"
                value="12%"
                description="주의 필요"
                icon={AlertTriangle}
                trend={{ value: 1.8, isPositive: false }}
                variant="warning"
              />
              <StatsCard
                title="응답률"
                value="89%"
                description="이번 분기"
                icon={TrendingUp}
                trend={{ value: 12.5, isPositive: true }}
                variant="success"
              />
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Surveys */}
              <Card className="shadow-card hover:shadow-elevated transition-smooth">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    최근 설문 조사
                  </CardTitle>
                  <CardDescription>
                    진행 중인 설문과 최근 결과를 확인하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { dept: "간호부", status: "진행중", responses: "89/95" },
                      { dept: "원무과", status: "완료", responses: "12/12" },
                      { dept: "물리치료실", status: "대기", responses: "0/8" },
                    ].map((survey, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div>
                          <p className="font-medium">{survey.dept} 만족도 조사</p>
                          <p className="text-sm text-muted-foreground">응답: {survey.responses}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          survey.status === '진행중' ? 'bg-primary/10 text-primary' :
                          survey.status === '완료' ? 'bg-success/10 text-success' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {survey.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/surveys')}>
                    모든 설문 보기
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-card hover:shadow-elevated transition-smooth">
                <CardHeader>
                  <CardTitle>빠른 실행</CardTitle>
                  <CardDescription>
                    자주 사용하는 기능에 빠르게 접근하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="dashboard" className="h-20 flex-col gap-2" onClick={() => navigate('/employees')}>
                      <Users className="w-6 h-6" />
                      <span className="text-sm">직원 관리</span>
                    </Button>
                    <Button variant="dashboard" className="h-20 flex-col gap-2" onClick={() => navigate('/surveys')}>
                      <BarChart3 className="w-6 h-6" />
                      <span className="text-sm">설문 관리</span>
                    </Button>
                    <Button variant="dashboard" className="h-20 flex-col gap-2" onClick={() => navigate('/reports')}>
                      <TrendingUp className="w-6 h-6" />
                      <span className="text-sm">리포트 분석</span>
                    </Button>
                    <Button variant="dashboard" className="h-20 flex-col gap-2" onClick={() => alert('기능구현중')}>
                      <AlertTriangle className="w-6 h-6" />
                      <span className="text-sm">알림 설정</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Department Overview */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>부서별 만족도 현황</CardTitle>
                <CardDescription>
                  각 부서의 최신 만족도 점수와 트렌드를 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "간호부", score: 8.2, trend: "up", staff: 95 },
                    { name: "원무과", score: 7.5, trend: "up", staff: 12 },
                    { name: "물리치료실", score: 9.1, trend: "up", staff: 8 },
                    { name: "진료지원부", score: 6.8, trend: "down", staff: 15 },
                    { name: "행정팀", score: 7.9, trend: "up", staff: 12 },
                  ].map((dept, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gradient-card border border-border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{dept.name}</h4>
                          <p className="text-sm text-muted-foreground">{dept.staff}명</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold">{dept.score}</p>
                          <p className="text-xs text-muted-foreground">만족도</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          dept.trend === 'up' ? 'bg-success' : 'bg-destructive'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Demo Notice Section - Only on main page */}
            <div className="mt-12">
              <DemoNotice />
            </div>

            {/* Footer */}
            <Footer />
          </main>
        </SidebarInset>
      </div>
      
      {/* Survey Modal */}
      <SurveyModal 
        isOpen={isSurveyOpen} 
        onClose={() => setIsSurveyOpen(false)} 
      />
    </SidebarProvider>
  );
};

export default Index;
