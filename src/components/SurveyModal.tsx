import React, { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

interface SurveyQuestion {
  id: number
  question: string
  emoji: string
  description: string
}

interface SurveyModalProps {
  isOpen: boolean
  onClose: () => void
}

const surveyQuestions: SurveyQuestion[] = [
  { 
    id: 1, 
    question: "나의 업무는 명확히 정의되어 있으며, 불필요한 일이 반복되지 않는다",
    emoji: "🎯",
    description: "업무의 명확성과 효율성에 대한 평가"
  },
  { 
    id: 2, 
    question: "부서장 또는 상급자는 나의 의견을 경청하고 존중한다",
    emoji: "👂",
    description: "상하간 소통과 의견 존중 정도"
  },
  { 
    id: 3, 
    question: "나의 업무 강도는 타당하며 과중하다고 느껴지지 않는다",
    emoji: "⚖️",
    description: "업무량과 강도의 적절성 평가"
  },
  { 
    id: 4, 
    question: "병원은 내 성장과 발전을 위한 교육 기회를 제공하고 있다",
    emoji: "📚",
    description: "개인 성장과 교육 지원 현황"
  },
  { 
    id: 5, 
    question: "타 부서와 협업 시 갈등보다는 이해와 협력이 많다",
    emoji: "🤝",
    description: "부서간 협업과 조직 화합도"
  },
  { 
    id: 6, 
    question: "병원은 내가 가진 전문성을 존중하고 인정해준다",
    emoji: "🏆",
    description: "개인 전문성에 대한 인정과 존중"
  },
  { 
    id: 7, 
    question: "근무 스케줄이나 휴무는 공정하고 투명하게 운영된다",
    emoji: "📅",
    description: "근무 환경과 스케줄 관리의 공정성"
  },
  { 
    id: 8, 
    question: "병원 경영진은 직원 복지와 환경 개선에 관심을 갖고 있다",
    emoji: "💝",
    description: "경영진의 직원 복지에 대한 관심도"
  },
  { 
    id: 9, 
    question: "나는 이 병원에서 장기 근무할 의향이 있다",
    emoji: "🌱",
    description: "조직에 대한 애착도와 장기 근무 의향"
  },
  { 
    id: 10, 
    question: "병원은 구성원의 의견을 반영하여 지속적으로 개선한다",
    emoji: "🔄",
    description: "조직의 변화와 개선에 대한 노력"
  },
]

const scaleOptions = [
  { value: 5, label: "매우 그렇다" },
  { value: 4, label: "그렇다" },
  { value: 3, label: "보통이다" },
  { value: 2, label: "아니다" },
  { value: 1, label: "전혀 아니다" },
]

export function SurveyModal({ isOpen, onClose }: SurveyModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    const totalAnswers = Object.keys(answers).length
    const averageScore = Object.values(answers).reduce((sum, score) => sum + score, 0) / totalAnswers
    
    alert(`설문이 완료되었습니다!\n응답한 문항: ${totalAnswers}/10\n평균 점수: ${averageScore.toFixed(1)}/5`)
    onClose()
    setCurrentQuestion(0)
    setAnswers({})
  }

  const progress = ((currentQuestion + 1) / surveyQuestions.length) * 100
  const currentQ = surveyQuestions[currentQuestion]
  const isAnswered = answers[currentQ.id] !== undefined
  const allAnswered = surveyQuestions.every(q => answers[q.id] !== undefined)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            직원 만족도 설문조사 체험
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>진행률</span>
            <span>{currentQuestion + 1} / {surveyQuestions.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-4xl">{currentQ.emoji}</span>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    질문 {currentQ.id} / {surveyQuestions.length}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-relaxed mb-3">
                  {currentQ.question}
                </h3>
                <p className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg inline-block">
                  {currentQ.description}
                </p>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {scaleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQ.id, option.value)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      answers[currentQ.id] === option.value
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{option.label}</span>
                      <span className="text-sm text-gray-500">({option.value}점)</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            이전
          </Button>

          <div className="flex gap-2">
            {surveyQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentQuestion
                    ? 'bg-primary'
                    : answers[surveyQuestions[index].id] !== undefined
                    ? 'bg-primary/50'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {currentQuestion === surveyQuestions.length - 1 ? (
            <Button 
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="flex items-center gap-2"
            >
              설문 완료
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex items-center gap-2"
            >
              다음
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Summary */}
        <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          응답 완료: {Object.keys(answers).length} / {surveyQuestions.length}
          {allAnswered && (
            <span className="block text-primary font-medium mt-1">
              모든 질문에 답변하셨습니다! 설문을 완료해주세요.
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}