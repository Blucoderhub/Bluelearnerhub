import { Request, Response } from 'express';
import { db } from '../db';
import { domains, specializations, courses, modules, labs } from '../db/schema';
import { eq } from 'drizzle-orm';

export const getAllDomains = async (req: Request, res: Response) => {
    try {
        const allDomains = await db.select().from(domains);
        res.json(allDomains);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch domains' });
    }
};

export const getDomainById = async (req: Request, res: Response) => {
    try {
        const domain = await db.select().from(domains).where(eq(domains.id, parseInt(req.params.id)));
        if (!domain.length) return res.status(404).json({ error: 'Domain not found' });
        res.json(domain[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch domain' });
    }
};

export const getAllSpecializations = async (req: Request, res: Response) => {
    try {
        const allSpecs = await db.select().from(specializations);
        res.json(allSpecs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch specializations' });
    }
};

export const getSpecializationsByDomain = async (req: Request, res: Response) => {
    try {
        const specs = await db.select().from(specializations).where(eq(specializations.domainId, parseInt(req.params.domainId)));
        res.json(specs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch specializations' });
    }
};

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const allCourses = await db.select().from(courses);
        res.json(allCourses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
};

export const getCoursesBySpecialization = async (req: Request, res: Response) => {
    try {
        const specializationCourses = await db.select().from(courses).where(eq(courses.specializationId, parseInt(req.params.specId)));
        res.json(specializationCourses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
};

export const getCourseById = async (req: Request, res: Response) => {
    try {
        const course = await db.select().from(courses).where(eq(courses.id, parseInt(req.params.id)));
        if (!course.length) return res.status(404).json({ error: 'Course not found' });
        res.json(course[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch course' });
    }
};

export const getModulesByCourse = async (req: Request, res: Response) => {
    try {
        const courseModules = await db.select().from(modules).where(eq(modules.courseId, parseInt(req.params.courseId)));
        res.json(courseModules);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch modules' });
    }
};

export const getProjectsByModule = async (req: Request, res: Response) => {
    try {
        const moduleLabs = await db.select().from(labs).where(eq(labs.moduleId, parseInt(req.params.moduleId)));
        res.json(moduleLabs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};
