import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Enable sending cookies with requests
    })

    // Cookie-based auth: browser sends HttpOnly cookies automatically

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Generic request method
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<T>(config)
    return response.data
  }

  // Auth APIs
  auth = {
    login: (email: string, password: string) =>
      this.request({
        method: 'POST',
        url: '/auth/login',
        data: { email, password },
      }),

    register: (data: any) =>
      this.request({
        method: 'POST',
        url: '/auth/register',
        data,
      }),

    logout: () =>
      this.request({
        method: 'POST',
        url: '/auth/logout',
      }),

    getCurrentUser: () =>
      this.request({
        method: 'GET',
        url: '/auth/me',
      }),

    updateProfile: (data: any) =>
      this.request({
        method: 'PUT',
        url: '/auth/profile',
        data,
      }),
  }

  // Learning APIs
  learning = {
    getPaths: (params?: any) =>
      this.request({
        method: 'GET',
        url: '/learning/paths',
        params,
      }),

    getPath: (pathId: string) =>
      this.request({
        method: 'GET',
        url: `/learning/paths/${pathId}`,
      }),

    getCourse: (courseId: string) =>
      this.request({
        method: 'GET',
        url: `/learning/courses/${courseId}`,
      }),

    getLesson: (lessonId: string) =>
      this.request({
        method: 'GET',
        url: `/learning/lessons/${lessonId}`,
      }),

    markLessonComplete: (lessonId: number) =>
      this.request({
        method: 'POST',
        url: `/learning/lessons/${lessonId}/complete`,
      }),

    updateProgress: (lessonId: number, timeSpent: number) =>
      this.request({
        method: 'POST',
        url: `/learning/lessons/${lessonId}/progress`,
        data: { timeSpent },
      }),

    bookmarkLesson: (lessonId: number, notes?: string) =>
      this.request({
        method: 'POST',
        url: `/learning/bookmarks`,
        data: { lessonId, notes },
      }),

    getBookmarks: () =>
      this.request({
        method: 'GET',
        url: '/learning/bookmarks',
      }),
  }

  // Quiz APIs
  quiz = {
    getQuizzes: (params?: any) =>
      this.request({
        method: 'GET',
        url: '/quiz',
        params,
      }),

    getQuiz: (quizId: number) =>
      this.request({
        method: 'GET',
        url: `/quiz/${quizId}`,
      }),

    getDailyQuiz: () =>
      this.request({
        method: 'GET',
        url: '/quiz/daily',
      }),

    startQuiz: (quizId: number) =>
      this.request({
        method: 'POST',
        url: `/quiz/${quizId}/start`,
      }),

    submitAnswer: (quizId: number, questionId: number, answer: string) =>
      this.request({
        method: 'POST',
        url: `/quiz/${quizId}/answer`,
        data: { questionId, answer },
      }),

    submitQuiz: (quizId: number, answers: Record<number, string>) =>
      this.request({
        method: 'POST',
        url: `/quiz/${quizId}/submit`,
        data: { answers },
      }),

    getAttempts: (params?: any) =>
      this.request({
        method: 'GET',
        url: '/quiz/attempts',
        params,
      }),

    getLeaderboard: (type: string = 'all_time', params?: any) =>
      this.request({
        method: 'GET',
        url: `/quiz/leaderboard/${type}`,
        params,
      }),

    generateAIQuiz: (topic: string, difficulty: string, numQuestions: number) =>
      this.request({
        method: 'POST',
        url: '/quiz/generate',
        data: { topic, difficulty, numQuestions },
      }),
  }

  // Hackathon APIs
  hackathon = {
    getHackathons: (params?: any) =>
      this.request({
        method: 'GET',
        url: '/hackathons',
        params,
      }),

    getHackathon: (hackathonId: number) =>
      this.request({
        method: 'GET',
        url: `/hackathons/${hackathonId}`,
      }),

    register: (hackathonId: number, teamId?: number) =>
      this.request({
        method: 'POST',
        url: `/hackathons/${hackathonId}/register`,
        data: { teamId },
      }),

    createTeam: (hackathonId: number, teamName: string) =>
      this.request({
        method: 'POST',
        url: `/hackathons/${hackathonId}/teams`,
        data: { teamName },
      }),

    joinTeam: (hackathonId: number, teamCode: string) =>
      this.request({
        method: 'POST',
        url: `/hackathons/${hackathonId}/teams/join`,
        data: { teamCode },
      }),

    submitCode: (hackathonId: number, data: any) =>
      this.request({
        method: 'POST',
        url: `/hackathons/${hackathonId}/submit`,
        data,
      }),

    runCode: (hackathonId: number, code: string, language: string, input?: string) =>
      this.request({
        method: 'POST',
        url: `/hackathons/${hackathonId}/run`,
        data: { code, language, input },
      }),

    getSubmissions: (hackathonId: number) =>
      this.request({
        method: 'GET',
        url: `/hackathons/${hackathonId}/submissions`,
      }),

    getLeaderboard: (hackathonId: number) =>
      this.request({
        method: 'GET',
        url: `/hackathons/${hackathonId}/leaderboard`,
      }),

    uploadCAD: (hackathonId: number, file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return this.request({
        method: 'POST',
        url: `/hackathons/${hackathonId}/cad/upload`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
  }

  // Job APIs
  jobs = {
    getJobs: (params?: any) =>
      this.request({
        method: 'GET',
        url: '/jobs',
        params,
      }),

    getJob: (jobId: number) =>
      this.request({
        method: 'GET',
        url: `/jobs/${jobId}`,
      }),

    apply: (jobId: number, data: any) => {
      const formData = new FormData()
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key])
      })
      return this.request({
        method: 'POST',
        url: `/jobs/${jobId}/apply`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },

    getApplications: (params?: any) =>
      this.request({
        method: 'GET',
        url: '/jobs/applications',
        params,
      }),

    getApplication: (applicationId: number) =>
      this.request({
        method: 'GET',
        url: `/jobs/applications/${applicationId}`,
      }),
  }

  // Interview APIs
  interview = {
    getSessions: (params?: any) =>
      this.request({
        method: 'GET',
        url: '/interview/sessions',
        params,
      }),

    getSession: (sessionId: number) =>
      this.request({
        method: 'GET',
        url: `/interview/sessions/${sessionId}`,
      }),

    submitResponse: (sessionId: number, questionId: number, answer: string) =>
      this.request({
        method: 'POST',
        url: `/interview/sessions/${sessionId}/response`,
        data: { questionId, answer },
      }),

    completeSession: (sessionId: number) =>
      this.request({
        method: 'POST',
        url: `/interview/sessions/${sessionId}/complete`,
      }),
  }

  // Corporate APIs (for companies)
  corporate = {
    createHackathon: (data: any) =>
      this.request({
        method: 'POST',
        url: '/corporate/hackathons',
        data,
      }),

    postJob: (data: any) =>
      this.request({
        method: 'POST',
        url: '/corporate/jobs',
        data,
      }),

    getCandidates: (jobId: number, params?: any) =>
      this.request({
        method: 'GET',
        url: `/corporate/jobs/${jobId}/candidates`,
        params,
      }),

    rankCandidates: (jobId: number) =>
      this.request({
        method: 'POST',
        url: `/corporate/jobs/${jobId}/rank`,
      }),

    scheduleInterview: (applicationId: number, data: any) =>
      this.request({
        method: 'POST',
        url: `/corporate/applications/${applicationId}/interview`,
        data,
      }),

    getAnalytics: (params?: any) =>
      this.request({
        method: 'GET',
        url: '/corporate/analytics',
        params,
      }),
  }

  // Analytics APIs
  analytics = {
    getUserStats: () =>
      this.request({
        method: 'GET',
        url: '/analytics/user/stats',
      }),

    getProgress: () =>
      this.request({
        method: 'GET',
        url: '/analytics/user/progress',
      }),

    getStrength: () =>
      this.request({
        method: 'GET',
        url: '/analytics/user/strengths',
      }),
  }
}

export const api = new ApiClient()
export default api
