# 메디HR+ 시스템 아키텍처

## 문서 정보
- **프로젝트명**: 메디HR+ (병원 직원 만족도 관리 시스템)
- **문서 유형**: 시스템 아키텍처
- **버전**: v1.0
- **작성일**: 2025-01-28

---

## 1. 전체 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            메디HR+ 시스템 아키텍처                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   사용자 레이어   │    │   외부 서비스    │    │    배포 환경     │
│                │    │                │    │                │
│ 🖥️  데스크톱     │    │ 🤖 Google AI    │    │ ☁️  Vercel      │
│ 📱  모바일       │◄──►│    Gemini 1.5   │    │    CDN         │
│ 🔍  브라우저     │    │                │    │    Edge        │
│                │    │ 📧 EmailJS      │    │                │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          프론트엔드 애플리케이션                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  📦 React 18 + TypeScript  │  🎨 UI Components      │  🔄 State Management  │
│  ⚡ Vite Build System     │     shadcn/ui          │     Context API       │
│  🛣️  React Router v6      │     Tailwind CSS       │     React Hooks       │
├─────────────────────────────────────────────────────────────────────────────┤
│                              주요 페이지 모듈                                │
├─────────────────┬─────────────────┬─────────────────┬─────────────────┤
│ 🏠 대시보드      │ 📊 설문 관리     │ 👥 조직도       │ 📈 트렌드 분석   │
│ • 전체 현황     │ • AI 설문 생성   │ • 직원 관리     │ • 만족도 분석   │
│ • 주요 지표     │ • 응답 수집     │ • 부서 관리     │ • 예측 분석     │
│ • 빠른 실행     │ • 결과 분석     │ • 권한 관리     │ • 리포트 생성   │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

---

## 2. 컴포넌트 아키텍처

### 2.1 컴포넌트 계층 구조

```
src/
├── components/                 # 재사용 가능한 UI 컴포넌트
│   ├── ui/                    # shadcn/ui 기본 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/                # 레이아웃 컴포넌트
│   │   ├── AppSidebar.tsx     # 사이드바 네비게이션
│   │   ├── Header.tsx         # 상단 헤더
│   │   └── Footer.tsx         # 하단 푸터
│   ├── dashboard/             # 대시보드 전용 컴포넌트
│   │   └── StatsCard.tsx      # 통계 카드
│   ├── AIAssistant.tsx        # AI 설문 생성 도우미
│   ├── SurveyModal.tsx        # 설문 체험 모달
│   ├── ContactModal.tsx       # 문의 양식 모달
│   └── DemoNotice.tsx         # 데모 안내 섹션
├── pages/                     # 페이지 컴포넌트
│   ├── Index.tsx              # 메인 대시보드
│   ├── Surveys.tsx            # 설문 관리
│   ├── Organization.tsx       # 조직도 관리
│   ├── Employees.tsx          # 직원 관리
│   ├── Trends.tsx             # 만족도 트렌드
│   ├── Feedback.tsx           # 피드백 관리
│   └── Reports.tsx            # 리포트 관리
└── lib/                       # 유틸리티 및 설정
    ├── utils.ts               # 공통 유틸리티
    └── types.ts               # TypeScript 타입 정의
```

### 2.2 컴포넌트 상호작용 흐름

```
┌─────────────────┐
│   App.tsx       │
│   (라우터 설정)   │
└─────────────────┘
         │
         ▼
┌─────────────────┐    ┌─────────────────┐
│   페이지 컴포넌트  │◄──►│   레이아웃        │
│   (Index.tsx)   │    │   (AppSidebar)   │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   비즈니스 로직   │    │   UI 컴포넌트     │
│   (상태 관리)    │◄──►│   (shadcn/ui)   │
└─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│   외부 서비스    │
│   (AI, Email)   │
└─────────────────┘
```

---

## 3. 데이터 아키텍처

### 3.1 데이터 모델

```typescript
// 핵심 엔터티
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee";
  department: string;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  status: "active" | "inactive" | "leave";
  satisfactionScore: number;
  performanceScore: number;
  riskLevel: "low" | "medium" | "high";
  isManager: boolean;
  managerId?: string;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  targetDepartments: string[];
  status: "draft" | "active" | "completed" | "closed";
  startDate: string;
  endDate: string;
  responseCount: number;
  totalTargets: number;
}

interface Feedback {
  id: string;
  title: string;
  content: string;
  category: "improvement" | "complaint" | "compliment" | "suggestion" | "bug";
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "resolved" | "closed";
  author: string;
  department: string;
  createdAt: string;
  responses: FeedbackResponse[];
}
```

### 3.2 상태 관리 패턴

```typescript
// 로컬 상태 (React Hooks)
const [employees, setEmployees] = useState<Employee[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// 컴포넌트 간 상태 공유 (Context API)
const AppContext = createContext<AppContextType | null>(null);

// 파생 상태 (Computed Values)
const activeEmployees = useMemo(() => 
  employees.filter(emp => emp.status === 'active'),
  [employees]
);
```

---

## 4. AI 통합 아키텍처

### 4.1 Google Generative AI 통합

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   사용자 입력    │───►│   프롬프트 생성   │───►│   AI API 호출   │
│   (설문 주제)    │    │   (템플릿 기반)   │    │   (Gemini 1.5)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
┌─────────────────┐    ┌─────────────────┐            │
│   설문 문항     │◄───│   응답 파싱     │◄───────────┘
│   (구조화된 데이터)│    │   (JSON 변환)   │
└─────────────────┘    └─────────────────┘
```

### 4.2 AI 서비스 클래스

```typescript
class AIService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });
  }

  async generateQuestions(prompt: string): Promise<Question[]> {
    try {
      const result = await this.model.generateContent(prompt);
      return this.parseQuestions(result.response.text());
    } catch (error) {
      console.error('AI generation failed:', error);
      return this.getFallbackQuestions();
    }
  }

  private parseQuestions(text: string): Question[] {
    // AI 응답 파싱 로직
  }

  private getFallbackQuestions(): Question[] {
    // 폴백 질문 반환
  }
}
```

---

## 5. 통신 아키텍처

### 5.1 외부 API 통합

```
┌─────────────────┐
│   프론트엔드     │
└─────────────────┘
         │
    ┌────┼────┐
    │         │
    ▼         ▼
┌─────────┐ ┌─────────┐
│Google AI│ │EmailJS  │
│API      │ │Service  │
└─────────┘ └─────────┘
```

### 5.2 API 클라이언트 패턴

```typescript
// API 호출 추상화
class ApiClient {
  async post<T>(url: string, data: any): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }
}

// 서비스별 클라이언트
class EmailService extends ApiClient {
  async sendInquiry(data: ContactFormData): Promise<void> {
    return emailjs.send(
      'SERVICE_ID',
      'TEMPLATE_ID',
      data,
      'PUBLIC_KEY'
    );
  }
}
```

---

## 6. 보안 아키텍처

### 6.1 클라이언트 사이드 보안

```
┌─────────────────┐
│   입력 검증      │  ← 사용자 입력
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   XSS 방지      │  ← HTML 이스케이프
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   CSRF 보호     │  ← 토큰 검증
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   HTTPS 통신    │  ← SSL/TLS 암호화
└─────────────────┘
```

### 6.2 환경 변수 관리

```typescript
// 환경 변수 타입 정의
interface EnvVars {
  VITE_GOOGLE_AI_API_KEY: string;
  VITE_EMAILJS_SERVICE_ID: string;
  VITE_EMAILJS_TEMPLATE_ID: string;
  VITE_EMAILJS_PUBLIC_KEY: string;
}

// 환경 변수 검증
const validateEnv = (): EnvVars => {
  const requiredVars = [
    'VITE_GOOGLE_AI_API_KEY',
    'VITE_EMAILJS_SERVICE_ID',
    // ...
  ];
  
  for (const varName of requiredVars) {
    if (!import.meta.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }
  
  return import.meta.env as EnvVars;
};
```

---

## 7. 성능 아키텍처

### 7.1 최적화 전략

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   코드 스플리팅   │    │   지연 로딩      │    │   메모이제이션   │
│   (Route-based) │    │   (Lazy Loading) │    │   (React.memo)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          번들 최적화                                         │
├─────────────────┬─────────────────┬─────────────────┬─────────────────┤
│   Vite 빌드     │   Tree Shaking  │   압축 최적화    │   캐싱 전략     │
│   (ESM 기반)    │   (사용안함제거) │   (Gzip/Brotli) │   (브라우저)    │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### 7.2 렌더링 최적화

```typescript
// 컴포넌트 메모이제이션
const EmployeeCard = React.memo(({ employee }: Props) => {
  // 컴포넌트 로직
});

// 비싼 계산 캐싱
const expensiveValue = useMemo(() => {
  return calculateComplexValue(data);
}, [data]);

// 함수 레퍼런스 안정화
const handleClick = useCallback((id: string) => {
  // 핸들러 로직
}, [dependencies]);
```

---

## 8. 테스트 아키텍처

### 8.1 테스트 피라미드

```
┌─────────────────┐
│   E2E 테스트     │  ← 전체 사용자 플로우
│   (Playwright)  │
└─────────────────┘
         │
┌─────────────────┐
│   통합 테스트    │  ← 컴포넌트 간 상호작용
│   (RTL)        │
└─────────────────┘
         │
┌─────────────────┐
│   단위 테스트    │  ← 개별 함수/컴포넌트
│   (Jest + RTL)  │
└─────────────────┘
```

### 8.2 테스트 구조

```
src/
├── __tests__/             # 테스트 파일
│   ├── components/        # 컴포넌트 테스트
│   ├── pages/            # 페이지 테스트
│   ├── utils/            # 유틸리티 테스트
│   └── setup.ts          # 테스트 설정
├── __mocks__/            # 모킹 파일
│   ├── google-ai.ts      # AI API 모킹
│   └── emailjs.ts        # 이메일 서비스 모킹
└── e2e/                  # E2E 테스트
    ├── dashboard.spec.ts
    ├── surveys.spec.ts
    └── feedback.spec.ts
```

---

## 9. 배포 아키텍처

### 9.1 Vercel 배포 파이프라인

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub        │───►│   Vercel        │───►│   CDN 배포      │
│   (소스 코드)    │    │   (빌드 & 배포)  │    │   (전역 캐시)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   자동 빌드     │    │   프리뷰 배포    │    │   프로덕션 배포  │
│   (CI/CD)      │    │   (PR별)        │    │   (main 브랜치)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 9.2 환경별 설정

```typescript
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}

// vite.config.ts
export default defineConfig({
  base: '/',  // Vercel에서는 root path 사용
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

---

## 10. 모니터링 및 로깅

### 10.1 모니터링 스택

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   브라우저       │    │   사용자 행동   │
│   Analytics     │    │   DevTools      │    │   추적         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          중앙 모니터링 대시보드                               │
├─────────────────┬─────────────────┬─────────────────┬─────────────────┤
│   성능 메트릭    │   에러 추적     │   사용자 세션   │   비즈니스 지표  │
│   • Core Web    │   • JS 오류     │   • 페이지뷰    │   • 설문 완료율  │
│   • 로딩 시간   │   • API 실패    │   • 사용자 플로우│   • 피드백 수   │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### 10.2 로깅 전략

```typescript
// 로깅 레벨
enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

// 로거 클래스
class Logger {
  static log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    console[level](logEntry);
    
    // 프로덕션에서는 외부 로깅 서비스로 전송
    if (import.meta.env.PROD) {
      this.sendToLoggingService(logEntry);
    }
  }
}
```

---

## 11. 확장성 고려사항

### 11.1 수평 확장

```
현재 아키텍처 (모놀리식 프론트엔드)
┌─────────────────────────────────────────┐
│           메디HR+ 웹앱                   │
│  ┌─────────┬─────────┬─────────────┐    │
│  │대시보드  │설문관리  │직원관리     │    │
│  └─────────┴─────────┴─────────────┘    │
└─────────────────────────────────────────┘

향후 마이크로 프론트엔드 (확장 시)
┌─────────┐ ┌─────────┐ ┌─────────────┐
│대시보드  │ │설문관리  │ │직원관리     │
│모듈     │ │모듈     │ │모듈         │
└─────────┘ └─────────┘ └─────────────┘
    │           │           │
    └───────────┼───────────┘
                │
    ┌─────────────────────┐
    │   Shell 애플리케이션  │
    │   (라우팅 & 통합)    │
    └─────────────────────┘
```

### 11.2 기술 스택 진화

```
Phase 1 (현재): 프론트엔드 MVP
├── React + TypeScript
├── shadcn/ui + Tailwind
├── Vite + Vercel
└── Google AI + EmailJS

Phase 2 (백엔드 추가): 풀스택 애플리케이션
├── Node.js + Express
├── PostgreSQL + Redis
├── JWT 인증
└── REST API

Phase 3 (확장): 엔터프라이즈 솔루션
├── 마이크로서비스
├── GraphQL
├── 실시간 통신
└── 고급 분석
```

---

## 12. 결론

메디HR+ 시스템은 현대적인 프론트엔드 아키텍처를 기반으로 구축되었으며, 다음과 같은 특징을 가집니다:

### 주요 아키텍처 원칙
1. **컴포넌트 기반**: 재사용 가능한 모듈식 설계
2. **타입 안전성**: TypeScript를 통한 컴파일 타임 오류 방지
3. **성능 최적화**: 지연 로딩 및 메모이제이션 적용
4. **확장성**: 미래 확장을 고려한 유연한 구조
5. **보안성**: 클라이언트 사이드 보안 모범 사례 적용

### 기술적 성과
- ✅ React 18 기반 현대적 프론트엔드
- ✅ AI 통합으로 차별화된 사용자 경험
- ✅ 반응형 디자인으로 모든 디바이스 지원
- ✅ Vercel을 통한 글로벌 CDN 배포
- ✅ 타입 안전성과 개발자 경험 최적화

이 아키텍처는 현재 MVP 요구사항을 충족하며, 향후 백엔드 추가 및 엔터프라이즈 확장을 위한 견고한 기반을 제공합니다.

---

**문서 버전**: v1.0  
**최종 수정일**: 2025-01-28  
**승인자**: 메디콘솔 개발팀