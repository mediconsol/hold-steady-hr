import { useState } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { 
  Bot, 
  Send, 
  Lightbulb,
  Loader2,
  Users,
  MessageSquare,
  Star,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const API_KEY = "AIzaSyB5WT1EgNn-1kAXft5uO6SWK5mjTyumztc"
const genAI = new GoogleGenerativeAI(API_KEY)

interface SurveyQuestion {
  id: string
  question: string
  type: "scale" | "multiple" | "text"
  required: boolean
  options?: string[]
}

interface AIAssistantProps {
  onQuestionsGenerated: (questions: SurveyQuestion[]) => void
}

const AIAssistant = ({ onQuestionsGenerated }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [generatedQuestions, setGeneratedQuestions] = useState<SurveyQuestion[]>([])
  const [activeTab, setActiveTab] = useState("generate")
  const [surveyContext, setSurveyContext] = useState({
    department: "",
    purpose: "",
    targetAudience: ""
  })

  const getDefaultQuestions = (templateType?: string) => {
    const baseQuestions = [
      {
        question: "현재 근무환경에 대해 얼마나 만족하고 계십니까?",
        type: "scale",
        required: true
      },
      {
        question: "상급자와의 소통이 원활하다고 생각하십니까?",
        type: "scale", 
        required: true
      },
      {
        question: "업무량이 적절하다고 생각하십니까?",
        type: "scale",
        required: true
      },
      {
        question: "동료들과의 협력관계는 어떻습니까?",
        type: "scale",
        required: true
      },
      {
        question: "개선이 필요한 사항이 있다면 자유롭게 작성해주세요.",
        type: "text",
        required: false
      }
    ];

    // 템플릿별 특화 질문들
    switch (templateType) {
      case "basic":
        return [
          ...baseQuestions,
          {
            question: "전반적으로 현재 직장에 만족하십니까?",
            type: "scale",
            required: true
          }
        ];
      case "environment":
        return [
          {
            question: "작업 공간이 쾌적하다고 생각하십니까?",
            type: "scale",
            required: true
          },
          {
            question: "의료장비와 도구가 충분히 제공되고 있습니까?",
            type: "scale",
            required: true
          },
          {
            question: "안전 관리 체계가 잘 갖춰져 있다고 생각하십니까?",
            type: "scale",
            required: true
          },
          {
            question: "휴게시설에 만족하십니까?",
            type: "scale",
            required: true
          },
          {
            question: "환경 개선이 필요한 사항을 작성해주세요.",
            type: "text",
            required: false
          }
        ];
      case "communication":
        return [
          {
            question: "상급자와의 소통이 원활합니까?",
            type: "scale",
            required: true
          },
          {
            question: "동료들과의 협력이 잘 이루어지고 있습니까?",
            type: "scale",
            required: true
          },
          {
            question: "부서 간 협조가 원활합니까?",
            type: "scale",
            required: true
          },
          {
            question: "건설적인 피드백을 받고 있습니까?",
            type: "scale",
            required: true
          },
          {
            question: "소통 개선 방안을 제안해주세요.",
            type: "text",
            required: false
          }
        ];
      case "welfare":
        return [
          {
            question: "현재 급여 수준에 만족하십니까?",
            type: "scale",
            required: true
          },
          {
            question: "복리후생 제도가 충분하다고 생각하십니까?",
            type: "scale",
            required: true
          },
          {
            question: "교육 및 연수 기회가 충분히 제공되고 있습니까?",
            type: "scale",
            required: true
          },
          {
            question: "휴가 제도에 만족하십니까?",
            type: "scale",
            required: true
          },
          {
            question: "복지 개선이 필요한 부분을 작성해주세요.",
            type: "text",
            required: false
          }
        ];
      default:
        return baseQuestions;
    }
  };

  const generateQuestions = async (customPrompt?: string, templateType?: string) => {
    setIsLoading(true)
    try {
      // API 키 확인
      if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
        throw new Error("API 키가 설정되지 않았습니다.");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      const promptText = customPrompt || `
        병원 HR 만족도 설문조사를 위한 질문을 생성해주세요.
        
        설문 맥락:
        - 부서: ${surveyContext.department || "전체"}
        - 목적: ${surveyContext.purpose || "직원 만족도 조사"}
        - 대상: ${surveyContext.targetAudience || "전체 직원"}
        - 사용자 요청: ${prompt}
        
        다음 형식의 JSON으로 5-6개의 질문을 생성해주세요:
        [
          {
            "question": "질문 내용",
            "type": "scale",
            "required": true
          }
        ]
        
        병원 환경에 맞는 실용적이고 구체적인 질문으로 만들어주세요.
        반드시 JSON 배열 형태로만 응답해주세요.
      `
      
      const result = await model.generateContent(promptText)
      const response = result.response.text()
      
      console.log("AI 응답:", response)
      
      // JSON 추출 및 파싱
      let questionsData;
      try {
        const jsonMatch = response.match(/\[[\s\S]*?\]/);
        if (jsonMatch) {
          questionsData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("JSON 형식을 찾을 수 없습니다.");
        }
      } catch (parseError) {
        console.log("JSON 파싱 실패, 기본 질문 사용:", parseError);
        questionsData = getDefaultQuestions(templateType);
      }
      
      const questions: SurveyQuestion[] = questionsData.map((q: any, index: number) => ({
        id: `ai_${Date.now()}_${index}`,
        question: q.question,
        type: q.type || "scale",
        required: q.required !== false,
        options: q.options
      }))
      
      setGeneratedQuestions(questions)
      setActiveTab("preview")
    } catch (error) {
      console.error("AI 질문 생성 실패:", error)
      console.log("기본 질문을 사용합니다.");
      
      // API 오류 시 기본 질문 사용
      const defaultQuestions = getDefaultQuestions(templateType);
      const questions: SurveyQuestion[] = defaultQuestions.map((q: any, index: number) => ({
        id: `default_${Date.now()}_${index}`,
        question: q.question,
        type: q.type || "scale",
        required: q.required !== false,
        options: q.options
      }))
      
      setGeneratedQuestions(questions)
      setActiveTab("preview")
    } finally {
      setIsLoading(false)
    }
  }

  const predefinedPrompts = [
    {
      title: "기본 만족도",
      description: "전반적인 직장 만족도 조사",
      icon: Users,
      templateType: "basic",
      prompt: `병원 직원들의 전반적인 직장 만족도를 측정하는 설문을 만들어주세요. 
      다음 영역을 포함한 5-6개의 질문을 생성해주세요:
      - 전반적인 직장 만족도 (scale)
      - 업무환경 만족도 (scale) 
      - 상급자와의 관계 (scale)
      - 동료와의 관계 (scale)
      - 성장 기회 (scale)
      - 개선사항 (text)
      
      모든 scale 질문은 1-5점 척도를 사용하고, 병원 환경에 맞는 구체적인 표현을 사용해주세요.`
    },
    {
      title: "업무환경",
      description: "근무조건 및 시설 평가",
      icon: Star,
      templateType: "environment",
      prompt: `병원 업무환경과 근무조건에 대한 구체적인 평가 설문을 만들어주세요.
      다음 영역을 포함한 5-6개의 질문을 생성해주세요:
      - 작업 공간의 쾌적함 (scale)
      - 의료장비 및 도구의 적절성 (scale)
      - 안전 관리 체계 (scale)
      - 휴게시설 만족도 (scale)
      - 근무 시간의 적절성 (scale)
      - 환경 개선 요청사항 (text)
      
      모든 질문은 병원의 특수한 업무환경을 고려하여 작성해주세요.`
    },
    {
      title: "소통관계",
      description: "팀워크 및 의사소통 평가",
      icon: MessageSquare,
      templateType: "communication",
      prompt: `병원 내 소통과 인간관계에 관한 설문을 만들어주세요.
      다음 영역을 포함한 5-6개의 질문을 생성해주세요:
      - 상급자와의 소통 원활성 (scale)
      - 동료 간 협력 정도 (scale)
      - 부서 간 협조 (scale)
      - 피드백 문화 (scale)
      - 갈등 해결 시스템 (scale)
      - 소통 개선 제안 (text)
      
      의료진 특성을 고려한 팀워크와 소통에 중점을 둔 질문들로 구성해주세요.`
    },
    {
      title: "복지보상",
      description: "급여 및 복리후생 만족도",
      icon: Lightbulb,
      templateType: "welfare",
      prompt: `병원 직원의 복지와 보상 체계에 대한 만족도 설문을 만들어주세요.
      다음 영역을 포함한 5-6개의 질문을 생성해주세요:
      - 급여 수준 만족도 (scale)
      - 복리후생 만족도 (scale)
      - 교육 지원 프로그램 (scale)
      - 휴가 제도 만족도 (scale)
      - 야간/특근 수당 적절성 (scale)
      - 복지 개선 요청사항 (text)
      
      의료진의 특수한 근무 형태(교대근무, 야간근무 등)를 고려한 질문들로 구성해주세요.`
    }
  ]

  const applyQuestions = () => {
    onQuestionsGenerated(generatedQuestions)
    setIsOpen(false)
    resetModal()
  }

  const resetModal = () => {
    setGeneratedQuestions([])
    setPrompt("")
    setActiveTab("generate")
    setSurveyContext({
      department: "",
      purpose: "",
      targetAudience: ""
    })
  }

  const handleModalClose = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      resetModal()
    }
  }

  const regenerateQuestion = async (index: number) => {
    setIsLoading(true)
    try {
      const currentQuestion = generatedQuestions[index]
      
      // 기본 대체 질문들
      const alternativeQuestions = [
        "현재 업무에 대해 얼마나 만족하고 계십니까?",
        "직장 내 인간관계는 만족스럽습니까?",
        "업무와 개인 생활의 균형은 어떻습니까?",
        "현재 조직의 분위기에 만족하십니까?",
        "직무에 대한 전반적인 만족도는 어떻습니까?"
      ]
      
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        
        const promptText = `
          다음 질문을 다시 작성해주세요:
          "${currentQuestion.question}"
          
          같은 의도를 가지지만 다른 표현으로, ${currentQuestion.type} 타입으로 병원 환경에 맞게 작성해주세요.
          JSON 형식으로 하나의 질문만 반환해주세요:
          {
            "question": "질문 내용",
            "type": "${currentQuestion.type}",
            "required": ${currentQuestion.required}
          }
        `
        
        const result = await model.generateContent(promptText)
        const response = result.response.text()
        
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const newQuestionData = JSON.parse(jsonMatch[0])
          const newQuestion: SurveyQuestion = {
            id: `ai_${Date.now()}_regenerated`,
            question: newQuestionData.question,
            type: newQuestionData.type,
            required: newQuestionData.required,
            options: newQuestionData.options
          }
          
          const updatedQuestions = [...generatedQuestions]
          updatedQuestions[index] = newQuestion
          setGeneratedQuestions(updatedQuestions)
        } else {
          throw new Error("JSON 파싱 실패")
        }
      } catch (apiError) {
        console.log("API 호출 실패, 대체 질문 사용:", apiError)
        
        // API 실패 시 대체 질문 사용
        const randomQuestion = alternativeQuestions[Math.floor(Math.random() * alternativeQuestions.length)]
        const newQuestion: SurveyQuestion = {
          id: `fallback_${Date.now()}_regenerated`,
          question: randomQuestion,
          type: currentQuestion.type,
          required: currentQuestion.required,
          options: currentQuestion.options
        }
        
        const updatedQuestions = [...generatedQuestions]
        updatedQuestions[index] = newQuestion
        setGeneratedQuestions(updatedQuestions)
      }
    } catch (error) {
      console.error("질문 재생성 실패:", error)
      alert("질문 재생성에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      scale: "점수형",
      multiple: "객관식", 
      text: "주관식"
    }
    return labels[type as keyof typeof labels] || type
  }

  const getTypeBadgeColor = (type: string) => {
    const colors = {
      scale: "bg-blue-100 text-blue-800",
      multiple: "bg-green-100 text-green-800",
      text: "bg-purple-100 text-purple-800"
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          <Bot className="w-4 h-4" />
          AI 도우미
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            AI 설문 도우미
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">질문 생성</TabsTrigger>
            <TabsTrigger value="preview" disabled={generatedQuestions.length === 0}>
              미리보기 ({generatedQuestions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            {/* 설문 맥락 설정 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">설문 맥락 설정</CardTitle>
                <CardDescription>
                  더 정확한 질문 생성을 위해 설문의 배경 정보를 입력해주세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">대상 부서</label>
                    <Input
                      placeholder="예: 간호부, 원무과"
                      value={surveyContext.department}
                      onChange={(e) => setSurveyContext({...surveyContext, department: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">설문 목적</label>
                    <Input
                      placeholder="예: 업무환경 개선"
                      value={surveyContext.purpose}
                      onChange={(e) => setSurveyContext({...surveyContext, purpose: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">응답 대상</label>
                    <Input
                      placeholder="예: 신입직원, 관리자"
                      value={surveyContext.targetAudience}
                      onChange={(e) => setSurveyContext({...surveyContext, targetAudience: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 빠른 생성 템플릿 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">빠른 생성</CardTitle>
                <CardDescription>
                  자주 사용되는 설문 유형을 선택하여 빠르게 질문을 생성하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {predefinedPrompts.map((template, index) => {
                    const IconComponent = template.icon
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-24 p-4 flex-col gap-2 text-left justify-start items-center"
                        onClick={() => generateQuestions(template.prompt, template.templateType)}
                        disabled={isLoading}
                      >
                        <IconComponent className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="space-y-1 text-center">
                          <p className="font-medium text-sm leading-tight">{template.title}</p>
                          <p className="text-xs text-muted-foreground leading-tight">
                            {template.description}
                          </p>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 커스텀 요청 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">맞춤 질문 생성</CardTitle>
                <CardDescription>
                  구체적인 요구사항을 입력하여 맞춤형 질문을 생성하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="어떤 종류의 질문이 필요한지 자세히 설명해주세요. 예: '간호사들의 야간 근무에 대한 만족도와 개선사항을 알아볼 수 있는 질문들을 만들어주세요.'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />
                <Button 
                  onClick={() => generateQuestions()}
                  disabled={isLoading || !prompt.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      AI가 질문을 생성중입니다...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      질문 생성하기
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            {generatedQuestions.length > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    생성된 질문 ({generatedQuestions.length}개)
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => generateQuestions()}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      전체 재생성
                    </Button>
                    <Button onClick={applyQuestions}>
                      질문 적용하기
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {generatedQuestions.map((question, index) => (
                    <Card key={question.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">Q{index + 1}</Badge>
                              <Badge className={getTypeBadgeColor(question.type)}>
                                {getTypeLabel(question.type)}
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
                            onClick={() => regenerateQuestion(index)}
                            disabled={isLoading}
                          >
                            <RefreshCw className="w-4 h-4" />
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
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default AIAssistant