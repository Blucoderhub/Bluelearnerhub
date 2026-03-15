/**
 * Civilization API — typed client wrappers for all new modules.
 * Uses the shared `api` axios instance (baseURL = /api, withCredentials: true).
 */

import api from './api';

// ─── Learning Tracks ─────────────────────────────────────────────────────────

export const tracksAPI = {
  list:       ()         => api.get('/tracks').then((r) => r.data),
  get:        (slug: string) => api.get(`/tracks/${slug}`).then((r) => r.data),
  enroll:     (id: number)   => api.post(`/tracks/${id}/enroll`).then((r) => r.data),
  progress:   (id: number)   => api.get(`/tracks/${id}/progress`).then((r) => r.data),
};

// ─── Tutorials ────────────────────────────────────────────────────────────────

export const tutorialsAPI = {
  list:       (params?: Record<string, string>) => api.get('/tutorials', { params }).then((r) => r.data),
  search:     (query: string) => api.get('/tutorials/search', { params: { q: query } }).then((r) => r.data),
  get:        (slug: string)  => api.get(`/tutorials/${slug}`).then((r) => r.data),
  complete:   (id: number, sectionId: number) =>
                api.post(`/tutorials/${id}/progress`, { sectionId, completed: true }).then((r) => r.data),
  runCode:    (id: number, code: string, language: string) =>
                api.post(`/tutorials/${id}/run-code`, { code, language }).then((r) => r.data),
  trackBehavior: (id: number, eventType: string, eventPayload?: Record<string, unknown>) =>
                api.post(`/tutorials/${id}/behavior-events`, { eventType, eventPayload }).then((r) => r.data),
  adaptiveGuidance: (id: number) =>
                api.get(`/tutorials/${id}/adaptive-guidance`).then((r) => r.data),
};

// ─── Study Notebooks ───────────────────────────────────────────────────────

export const notebooksAPI = {
  // CRUD
  list:           ()                       => api.get('/notebooks').then((r) => r.data),
  get:            (id: number)             => api.get(`/notebooks/${id}`).then((r) => r.data),
  create:         (body: { title: string; description?: string; emoji?: string }) =>
                    api.post('/notebooks', body).then((r) => r.data),
  update:         (id: number, body: { title?: string; description?: string; emoji?: string }) =>
                    api.patch(`/notebooks/${id}`, body).then((r) => r.data),
  delete:         (id: number)             => api.delete(`/notebooks/${id}`).then((r) => r.data),
  // Sources
  addSource:      (id: number, body: { title: string; sourceType: string; content?: string; url?: string }) =>
                    api.post(`/notebooks/${id}/sources`, body).then((r) => r.data),
  deleteSource:   (id: number, sourceId: number) =>
                    api.delete(`/notebooks/${id}/sources/${sourceId}`).then((r) => r.data),
  // AI Chat & Generation
  chat:           (id: number, message: string) =>
                    api.post(`/notebooks/${id}/chat`, { message }).then((r) => r.data),
  generate:       (id: number, type: string) =>
                    api.post(`/notebooks/${id}/generate`, { type }).then((r) => r.data),
  // Behavior & Guidance
  trackBehavior: (id: number, eventType: string, eventPayload?: Record<string, unknown>) =>
                api.post(`/notebooks/${id}/behavior-events`, { eventType, eventPayload }).then((r) => r.data),
  adaptiveGuidance: (id: number) =>
                api.get(`/notebooks/${id}/adaptive-guidance`).then((r) => r.data),
};

// ─── Hackathons ────────────────────────────────────────────────────────────

export const hackathonsAPI = {
  list:     (params?: Record<string, string>) => api.get('/hackathons', { params }).then((r) => r.data),
  get:      (id: number)   => api.get(`/hackathons/${id}`).then((r) => r.data),
  register: (id: number)   => api.post(`/hackathons/${id}/register`).then((r) => r.data),
  trackBehavior: (id: number, eventType: string, eventPayload?: Record<string, unknown>) =>
                api.post(`/hackathons/${id}/behavior-events`, { eventType, eventPayload }).then((r) => r.data),
  adaptiveGuidance: (id: number) =>
                api.get(`/hackathons/${id}/adaptive-guidance`).then((r) => r.data),
};

// ─── Quizzes ───────────────────────────────────────────────────────────────

export const quizzesAPI = {
  trackBehavior: (id: number, eventType: string, eventPayload?: Record<string, unknown>) =>
                api.post(`/quiz/${id}/behavior-events`, { eventType, eventPayload }).then((r) => r.data),
  adaptiveGuidance: (id: number) =>
                api.get(`/quiz/${id}/adaptive-guidance`).then((r) => r.data),
};

// ─── Q&A ─────────────────────────────────────────────────────────────────────

export const qnaAPI = {
  listQuestions:  (params?: Record<string, string>) => api.get('/qna/questions', { params }).then((r) => r.data),
  searchQuestions: (q: string) => api.get('/qna/questions/search', { params: { q } }).then((r) => r.data),
  getQuestion:    (id: number) => api.get(`/qna/questions/${id}`).then((r) => r.data),
  askQuestion:    (body: { title: string; body: string; domain: string; tags: string[] }) =>
                    api.post('/qna/questions', body).then((r) => r.data),
  postAnswer:     (questionId: number, body: string) =>
                    api.post(`/qna/questions/${questionId}/answers`, { body }).then((r) => r.data),
  vote:           (questionId: number, targetId: number, targetType: 'question' | 'answer', voteType: 'up' | 'down') =>
                    api.post(`/qna/questions/${questionId}/vote`, { targetId, targetType, voteType }).then((r) => r.data),
  acceptAnswer:   (questionId: number, answerId: number) =>
                    api.post(`/qna/questions/${questionId}/answers/${answerId}/accept`).then((r) => r.data),
  listTags:       () => api.get('/qna/tags').then((r) => r.data),
};

// ─── Repositories ─────────────────────────────────────────────────────────────

export const reposAPI = {
  getUserRepos:   (username: string) => api.get(`/repositories/${username}`).then((r) => r.data),
  getRepo:        (username: string, slug: string) => api.get(`/repositories/${username}/${slug}`).then((r) => r.data),
  getFile:        (repoId: number, path: string) =>
                    api.get(`/repositories/${repoId}/files`, { params: { path } }).then((r) => r.data),
  createRepo:     (body: { name: string; description?: string; visibility: string }) =>
                    api.post('/repositories', body).then((r) => r.data),
  createCommit:   (repoId: number, body: { message: string; files: { path: string; content: string }[] }) =>
                    api.post(`/repositories/${repoId}/commits`, body).then((r) => r.data),
  listIssues:     (repoId: number) => api.get(`/repositories/${repoId}/issues`).then((r) => r.data),
  createIssue:    (repoId: number, body: { title: string; body: string }) =>
                    api.post(`/repositories/${repoId}/issues`, body).then((r) => r.data),
  listPRs:        (repoId: number) => api.get(`/repositories/${repoId}/pulls`).then((r) => r.data),
  createPR:       (repoId: number, body: { title: string; body: string; sourceBranch: string; targetBranch: string }) =>
                    api.post(`/repositories/${repoId}/pulls`, body).then((r) => r.data),
  toggleStar:     (repoId: number) => api.post(`/repositories/${repoId}/star`).then((r) => r.data),
};

// ─── Certificates ────────────────────────────────────────────────────────────

export const certificatesAPI = {
  mine:    ()              => api.get('/certificates/me').then((r) => r.data),
  verify:  (id: string)    => api.get(`/certificates/verify/${id}`).then((r) => r.data),
  issue:   (body: { userId: number; trackId: number; templateId: number }) =>
             api.post('/certificates/issue', body).then((r) => r.data),
};

// ─── Organizations ────────────────────────────────────────────────────────────

export const orgsAPI = {
  list:           (params?: Record<string, string>) => api.get('/organizations', { params }).then((r) => r.data),
  get:            (slug: string) => api.get(`/organizations/${slug}`).then((r) => r.data),
  create:         (body: { name: string; slug: string; orgType: string; description?: string }) =>
                    api.post('/organizations', body).then((r) => r.data),
  invite:         (orgId: number, userId: number, role?: string) =>
                    api.post(`/organizations/${orgId}/members`, { userId, role }).then((r) => r.data),
  talentPool:     (orgId: number) => api.get(`/organizations/${orgId}/talent`).then((r) => r.data),
  joinTalentPool: (orgId: number, body: { skills: string[]; score: number }) =>
                    api.post(`/organizations/${orgId}/talent`, body).then((r) => r.data),
  listChallenges: ()              => api.get('/organizations/challenges').then((r) => r.data),
  createChallenge: (orgId: number, body: { title: string; description: string; domain: string; prizePool: string; deadline: string }) =>
                    api.post(`/organizations/${orgId}/challenges`, body).then((r) => r.data),
};

// ─── Daily Quiz ───────────────────────────────────────────────────────────────

export const dailyQuizAPI = {
  domains: ()              => api.get('/daily-quiz/domains').then((r) => r.data),
  getQuiz: (domain: string) => api.get(`/daily-quiz/${encodeURIComponent(domain)}`).then((r) => r.data),
};

// ─── Gamification ────────────────────────────────────────────────────────────

export const gamificationAPI = {
  achievements: () => api.get('/gamification/achievements').then((r) => r.data),
  leaderboard:  (limit?: number) =>
    api.get('/gamification/leaderboard', { params: limit ? { limit } : undefined }).then((r) => r.data),
};

// ─── Exercises ───────────────────────────────────────────────────────────────

export const exercisesAPI = {
  list: (params?: { domain?: string; search?: string; sort?: string; page?: number; limit?: number }) =>
    api.get('/exercises', { params }).then((r) => r.data),
  get:  (id: string | number) => api.get(`/exercises/${id}`).then((r) => r.data),
};

// ─── AI Services ─────────────────────────────────────────────────────────────

export const aiAPI = {
  chat:           (prompt: string, maxTokens?: number) =>
                    api.post('/ai/chat', { prompt, max_new_tokens: maxTokens }).then((r) => r.data),
  generateQuiz:   (topic: string, count = 5) =>
                    api.post('/ai/quiz', { topic, count }).then((r) => r.data),
  reviewCode:     (code: string, language: string) =>
                    api.post('/ai/review', { code, language }).then((r) => r.data),
  generatePath:   (goal: string, currentSkills: string[]) =>
                    api.post('/ai/learning-path', { goal, current_skills: currentSkills }).then((r) => r.data),
};
