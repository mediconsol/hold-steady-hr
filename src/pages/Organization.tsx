import { useState } from "react"
import { 
  Building2, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  MoreVertical,
  UserPlus,
  Building,
  Crown,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronRight,
  Eye
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Footer from "@/components/layout/Footer"

interface Employee {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  hireDate: string
  status: "active" | "inactive" | "leave"
  isManager: boolean
  managerId?: string
}

interface Department {
  id: string
  name: string
  managerId?: string
  parentId?: string
  employeeCount: number
  description: string
}

const mockEmployees: Employee[] = [
  { id: "1", name: "김원장", position: "원장", department: "경영진", email: "director@hospital.com", phone: "010-1234-5678", hireDate: "2020-01-01", status: "active", isManager: true },
  { id: "2", name: "박간호부장", position: "간호부장", department: "간호부", email: "nursing@hospital.com", phone: "010-2345-6789", hireDate: "2020-03-15", status: "active", isManager: true },
  { id: "3", name: "이수간호사", position: "수간호사", department: "간호부", email: "head.nurse@hospital.com", phone: "010-3456-7890", hireDate: "2021-05-01", status: "active", isManager: true, managerId: "2" },
  { id: "4", name: "최간호사", position: "간호사", department: "간호부", email: "nurse1@hospital.com", phone: "010-4567-8901", hireDate: "2022-01-10", status: "active", isManager: false, managerId: "3" },
  { id: "5", name: "정간호사", position: "간호사", department: "간호부", email: "nurse2@hospital.com", phone: "010-5678-9012", hireDate: "2022-03-20", status: "active", isManager: false, managerId: "3" },
  { id: "6", name: "송원무과장", position: "원무과장", department: "원무과", email: "admin@hospital.com", phone: "010-6789-0123", hireDate: "2020-06-01", status: "active", isManager: true },
  { id: "7", name: "김원무팀장", position: "팀장", department: "원무과", email: "admin.team@hospital.com", phone: "010-7890-1234", hireDate: "2021-02-15", status: "active", isManager: true, managerId: "6" },
  { id: "8", name: "박원무", position: "원무직원", department: "원무과", email: "admin1@hospital.com", phone: "010-8901-2345", hireDate: "2022-08-01", status: "active", isManager: false, managerId: "7" },
  { id: "9", name: "이물리치료사", position: "물리치료사", department: "물리치료실", email: "pt@hospital.com", phone: "010-9012-3456", hireDate: "2021-09-01", status: "active", isManager: true },
  { id: "10", name: "조물리치료사", position: "물리치료사", department: "물리치료실", email: "pt2@hospital.com", phone: "010-0123-4567", hireDate: "2022-11-15", status: "active", isManager: false, managerId: "9" },
]

const mockDepartments: Department[] = [
  { id: "1", name: "경영진", managerId: "1", employeeCount: 1, description: "병원 경영 총괄" },
  { id: "2", name: "간호부", managerId: "2", parentId: "1", employeeCount: 4, description: "환자 간호 및 의료 서비스" },
  { id: "3", name: "원무과", managerId: "6", parentId: "1", employeeCount: 3, description: "병원 행정 업무 및 원무 관리" },
  { id: "4", name: "물리치료실", managerId: "9", parentId: "1", employeeCount: 2, description: "환자 물리치료 및 재활" },
  { id: "5", name: "진료지원부", parentId: "1", employeeCount: 0, description: "진료 지원 업무" },
  { id: "6", name: "행정팀", parentId: "1", employeeCount: 0, description: "일반 행정 업무" },
]

const getStatusBadge = (status: Employee["status"]) => {
  const statusConfig = {
    active: { label: "재직", color: "bg-green-100 text-green-800" },
    inactive: { label: "휴직", color: "bg-yellow-100 text-yellow-800" },
    leave: { label: "퇴사", color: "bg-gray-100 text-gray-800" }
  }
  
  const config = statusConfig[status]
  return <Badge className={`${config.color} border-0`}>{config.label}</Badge>
}

const Organization = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false)
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(["1", "2", "3", "4"]))
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    isManager: false
  })
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    parentId: ""
  })

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || emp.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const getEmployeesByDepartment = (deptName: string) => {
    return employees.filter(emp => emp.department === deptName && emp.status === "active")
  }

  const getDepartmentManager = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId)
    if (!dept?.managerId) return null
    return employees.find(emp => emp.id === dept.managerId)
  }

  const toggleDepartment = (deptId: string) => {
    const newExpanded = new Set(expandedDepts)
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId)
    } else {
      newExpanded.add(deptId)
    }
    setExpandedDepts(newExpanded)
  }

  const handleAddEmployee = () => {
    if (newEmployee.name.trim() && newEmployee.department) {
      const employee: Employee = {
        id: Date.now().toString(),
        name: newEmployee.name,
        position: newEmployee.position,
        department: newEmployee.department,
        email: newEmployee.email,
        phone: newEmployee.phone,
        hireDate: new Date().toISOString().split('T')[0],
        status: "active",
        isManager: newEmployee.isManager
      }
      
      setEmployees([...employees, employee])
      setNewEmployee({ name: "", position: "", department: "", email: "", phone: "", isManager: false })
      setIsAddEmployeeOpen(false)
    }
  }

  const handleAddDepartment = () => {
    if (newDepartment.name.trim()) {
      const department: Department = {
        id: Date.now().toString(),
        name: newDepartment.name,
        description: newDepartment.description,
        parentId: newDepartment.parentId || undefined,
        employeeCount: 0
      }
      
      setDepartments([...departments, department])
      setNewDepartment({ name: "", description: "", parentId: "" })
      setIsAddDepartmentOpen(false)
    }
  }

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id))
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">조직도 관리</h1>
                <p className="text-gray-600">병원 조직 구조와 직원 정보를 관리하세요</p>
              </div>
              
              <div className="flex gap-3">
                <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Building className="w-4 h-4 mr-2" />
                      부서 추가
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>새 부서 추가</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dept-name">부서명</Label>
                        <Input
                          id="dept-name"
                          value={newDepartment.name}
                          onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                          placeholder="부서명을 입력하세요"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dept-desc">부서 설명</Label>
                        <Input
                          id="dept-desc"
                          value={newDepartment.description}
                          onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                          placeholder="부서 업무를 간략히 설명하세요"
                        />
                      </div>
                      <div>
                        <Label htmlFor="parent-dept">상위 부서</Label>
                        <Select value={newDepartment.parentId} onValueChange={(value) => setNewDepartment({...newDepartment, parentId: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="상위 부서 선택 (선택사항)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">없음 (최상위)</SelectItem>
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddDepartment} className="w-full">
                        부서 추가
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      직원 추가
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>새 직원 추가</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="emp-name">이름</Label>
                        <Input
                          id="emp-name"
                          value={newEmployee.name}
                          onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                          placeholder="직원 이름"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emp-position">직급</Label>
                        <Input
                          id="emp-position"
                          value={newEmployee.position}
                          onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                          placeholder="직급/직책"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emp-dept">부서</Label>
                        <Select value={newEmployee.department} onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="부서 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="emp-email">이메일</Label>
                        <Input
                          id="emp-email"
                          type="email"
                          value={newEmployee.email}
                          onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                          placeholder="이메일 주소"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emp-phone">연락처</Label>
                        <Input
                          id="emp-phone"
                          value={newEmployee.phone}
                          onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                          placeholder="연락처"
                        />
                      </div>
                      <Button onClick={handleAddEmployee} className="w-full">
                        직원 추가
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
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
                      <p className="text-2xl font-bold">{employees.filter(e => e.status === 'active').length}명</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">부서 수</p>
                      <p className="text-2xl font-bold">{departments.length}개</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Crown className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">관리자</p>
                      <p className="text-2xl font-bold">{employees.filter(e => e.isManager && e.status === 'active').length}명</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">신입 (3개월)</p>
                      <p className="text-2xl font-bold">
                        {employees.filter(e => {
                          const hireDate = new Date(e.hireDate)
                          const threeMonthsAgo = new Date()
                          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
                          return hireDate > threeMonthsAgo && e.status === 'active'
                        }).length}명
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="org-chart" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="org-chart">조직도</TabsTrigger>
                <TabsTrigger value="employee-list">직원 목록</TabsTrigger>
              </TabsList>

              <TabsContent value="org-chart" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      조직 구조
                    </CardTitle>
                    <CardDescription>
                      병원의 조직 구조와 부서별 인원을 확인하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {departments.filter(dept => !dept.parentId).map((rootDept) => (
                        <div key={rootDept.id} className="space-y-2">
                          {/* Root Department */}
                          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => toggleDepartment(rootDept.id)}
                                className="p-1 hover:bg-primary/10 rounded"
                              >
                                {expandedDepts.has(rootDept.id) ? 
                                  <ChevronDown className="w-4 h-4" /> : 
                                  <ChevronRight className="w-4 h-4" />
                                }
                              </button>
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Building2 className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{rootDept.name}</h3>
                                <p className="text-sm text-gray-600">{rootDept.description}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm text-gray-600">부서장</p>
                                <p className="font-medium">
                                  {getDepartmentManager(rootDept.id)?.name || "미지정"}
                                </p>
                              </div>
                              <Badge variant="outline">{rootDept.employeeCount}명</Badge>
                            </div>
                          </div>

                          {/* Department Employees */}
                          {expandedDepts.has(rootDept.id) && (
                            <div className="ml-8 space-y-2">
                              {getEmployeesByDepartment(rootDept.name).map((employee) => (
                                <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                        {employee.name.slice(0, 2)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium">{employee.name}</p>
                                        {employee.isManager && <Crown className="w-4 h-4 text-yellow-500" />}
                                      </div>
                                      <p className="text-sm text-gray-600">{employee.position}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-3">
                                    {getStatusBadge(employee.status)}
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreVertical className="w-4 h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem>
                                          <Edit className="w-4 h-4 mr-2" />
                                          편집
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          className="text-red-600"
                                          onClick={() => handleDeleteEmployee(employee.id)}
                                        >
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          삭제
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Sub Departments */}
                          {expandedDepts.has(rootDept.id) && departments.filter(dept => dept.parentId === rootDept.id).map((subDept) => (
                            <div key={subDept.id} className="ml-6 space-y-2">
                              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <Building className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{subDept.name}</h4>
                                    <p className="text-sm text-gray-600">{subDept.description}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">부서장</p>
                                    <p className="font-medium">
                                      {getDepartmentManager(subDept.id)?.name || "미지정"}
                                    </p>
                                  </div>
                                  <Badge variant="outline">{subDept.employeeCount}명</Badge>
                                </div>
                              </div>
                              
                              <div className="ml-8 space-y-2">
                                {getEmployeesByDepartment(subDept.name).map((employee) => (
                                  <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="w-8 h-8">
                                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                          {employee.name.slice(0, 2)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <p className="font-medium">{employee.name}</p>
                                          {employee.isManager && <Crown className="w-4 h-4 text-yellow-500" />}
                                        </div>
                                        <p className="text-sm text-gray-600">{employee.position}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                      {getStatusBadge(employee.status)}
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <MoreVertical className="w-4 h-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                          <DropdownMenuItem>
                                            <Edit className="w-4 h-4 mr-2" />
                                            편집
                                          </DropdownMenuItem>
                                          <DropdownMenuItem 
                                            className="text-red-600"
                                            onClick={() => handleDeleteEmployee(employee.id)}
                                          >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            삭제
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="employee-list" className="space-y-6">
                {/* Search and Filter */}
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="직원 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 부서</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Employee Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEmployees.map((employee) => (
                    <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {employee.name.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{employee.name}</h3>
                                {employee.isManager && <Crown className="w-4 h-4 text-yellow-500" />}
                              </div>
                              <p className="text-sm text-gray-600">{employee.position}</p>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                편집
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteEmployee(employee.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span>{employee.department}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{employee.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{employee.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">입사: {employee.hireDate}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          {getStatusBadge(employee.status)}
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            상세
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredEmployees.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">직원이 없습니다</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm ? "검색 조건에 맞는 직원이 없습니다." : "첫 번째 직원을 추가해보세요."}
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setIsAddEmployeeOpen(true)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        직원 추가
                      </Button>
                    )}
                  </div>
                )}
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

export default Organization