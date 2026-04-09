/**
 * Civilization API — typed client wrappers for all new modules.
 * Uses the shared `api` axios instance (baseURL = /api, withCredentials: true).
 */

import api from './api'
import type {
  ApiResponse,
  LearningTrack,
  Exercise,
  ExerciseListParams,
  PublicQuiz,
  DailyQuizResult,
  Achievement,
  LeaderboardEntry,
} from '@/types'

async function handleApiResponse<T>(promise: Promise<{ data: T }>): Promise<T> {
  const response = await promise
  return response.data
}

function createErrorResponse<T>(error: unknown): ApiResponse<T> {
  const message = error instanceof Error ? error.message : 'An error occurred'
  return { error: message, data: undefined as T }
}

// ─── Learning Tracks ─────────────────────────────────────────────────────────

export const tracksAPI = {
  list: async (): Promise<ApiResponse<LearningTrack[]>> => {
    try {
      const data = await handleApiResponse<LearningTrack[]>(api.get('/tracks'))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  get: async (slug: string): Promise<ApiResponse<LearningTrack>> => {
    try {
      const data = await handleApiResponse<LearningTrack>(api.get(`/tracks/${slug}`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  enroll: async (id: number): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      const data = await handleApiResponse<{ success: boolean }>(api.post(`/tracks/${id}/enroll`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  progress: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/tracks/${id}/progress`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
}

// ─── Tutorials ────────────────────────────────────────────────────────────────

export const tutorialsAPI = {
  list: async (params?: Record<string, string>): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get('/tutorials', { params }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  search: async (query: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get('/tutorials/search', { params: { q: query } }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  get: async (slug: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/tutorials/${slug}`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  complete: async (id: number, sectionId: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/tutorials/${id}/progress`, { sectionId, completed: true }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  runCode: async (id: number, code: string, language: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/tutorials/${id}/run-code`, { code, language }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  trackBehavior: async (id: number, eventType: string, eventPayload?: Record<string, unknown>): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/tutorials/${id}/behavior-events`, { eventType, eventPayload }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  adaptiveGuidance: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/tutorials/${id}/adaptive-guidance`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
}

// ─── Study Notebooks ───────────────────────────────────────────────────────

export const notebooksAPI = {
  list: async (): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get('/notebooks'))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  get: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/notebooks/${id}`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  create: async (body: { title: string; description?: string; emoji?: string }): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post('/notebooks', body))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  update: async (id: number, body: { title?: string; description?: string; emoji?: string }): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.patch(`/notebooks/${id}`, body))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  delete: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.delete(`/notebooks/${id}`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  addSource: async (
    id: number,
    body: { title: string; sourceType: string; content?: string; url?: string }
  ): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/notebooks/${id}/sources`, body))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  deleteSource: async (id: number, sourceId: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.delete(`/notebooks/${id}/sources/${sourceId}`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  chat: async (id: number, message: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/notebooks/${id}/chat`, { message }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  generate: async (id: number, type: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/notebooks/${id}/generate`, { type }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  trackBehavior: async (id: number, eventType: string, eventPayload?: Record<string, unknown>): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/notebooks/${id}/behavior-events`, { eventType, eventPayload }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  adaptiveGuidance: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/notebooks/${id}/adaptive-guidance`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
}

// ─── Hackathons ───────────────────────────────────────────────────────────

export const hackathonsAPI = {
  list: async (params?: Record<string, string>): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get('/hackathons', { params }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  get: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/hackathons/${id}`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  create: async (data: Record<string, unknown>): Promise<ApiResponse<unknown>> => {
    try {
      const result = await handleApiResponse(api.post('/hackathons', data))
      return { data: result }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  register: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/hackathons/${id}/register`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  processPayment: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/hackathons/${id}/pay`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  getRegistrations: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/hackathons/${id}/registrations`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  getHosted: async (): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get('/hackathons/hosted'))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  createTeam: async (id: number, teamName: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/hackathons/${id}/teams`, { teamName }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  joinTeam: async (id: number, teamCode: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/hackathons/${id}/teams/join`, { teamCode }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  submitCode: async (id: number, data: {
    language: string
    sourceCode: string
    demoUrl?: string
    presentationUrl?: string
  }): Promise<ApiResponse<unknown>> => {
    try {
      const result = await handleApiResponse(api.post(`/hackathons/${id}/submit`, data))
      return { data: result }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  trackBehavior: async (id: number, eventType: string, eventPayload?: Record<string, unknown>): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/hackathons/${id}/behavior-events`, { eventType, eventPayload }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  adaptiveGuidance: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/hackathons/${id}/adaptive-guidance`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
}

// ─── Quizzes ───────────────────────────────────────────────────────────────

export const quizzesAPI = {
  trackBehavior: async (id: number, eventType: string, eventPayload?: Record<string, unknown>): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/quiz/${id}/behavior-events`, { eventType, eventPayload }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  adaptiveGuidance: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/quiz/${id}/adaptive-guidance`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
}

// ─── Q&A ─────────────────────────────────────────────────────────────────────

export const qnaAPI = {
  listQuestions: async (params?: Record<string, string>): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get('/qna/questions', { params }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  searchQuestions: async (q: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get('/qna/questions/search', { params: { q } }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  getQuestion: async (id: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/qna/questions/${id}`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  askQuestion: async (body: { title: string; body: string; domain: string; tags: string[] }): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post('/qna/questions', body))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  postAnswer: async (questionId: number, body: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/qna/questions/${questionId}/answers`, { body }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  vote: async (
    questionId: number,
    targetId: number,
    targetType: 'question' | 'answer',
    voteType: 'up' | 'down'
  ): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/qna/questions/${questionId}/vote`, { targetId, targetType, voteType }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  acceptAnswer: async (questionId: number, answerId: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/qna/questions/${questionId}/answers/${answerId}/accept`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  listTags: async (): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get('/qna/tags'))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
}

// ─── Repositories ─────────────────────────────────────────────────────────────

export const reposAPI = {
  getUserRepos: async (username: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/repositories/${username}`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  getRepo: async (username: string, slug: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/repositories/${username}/${slug}`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  getFile: async (repoId: number, path: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/repositories/${repoId}/files`, { params: { path } }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  createRepo: async (body: { name: string; description?: string; visibility: string }): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post('/repositories', body))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  createCommit: async (
    repoId: number,
    body: { message: string; files: { path: string; content: string }[] }
  ): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/repositories/${repoId}/commits`, body))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  listIssues: async (repoId: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/repositories/${repoId}/issues`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  createIssue: async (repoId: number, body: { title: string; body: string }): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/repositories/${repoId}/issues`, body))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  listPRs: async (repoId: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/repositories/${repoId}/pulls`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  createPR: async (
    repoId: number,
    body: { title: string; body: string; sourceBranch: string; targetBranch: string }
  ): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/repositories/${repoId}/pulls`, body))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  toggleStar: async (repoId: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/repositories/${repoId}/star`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
}

// ─── Certificates ────────────────────────────────────────────────────────────

export const certificatesAPI = {
  mine: async (): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get('/certificates/me'))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  verify: async (id: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/certificates/verify/${id}`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  issue: async (body: { userId: number; trackId: number; templateId: number }): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post('/certificates/issue', body))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
}

// ─── Organizations ───────────────────────────────────────────────────────────

export const orgsAPI = {
  list: async (params?: Record<string, string>): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get('/organizations', { params }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  get: async (slug: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/organizations/${slug}`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  create: async (body: { name: string; slug: string; orgType: string; description?: string }): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post('/organizations', body))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  invite: async (orgId: number, userId: number, role?: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/organizations/${orgId}/members`, { userId, role }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  talentPool: async (orgId: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/organizations/${orgId}/talent`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  joinTalentPool: async (orgId: number, body: { skills: string[]; score: number }): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/organizations/${orgId}/talent`, body))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  listChallenges: async (): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get('/organizations/challenges'))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  createChallenge: async (
    orgId: number,
    body: {
      title: string
      description: string
      domain: string
      prizePool: string
      deadline: string
    }
  ): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post(`/organizations/${orgId}/challenges`, body))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
}

// ─── Daily Quiz ───────────────────────────────────────────────────────────────

export const dailyQuizAPI = {
  domains: async (): Promise<ApiResponse<string[]>> => {
    try {
      const data = await handleApiResponse<string[]>(api.get('/daily-quiz/domains'))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },

  getQuiz: async (domain: string): Promise<ApiResponse<PublicQuiz>> => {
    try {
      const data = await handleApiResponse<PublicQuiz>(api.get(`/daily-quiz/${encodeURIComponent(domain)}`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },

  submitAnswers: async (domain: string, answers: number[]): Promise<ApiResponse<DailyQuizResult>> => {
    try {
      const data = await handleApiResponse<DailyQuizResult>(api.post('/daily-quiz/submit', { domain, answers }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
}

// ─── Gamification ───────────────────────────────────────────────────────────

export const gamificationAPI = {
  achievements: async (): Promise<ApiResponse<Achievement[]>> => {
    try {
      const data = await handleApiResponse<Achievement[]>(api.get('/gamification/achievements'))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  leaderboard: async (limit?: number): Promise<ApiResponse<LeaderboardEntry[]>> => {
    try {
      const data = await handleApiResponse<LeaderboardEntry[]>(
        api.get('/gamification/leaderboard', { params: limit ? { limit: String(limit) } : undefined })
      )
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
}

// ─── Exercises ───────────────────────────────────────────────────────────────

export const exercisesAPI = {
  list: async (params?: ExerciseListParams): Promise<ApiResponse<Exercise[]>> => {
    try {
      const data = await handleApiResponse<Exercise[]>(api.get('/exercises', { params }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  get: async (id: string | number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get(`/exercises/${id}`))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
}

// ─── Code Execution (Judge0) ─────────────────────────────────────────────────

export const codeAPI = {
  execute: async (code: string, language: string, stdin?: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post('/code/execute', { code, language, stdin }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  languages: async (): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get('/code/languages'))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
}

// ─── AI Services ─────────────────────────────────────────────────────────────

export const aiAPI = {
  chat: async (prompt: string, maxTokens?: number): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post('/ai/chat', { prompt, max_new_tokens: maxTokens }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  generateQuiz: async (topic: string, count = 5): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post('/ai/quiz', { topic, count }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  reviewCode: async (code: string, language: string): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post('/ai/review', { code, language }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  generatePath: async (goal: string, currentSkills: string[]): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.post('/ai/learning-path', { goal, current_skills: currentSkills }))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export const analyticsAPI = {
  platform: async (): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get('/analytics/platform'))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
  userStats: async (): Promise<ApiResponse<unknown>> => {
    try {
      const data = await handleApiResponse(api.get('/analytics/user/stats'))
      return { data }
    } catch (error) {
      return createErrorResponse(error)
    }
  },
}