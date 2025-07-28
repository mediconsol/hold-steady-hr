import { useState } from "react"
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Copy, 
  Trash2, 
  Play, 
  Pause, 
  BarChart3,
  Users,
  Calendar,
  ClipboardList,
  Eye,
  TrendingUp,
  MessageSquare,
  Target,
  CheckCircle,
  Clock,
  Share2,
  Download,
  Settings
} from "lucide-react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import AIAssistant from "@/components/AIAssistant"
import Footer from "@/components/layout/Footer"

interface SurveyQuestion {
  id: string
  question: string
  type: "scale" | "multiple" | "text"
  required: boolean
  options?: string[]
}

interface SurveyResponse {
  id: string
  respondentName: string
  department: string
  submittedAt: string
  answers: Record<string, any>
  completionRate: number
}

interface Survey {
  id: string
  title: string
  description: string
  status: "draft" | "active" | "completed" | "paused"
  totalQuestions: number
  responses: number
  targetAudience: string
  createdAt: string
  endDate: string
  questions: SurveyQuestion[]
  responseDetails: SurveyResponse[]
  averageScore?: number
  completionRate: number
  departmentBreakdown: Record<string, number>
}

const mockSurveys: Survey[] = [
  {
    id: "1",
    title: "2024년 4분기 직원 만족도 조사",
    description: "병원 전체 직원을 대상으로 한 포괄적인 만족도 조사입니다.",
    status: "active",
    totalQuestions: 15,
    responses: 89,
    targetAudience: "전체 직원",
    createdAt: "2024-10-01",
    endDate: "2024-12-31",
    averageScore: 7.8,
    completionRate: 89,
    departmentBreakdown: {
      "간호부": 42,
      "원무과": 12,
      "물리치료실": 8,
      "진료지원부": 15,
      "행정팀": 12
    },
    questions: [
      { id: "q1", question: "업무 환경에 대해 만족하십니까?", type: "scale", required: true },
      { id: "q2", question: "상급자와의 소통은 원활합니까?", type: "scale", required: true },
      { id: "q3", question: "업무량이 적절하다고 생각하십니까?", type: "scale", required: true },
      { id: "q4", question: "교육 기회가 충분히 제공되고 있습니까?", type: "scale", required: true },
      { id: "q5", question: "개선이 필요한 사항을 자유롭게 작성해주세요", type: "text", required: false }
    ],
    responseDetails: [
      { id: "r1", respondentName: "김간호사", department: "간호부", submittedAt: "2024-11-20", answers: {}, completionRate: 100 },
      { id: "r2", respondentName: "이원무", department: "원무과", submittedAt: "2024-11-19", answers: {}, completionRate: 100 },
      { id: "r3", respondentName: "박치료사", department: "물리치료실", submittedAt: "2024-11-18", answers: {}, completionRate: 80 }
    ]
  },
  {
    id: "2", 
    title: "간호부 업무환경 개선 설문",
    description: "간호부 직원들의 업무환경과 복지 개선 방안을 위한 설문조사입니다.",
    status: "completed",
    totalQuestions: 12,
    responses: 95,
    targetAudience: "간호부",
    createdAt: "2024-09-15",
    endDate: "2024-10-15",
    averageScore: 8.2,
    completionRate: 100,
    departmentBreakdown: { "간호부": 95 },
    questions: [
      { id: "q1", question: "근무 환경이 쾌적합니까?", type: "scale", required: true },
      { id: "q2", question: "동료들과의 협업이 원활합니까?", type: "scale", required: true },
      { id: "q3", question: "업무 도구가 충분히 제공됩니까?", type: "scale", required: true }
    ],
    responseDetails: [
      { id: "r1", respondentName: "김간호사", department: "간호부", submittedAt: "2024-10-10", answers: {}, completionRate: 100 }
    ]
  },
  {
    id: "3",
    title: "신입직원 온보딩 만족도",
    description: "최근 3개월 내 입사한 신입직원들의 온보딩 프로세스 평가",
    status: "draft",
    totalQuestions: 8,
    responses: 0,
    targetAudience: "신입직원",
    createdAt: "2024-11-20",
    endDate: "2024-12-20",
    completionRate: 0,
    departmentBreakdown: {},
    questions: [
      { id: "q1", question: "온보딩 과정이 도움이 되었습니까?", type: "scale", required: true },
      { id: "q2", question: "멘토 제도에 만족하십니까?", type: "scale", required: true }
    ],
    responseDetails: []
  },
  {
    id: "4",
    title: "원무과 업무 프로세스 개선",
    description: "원무과 업무 효율성과 환자 서비스 개선을 위한 설문",
    status: "paused",
    totalQuestions: 10,
    responses: 7,
    targetAudience: "원무과",
    createdAt: "2024-11-10",
    endDate: "2024-11-30",
    averageScore: 7.5,
    completionRate: 58,
    departmentBreakdown: { "원무과": 7 },
    questions: [
      { id: "q1", question: "현재 업무 프로세스가 효율적입니까?", type: "scale", required: true },
      { id: "q2", question: "시스템 사용에 어려움이 있습니까?", type: "scale", required: true }
    ],
    responseDetails: [
      { id: "r1", respondentName: "이원무", department: "원무과", submittedAt: "2024-11-15", answers: {}, completionRate: 100 }
    ]
  }
]

const getStatusBadge = (status: Survey["status"]) => {
  const statusConfig = {
    draft: { label: "초안", color: "bg-gray-100 text-gray-800" },
    active: { label: "진행중", color: "bg-green-100 text-green-800" },
    completed: { label: "완료", color: "bg-blue-100 text-blue-800" },
    paused: { label: "일시정지", color: "bg-yellow-100 text-yellow-800" }
  }
  
  const config = statusConfig[status]
  return <Badge className={`${config.color} border-0`}>{config.label}</Badge>
}

const Surveys = () => {
  const [surveys, setSurveys] = useState<Survey[]>(mockSurveys)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null)
  const [newSurvey, setNewSurvey] = useState({
    title: "",
    description: "",
    targetAudience: "",
    questions: [] as SurveyQuestion[]
  })

  const filteredSurveys = surveys.filter(survey =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.targetAudience.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateSurvey = () => {
    if (newSurvey.title.trim()) {
      const survey: Survey = {
        id: Date.now().toString(),
        title: newSurvey.title,
        description: newSurvey.description,
        status: "draft",
        totalQuestions: newSurvey.questions.length,
        responses: 0,
        targetAudience: newSurvey.targetAudience,
        createdAt: new Date().toISOString().split('T')[0],
        endDate: "",
        questions: newSurvey.questions,
        responseDetails: [],
        completionRate: 0,
        departmentBreakdown: {}
      }
      
      setSurveys([survey, ...surveys])
      setNewSurvey({ title: "", description: "", targetAudience: "", questions: [] })
      setIsCreateModalOpen(false)
    }
  }

  const handleAIQuestionsGenerated = (questions: SurveyQuestion[]) => {
    setNewSurvey({...newSurvey, questions})
  }

  const handleDeleteSurvey = (id: string) => {
    setSurveys(surveys.filter(s => s.id !== id))
  }

  const handleStatusChange = (id: string, newStatus: Survey["status"]) => {
    setSurveys(surveys.map(s => 
      s.id === id ? { ...s, status: newStatus } : s
    ))
  }

  const handleSurveyClick = (survey: Survey) => {
    setSelectedSurvey(survey)
    setIsDetailModalOpen(true)
  }

  const getQuestionTypeLabel = (type: SurveyQuestion["type"]) => {
    const typeLabels = {
      scale: "점수형",
      multiple: "객관식",
      text: "주관식"
    }
    return typeLabels[type]
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">설문 관리</h1>
                <p className="text-gray-600">직원 만족도 조사와 설문을 생성하고 관리하세요</p>
              </div>
              
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    AI와 함께 설문 만들기
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>새 설문 만들기</DialogTitle>
                  </DialogHeader>
                  
                  <Tabs defaultValue="basic" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">기본 정보</TabsTrigger>
                      <TabsTrigger value="questions">질문 설정</TabsTrigger>
                      <TabsTrigger value="preview">미리보기</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div>
                        <Label htmlFor="title">설문 제목</Label>
                        <Input
                          id="title"
                          value={newSurvey.title}
                          onChange={(e) => setNewSurvey({...newSurvey, title: e.target.value})}
                          placeholder="설문 제목을 입력하세요"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">설문 설명</Label>
                        <Textarea
                          id="description"
                          value={newSurvey.description}
                          onChange={(e) => setNewSurvey({...newSurvey, description: e.target.value})}
                          placeholder="설문에 대한 간단한 설명을 입력하세요"
                        />
                      </div>
                      <div>
                        <Label htmlFor="audience">대상</Label>
                        <Input
                          id="audience"
                          value={newSurvey.targetAudience}
                          onChange={(e) => setNewSurvey({...newSurvey, targetAudience: e.target.value})}
                          placeholder="예: 전체 직원, 간호부, 원무과"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="questions" className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">설문 질문</h3>
                        <AIAssistant onQuestionsGenerated={handleAIQuestionsGenerated} />
                      </div>
                      
                      {newSurvey.questions.length > 0 ? (
                        <div className="space-y-4">
                          {newSurvey.questions.map((question, index) => (
                            <Card key={question.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline">Q{index + 1}</Badge>
                                      <Badge className={
                                        question.type === 'scale' ? 'bg-blue-100 text-blue-800' :
                                        question.type === 'multiple' ? 'bg-green-100 text-green-800' :
                                        'bg-purple-100 text-purple-800'
                                      }>
                                        {question.type === 'scale' ? '점수형' :
                                         question.type === 'multiple' ? '객관식' : '주관식'}
                                      </Badge>
                                      {question.required && (
                                        <Badge className="bg-red-100 text-red-800">필수</Badge>
                                      )}
                                    </div>
                                    <p className="text-gray-900 font-medium">{question.question}</p>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      const updatedQuestions = newSurvey.questions.filter((_, i) => i !== index)
                                      setNewSurvey({...newSurvey, questions: updatedQuestions})
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>

                                {question.type === "scale" && (
                                  <div className="flex gap-2 mt-3">
                                    {[1, 2, 3, 4, 5].map((score) => (
                                      <div key={score} className="w-8 h-8 border-2 border-gray-200 rounded-full flex items-center justify-center text-sm">
                                        {score}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {question.options && (
                                  <div className="mt-3 space-y-2">
                                    {question.options.map((option, idx) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        <div className="w-4 h-4 border border-gray-300 rounded"></div>
                                        <span className="text-sm">{option}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">질문이 없습니다</h3>
                          <p className="text-gray-600 mb-4">AI 도우미와 함께 전문적인 질문을 생성해보세요</p>
                          <AIAssistant onQuestionsGenerated={handleAIQuestionsGenerated} />
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="preview" className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-2">{newSurvey.title || "설문 제목"}</h3>
                        <p className="text-gray-600 mb-4">{newSurvey.description || "설문 설명이 없습니다."}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                          <span>대상: {newSurvey.targetAudience || "미지정"}</span>
                          <span>질문 수: {newSurvey.questions.length}개</span>
                        </div>
                        
                        {newSurvey.questions.length > 0 && (
                          <div className="space-y-4">
                            {newSurvey.questions.map((question, index) => (
                              <div key={question.id} className="bg-white p-4 rounded-lg border">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">Q{index + 1}.</span>
                                  <span className="text-sm text-gray-500">
                                    ({question.type === 'scale' ? '점수형' :
                                      question.type === 'multiple' ? '객관식' : '주관식'})
                                  </span>
                                  {question.required && (
                                    <span className="text-red-500 text-sm">*</span>
                                  )}
                                </div>
                                <p className="font-medium mb-3">{question.question}</p>
                                
                                {question.type === "scale" && (
                                  <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((score) => (
                                      <div key={score} className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-sm">
                                        {score}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {question.options && (
                                  <div className="space-y-2">
                                    {question.options.map((option, idx) => (
                                      <label key={idx} className="flex items-center gap-2">
                                        <input type="radio" name={`question_${question.id}`} className="w-4 h-4" />
                                        <span>{option}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}

                                {question.type === "text" && (
                                  <textarea className="w-full p-2 border border-gray-300 rounded" rows={3} placeholder="답변을 입력하세요..." disabled />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        onClick={handleCreateSurvey} 
                        className="w-full" 
                        disabled={!newSurvey.title.trim() || newSurvey.questions.length === 0}
                      >
                        설문 생성하기
                      </Button>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="설문 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="lg:col-span-3 grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Play className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">진행중</p>
                        <p className="text-xl font-bold">{surveys.filter(s => s.status === 'active').length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">완료</p>
                        <p className="text-xl font-bold">{surveys.filter(s => s.status === 'completed').length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Users className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">총 응답</p>
                        <p className="text-xl font-bold">{surveys.reduce((acc, s) => acc + s.responses, 0)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Surveys List */}
            <div className="grid gap-4">
              {filteredSurveys.map((survey) => (
                <Card key={survey.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSurveyClick(survey)}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <ClipboardList className="w-5 h-5 text-primary" />
                          <CardTitle className="text-lg">{survey.title}</CardTitle>
                          {getStatusBadge(survey.status)}
                        </div>
                        <CardDescription className="mb-3">
                          {survey.description}
                        </CardDescription>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {survey.targetAudience}
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            {survey.totalQuestions}개 문항
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {survey.responses}명 응답
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {survey.createdAt}
                          </span>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Eye className="w-4 h-4 mr-2" />
                            상세보기
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); alert('기능구현중'); }}>
                            <Edit className="w-4 h-4 mr-2" />
                            편집
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); alert('기능구현중'); }}>
                            <Copy className="w-4 h-4 mr-2" />
                            복사
                          </DropdownMenuItem>
                          {survey.status === 'active' ? (
                            <DropdownMenuItem onClick={() => handleStatusChange(survey.id, 'paused')}>
                              <Pause className="w-4 h-4 mr-2" />
                              일시정지
                            </DropdownMenuItem>
                          ) : survey.status === 'paused' ? (
                            <DropdownMenuItem onClick={() => handleStatusChange(survey.id, 'active')}>
                              <Play className="w-4 h-4 mr-2" />
                              재시작
                            </DropdownMenuItem>
                          ) : survey.status === 'draft' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(survey.id, 'active')}>
                              <Play className="w-4 h-4 mr-2" />
                              시작
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => handleDeleteSurvey(survey.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {filteredSurveys.length === 0 && (
              <div className="text-center py-12">
                <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">설문이 없습니다</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? "검색 조건에 맞는 설문이 없습니다." : "첫 번째 설문을 만들어보세요."}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    AI와 함께 설문 만들기
                  </Button>
                )}
              </div>
            )}

            {/* Survey Detail Modal */}
            {selectedSurvey && (
              <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <ClipboardList className="w-6 h-6 text-primary" />
                      {selectedSurvey.title}
                      {getStatusBadge(selectedSurvey.status)}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">개요</TabsTrigger>
                      <TabsTrigger value="questions">질문</TabsTrigger>
                      <TabsTrigger value="responses">응답</TabsTrigger>
                      <TabsTrigger value="analytics">분석</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>설문 정보</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">설명</Label>
                              <p className="mt-1 text-gray-900">{selectedSurvey.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-600">대상</Label>
                                <p className="mt-1 font-medium">{selectedSurvey.targetAudience}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">질문 수</Label>
                                <p className="mt-1 font-medium">{selectedSurvey.totalQuestions}개</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">생성일</Label>
                                <p className="mt-1 font-medium">{selectedSurvey.createdAt}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">마감일</Label>
                                <p className="mt-1 font-medium">{selectedSurvey.endDate}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>응답 현황</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">응답률</span>
                                <span className="font-semibold">{selectedSurvey.completionRate}%</span>
                              </div>
                              <Progress value={selectedSurvey.completionRate} className="h-3" />
                              
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">총 응답 수</span>
                                <span className="font-semibold">{selectedSurvey.responses}명</span>
                              </div>
                              
                              {selectedSurvey.averageScore && (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">평균 점수</span>
                                  <span className="font-semibold text-blue-600">{selectedSurvey.averageScore}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>부서별 참여 현황</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {Object.entries(selectedSurvey.departmentBreakdown).map(([dept, count]) => (
                              <div key={dept} className="flex items-center justify-between">
                                <span className="text-sm font-medium">{dept}</span>
                                <div className="flex items-center gap-3">
                                  <Progress value={(count / selectedSurvey.responses) * 100} className="w-24 h-2" />
                                  <span className="text-sm text-gray-600 w-8">{count}명</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="questions" className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">설문 질문 ({selectedSurvey.questions.length}개)</h3>
                        <Button variant="outline" onClick={() => alert('기능구현중')}>
                          <Edit className="w-4 h-4 mr-2" />
                          질문 편집
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {selectedSurvey.questions.map((question, index) => (
                          <Card key={question.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline">Q{index + 1}</Badge>
                                    <Badge variant="secondary">{getQuestionTypeLabel(question.type)}</Badge>
                                    {question.required && (
                                      <Badge className="bg-red-100 text-red-800">필수</Badge>
                                    )}
                                  </div>
                                  <p className="text-gray-900 font-medium">{question.question}</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => alert('기능구현중')}>
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              {question.type === "scale" && (
                                <div className="flex gap-2 mt-3">
                                  {[1, 2, 3, 4, 5].map((score) => (
                                    <div key={score} className="w-8 h-8 border-2 border-gray-200 rounded-full flex items-center justify-center text-sm">
                                      {score}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {question.options && (
                                <div className="mt-3 space-y-2">
                                  {question.options.map((option, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                      <div className="w-4 h-4 border border-gray-300 rounded"></div>
                                      <span className="text-sm">{option}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="responses" className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">응답 목록 ({selectedSurvey.responseDetails.length}개)</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => alert('기능구현중')}>
                            <Download className="w-4 h-4 mr-2" />
                            내보내기
                          </Button>
                          <Button variant="outline" onClick={() => alert('기능구현중')}>
                            <Share2 className="w-4 h-4 mr-2" />
                            공유
                          </Button>
                        </div>
                      </div>
                      
                      {selectedSurvey.responseDetails.length > 0 ? (
                        <div className="space-y-3">
                          {selectedSurvey.responseDetails.map((response) => (
                            <Card key={response.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                        {response.respondentName.slice(0, 2)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{response.respondentName}</p>
                                      <p className="text-sm text-gray-600">{response.department}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-4">
                                    <div className="text-right">
                                      <p className="text-sm text-gray-600">완료율</p>
                                      <p className="font-medium">{response.completionRate}%</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm text-gray-600">제출일</p>
                                      <p className="font-medium">{response.submittedAt}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => alert('기능구현중')}>
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">아직 응답이 없습니다</h3>
                          <p className="text-gray-600">설문이 시작되면 응답이 여기에 표시됩니다.</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <BarChart3 className="w-5 h-5 text-primary" />
                              응답 트렌드
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">응답 트렌드 차트</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Target className="w-5 h-5 text-primary" />
                              만족도 분포
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-48 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">만족도 분포 차트</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>주요 인사이트</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <h4 className="font-medium text-green-800">높은 참여율</h4>
                              </div>
                              <p className="text-sm text-green-700">
                                목표 응답률 80%를 넘어 {selectedSurvey.completionRate}% 달성
                              </p>
                            </div>
                            
                            {selectedSurvey.averageScore && selectedSurvey.averageScore >= 8 && (
                              <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <TrendingUp className="w-5 h-5 text-blue-600" />
                                  <h4 className="font-medium text-blue-800">우수한 점수</h4>
                                </div>
                                <p className="text-sm text-blue-700">
                                  평균 {selectedSurvey.averageScore}점으로 높은 만족도
                                </p>
                              </div>
                            )}
                            
                            <div className="p-4 bg-purple-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-purple-600" />
                                <h4 className="font-medium text-purple-800">진행 상황</h4>
                              </div>
                              <p className="text-sm text-purple-700">
                                {selectedSurvey.status === 'active' ? '현재 진행 중' : 
                                 selectedSurvey.status === 'completed' ? '완료됨' : 
                                 selectedSurvey.status === 'paused' ? '일시 정지됨' : '초안 상태'}
                              </p>
                            </div>
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

export default Surveys