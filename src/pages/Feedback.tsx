import { useState } from "react"
import { 
  MessageSquare, 
  Send, 
  Filter, 
  Search,
  Calendar,
  User,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Star,
  Reply,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Lightbulb,
  Bug,
  Zap
} from "lucide-react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Footer from "@/components/layout/Footer"

interface Feedback {
  id: string
  title: string
  content: string
  category: "improvement" | "complaint" | "compliment" | "suggestion" | "bug"
  priority: "low" | "medium" | "high"
  status: "pending" | "in_progress" | "resolved" | "closed"
  author: string
  department: string
  createdAt: string
  updatedAt: string
  tags: string[]
  responses: FeedbackResponse[]
  likes: number
  isAnonymous: boolean
}

interface FeedbackResponse {
  id: string
  content: string
  author: string
  role: string
  createdAt: string
  isOfficial: boolean
}

const mockFeedbacks: Feedback[] = [
  {
    id: "1",
    title: "휴게실 환경 개선 요청",
    content: "직원 휴게실의 의자가 너무 낡아서 휴식 시 불편합니다. 새로운 의자로 교체해주시면 좋겠습니다. 또한 냉장고도 소음이 심해서 휴식에 방해가 됩니다.",
    category: "improvement",
    priority: "medium",
    status: "in_progress",
    author: "김간호사",
    department: "간호부",
    createdAt: "2024-11-20",
    updatedAt: "2024-11-22",
    tags: ["휴게실", "환경개선", "의자"],
    likes: 8,
    isAnonymous: false,
    responses: [
      {
        id: "r1",
        content: "소중한 의견 감사합니다. 휴게실 환경 개선에 대해 검토하겠습니다.",
        author: "박관리자",
        role: "시설관리팀",
        createdAt: "2024-11-21",
        isOfficial: true
      }
    ]
  },
  {
    id: "2", 
    title: "야간 근무 수당 문의",
    content: "야간 근무 수당 지급 기준이 명확하지 않습니다. 정확한 기준과 계산 방법을 공지해주시면 좋겠습니다.",
    category: "complaint",
    priority: "high",
    status: "pending",
    author: "익명",
    department: "간호부",
    createdAt: "2024-11-18",
    updatedAt: "2024-11-18",
    tags: ["수당", "야간근무", "급여"],
    likes: 12,
    isAnonymous: true,
    responses: []
  },
  {
    id: "3",
    title: "신규 교육 프로그램 칭찬",
    content: "최근 도입된 신규 직원 교육 프로그램이 정말 도움이 많이 되었습니다. 체계적이고 실무에 바로 적용할 수 있는 내용들이라 만족도가 높습니다.",
    category: "compliment", 
    priority: "low",
    status: "resolved",
    author: "이신입",
    department: "원무과",
    createdAt: "2024-11-15",
    updatedAt: "2024-11-16",
    tags: ["교육", "신규직원", "만족"],
    likes: 15,
    isAnonymous: false,
    responses: [
      {
        id: "r2",
        content: "긍정적인 피드백 감사합니다. 앞으로도 더 나은 교육 프로그램 개발에 노력하겠습니다.",
        author: "최교육팀장",
        role: "교육팀",
        createdAt: "2024-11-16",
        isOfficial: true
      }
    ]
  },
  {
    id: "4",
    title: "주차공간 부족 문제",
    content: "직원 주차공간이 부족해서 매일 주차 때문에 스트레스를 받고 있습니다. 근처 임대 주차장을 확보하거나 대안을 마련해주시면 좋겠습니다.",
    category: "suggestion",
    priority: "medium", 
    status: "pending",
    author: "정물리치료사",
    department: "물리치료실",
    createdAt: "2024-11-10",
    updatedAt: "2024-11-10",
    tags: ["주차", "공간", "불편"],
    likes: 20,
    isAnonymous: false,
    responses: []
  },
  {
    id: "5",
    title: "전자차트 시스템 오류",
    content: "전자차트 시스템에서 간헐적으로 저장이 되지 않는 문제가 발생합니다. 업무에 차질이 생기고 있어 빠른 수정이 필요합니다.",
    category: "bug",
    priority: "high",
    status: "in_progress",
    author: "송의사",
    department: "진료부",
    createdAt: "2024-11-08",
    updatedAt: "2024-11-12",
    tags: ["시스템", "오류", "전자차트"],
    likes: 5,
    isAnonymous: false,
    responses: [
      {
        id: "r3",
        content: "시스템 오류 신고 감사합니다. IT팀에서 긴급히 수정 작업을 진행하고 있습니다.",
        author: "김IT팀장",
        role: "IT팀",
        createdAt: "2024-11-09",
        isOfficial: true
      },
      {
        id: "r4", 
        content: "시스템 패치가 완료되었습니다. 문제가 지속되면 다시 신고해주세요.",
        author: "김IT팀장",
        role: "IT팀",
        createdAt: "2024-11-12",
        isOfficial: true
      }
    ]
  }
]

const getCategoryConfig = (category: Feedback["category"]) => {
  const configs = {
    improvement: { label: "개선제안", icon: Lightbulb, color: "bg-blue-100 text-blue-800" },
    complaint: { label: "불만사항", icon: AlertCircle, color: "bg-red-100 text-red-800" },
    compliment: { label: "칭찬", icon: Heart, color: "bg-green-100 text-green-800" },
    suggestion: { label: "건의사항", icon: MessageCircle, color: "bg-purple-100 text-purple-800" },
    bug: { label: "오류신고", icon: Bug, color: "bg-orange-100 text-orange-800" }
  }
  return configs[category]
}

const getStatusBadge = (status: Feedback["status"]) => {
  const statusConfig = {
    pending: { label: "대기중", color: "bg-gray-100 text-gray-800" },
    in_progress: { label: "처리중", color: "bg-yellow-100 text-yellow-800" },
    resolved: { label: "해결완료", color: "bg-green-100 text-green-800" },
    closed: { label: "종료", color: "bg-blue-100 text-blue-800" }
  }
  
  const config = statusConfig[status]
  return <Badge className={`${config.color} border-0`}>{config.label}</Badge>
}

const getPriorityBadge = (priority: Feedback["priority"]) => {
  const priorityConfig = {
    low: { label: "낮음", color: "bg-gray-100 text-gray-600" },
    medium: { label: "보통", color: "bg-yellow-100 text-yellow-700" },
    high: { label: "높음", color: "bg-red-100 text-red-700" }
  }
  
  const config = priorityConfig[priority]
  return <Badge variant="outline" className={`${config.color} border-0`}>{config.label}</Badge>
}

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(mockFeedbacks)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [newResponse, setNewResponse] = useState("")

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || feedback.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || feedback.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleFeedbackClick = (feedback: Feedback) => {
    setSelectedFeedback(feedback)
    setIsDetailOpen(true)
  }

  const handleAddResponse = () => {
    if (newResponse.trim() && selectedFeedback) {
      const response: FeedbackResponse = {
        id: Date.now().toString(),
        content: newResponse,
        author: "관리자",
        role: "시스템관리자",
        createdAt: new Date().toISOString().split('T')[0],
        isOfficial: true
      }
      
      const updatedFeedback = {
        ...selectedFeedback,
        responses: [...selectedFeedback.responses, response],
        status: selectedFeedback.status === 'pending' ? 'in_progress' as const : selectedFeedback.status
      }
      
      setFeedbacks(feedbacks.map(f => f.id === selectedFeedback.id ? updatedFeedback : f))
      setSelectedFeedback(updatedFeedback)
      setNewResponse("")
    }
  }

  const handleLike = (feedbackId: string) => {
    setFeedbacks(feedbacks.map(f => 
      f.id === feedbackId ? { ...f, likes: f.likes + 1 } : f
    ))
  }

  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter(f => f.status === 'pending').length,
    inProgress: feedbacks.filter(f => f.status === 'in_progress').length,
    resolved: feedbacks.filter(f => f.status === 'resolved').length
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">직원 피드백</h1>
                <p className="text-gray-600">직원들의 의견과 피드백을 관리하고 응답하세요</p>
              </div>
              
              <Button>
                <Send className="w-4 h-4 mr-2" />
                새 피드백 작성
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">전체 피드백</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Clock className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">대기중</p>
                      <p className="text-2xl font-bold text-gray-600">{stats.pending}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Zap className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">처리중</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">해결완료</p>
                      <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
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
                  placeholder="피드백 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 카테고리</SelectItem>
                  <SelectItem value="improvement">개선제안</SelectItem>
                  <SelectItem value="complaint">불만사항</SelectItem>
                  <SelectItem value="compliment">칭찬</SelectItem>
                  <SelectItem value="suggestion">건의사항</SelectItem>
                  <SelectItem value="bug">오류신고</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="pending">대기중</SelectItem>
                  <SelectItem value="in_progress">처리중</SelectItem>
                  <SelectItem value="resolved">해결완료</SelectItem>
                  <SelectItem value="closed">종료</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Feedback List */}
            <div className="grid gap-4">
              {filteredFeedbacks.map((feedback) => {
                const categoryConfig = getCategoryConfig(feedback.category)
                const CategoryIcon = categoryConfig.icon
                
                return (
                  <Card key={feedback.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleFeedbackClick(feedback)}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${categoryConfig.color.replace('text-', 'bg-').replace('800', '100')}`}>
                              <CategoryIcon className="w-4 h-4" />
                            </div>
                            <h3 className="font-semibold text-lg">{feedback.title}</h3>
                            <Badge className={`${categoryConfig.color} border-0`}>
                              {categoryConfig.label}
                            </Badge>
                            {getPriorityBadge(feedback.priority)}
                            {getStatusBadge(feedback.status)}
                          </div>
                          
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {feedback.content}
                          </p>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {feedback.isAnonymous ? "익명" : feedback.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {feedback.department}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {feedback.createdAt}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {feedback.responses.length}개 답변
                            </div>
                          </div>
                          
                          {feedback.tags.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {feedback.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleLike(feedback.id)
                            }}
                            className="flex items-center gap-1"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            {feedback.likes}
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Reply className="w-4 h-4 mr-2" />
                                답변하기
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Star className="w-4 h-4 mr-2" />
                                즐겨찾기
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredFeedbacks.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">피드백이 없습니다</h3>
                <p className="text-gray-600">
                  {searchTerm ? "검색 조건에 맞는 피드백이 없습니다." : "첫 번째 피드백을 작성해보세요."}
                </p>
              </div>
            )}

            {/* Feedback Detail Modal */}
            {selectedFeedback && (
              <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      {(() => {
                        const categoryConfig = getCategoryConfig(selectedFeedback.category)
                        const CategoryIcon = categoryConfig.icon
                        return (
                          <>
                            <div className={`p-2 rounded-lg ${categoryConfig.color.replace('text-', 'bg-').replace('800', '100')}`}>
                              <CategoryIcon className="w-5 h-5" />
                            </div>
                            {selectedFeedback.title}
                          </>
                        )
                      })()}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Feedback Header */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const categoryConfig = getCategoryConfig(selectedFeedback.category)
                            return <Badge className={`${categoryConfig.color} border-0`}>{categoryConfig.label}</Badge>
                          })()}
                          {getPriorityBadge(selectedFeedback.priority)}
                          {getStatusBadge(selectedFeedback.status)}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {selectedFeedback.isAnonymous ? "익명" : selectedFeedback.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {selectedFeedback.department}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {selectedFeedback.createdAt}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {selectedFeedback.likes}
                        </Button>
                      </div>
                    </div>

                    {/* Feedback Content */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 leading-relaxed">{selectedFeedback.content}</p>
                    </div>

                    {/* Tags */}
                    {selectedFeedback.tags.length > 0 && (
                      <div className="flex gap-2">
                        {selectedFeedback.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Responses */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        답변 ({selectedFeedback.responses.length})
                      </h4>
                      
                      {selectedFeedback.responses.map((response) => (
                        <div key={response.id} className={`p-4 rounded-lg border-l-4 ${response.isOfficial ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                  {response.author.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{response.author}</p>
                                <p className="text-sm text-gray-600">{response.role}</p>
                              </div>
                              {response.isOfficial && (
                                <Badge className="bg-blue-100 text-blue-800 border-0">공식답변</Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">{response.createdAt}</span>
                          </div>
                          <p className="text-gray-900">{response.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add Response */}
                    <div className="space-y-3">
                      <Label htmlFor="response">답변 작성</Label>
                      <Textarea
                        id="response"
                        placeholder="피드백에 대한 답변을 작성하세요..."
                        value={newResponse}
                        onChange={(e) => setNewResponse(e.target.value)}
                        rows={4}
                      />
                      <Button onClick={handleAddResponse} disabled={!newResponse.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        답변 등록
                      </Button>
                    </div>
                  </div>
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

export default Feedback