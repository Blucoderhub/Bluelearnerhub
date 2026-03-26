import { Request, Response } from 'express';
import { db } from '../db';
import { domains, specializations, courses, modules, labs } from '../db/schema';
import { eq } from 'drizzle-orm';

export const getAllDomains = async (req: Request, res: Response) => {
    try {
        const allDomains = await db.select().from(domains);
        res.json({ success: true, data: allDomains });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch domains', error: 'FETCH_DOMAINS_ERROR' });
    }
};

export const getDomainById = async (req: Request, res: Response) => {
    try {
        const domain = await db.select().from(domains).where(eq(domains.id, parseInt(req.params.id)));
        if (!domain.length) return res.status(404).json({ success: false, message: 'Domain not found', error: 'NOT_FOUND' });
        res.json({ success: true, data: domain[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch domain', error: 'FETCH_DOMAIN_ERROR' });
    }
};

export const getAllSpecializations = async (req: Request, res: Response) => {
    try {
        const allSpecs = await db.select().from(specializations);
        res.json({ success: true, data: allSpecs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch specializations', error: 'FETCH_SPECS_ERROR' });
    }
};

export const getSpecializationsByDomain = async (req: Request, res: Response) => {
    try {
        const specs = await db.select().from(specializations).where(eq(specializations.domainId, parseInt(req.params.domainId)));
        res.json({ success: true, data: specs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch specializations', error: 'FETCH_SPECS_ERROR' });
    }
};

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const pageNum = Math.max(1, parseInt(page as string) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));
        const offset = (pageNum - 1) * limitNum;

        const [allCourses, countResult] = await Promise.all([
            db.select().from(courses).limit(limitNum).offset(offset),
            db.select({ count: courses.id }).from(courses)
        ]);

        const total = countResult.length;

        res.json({
            success: true,
            data: {
                data: allCourses,
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch courses', error: 'FETCH_COURSES_ERROR' });
    }
};

export const getCoursesBySpecialization = async (req: Request, res: Response) => {
    try {
        const specializationCourses = await db.select().from(courses).where(eq(courses.specializationId, parseInt(req.params.specId)));
        res.json({ success: true, data: specializationCourses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch courses', error: 'FETCH_COURSES_ERROR' });
    }
};

export const getCourseById = async (req: Request, res: Response) => {
    try {
        const course = await db.select().from(courses).where(eq(courses.id, parseInt(req.params.id)));
        if (!course.length) return res.status(404).json({ success: false, message: 'Course not found', error: 'NOT_FOUND' });
        res.json({ success: true, data: course[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch course', error: 'FETCH_COURSE_ERROR' });
    }
};

export const getModulesByCourse = async (req: Request, res: Response) => {
    try {
        const courseModules = await db.select().from(modules).where(eq(modules.courseId, parseInt(req.params.courseId)));
        res.json({ success: true, data: courseModules });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch modules', error: 'FETCH_MODULES_ERROR' });
    }
};

export const getProjectsByModule = async (req: Request, res: Response) => {
    try {
        const moduleLabs = await db.select().from(labs).where(eq(labs.moduleId, parseInt(req.params.moduleId)));
        res.json({ success: true, data: moduleLabs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch projects', error: 'FETCH_PROJECTS_ERROR' });
    }
};
