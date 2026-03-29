import type { Job } from '../App';

const API_BASE_URL = 'http://localhost:8080/api';

export interface AIAnalysisResponse {
    matchScore: number;
    missingSkills: string[];
    hiringVerdict: string;
}

export const api = {
    async fetchStudents(): Promise<Job[]> {
        const response = await fetch(`${API_BASE_URL}/students`);
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        return data.map((student: any) => ({
            ...student,
            id: student.id.toString(),
            skills: student.skills ? student.skills.split(',').map((s: string) => s.trim()) : []
        }));
    },

    async addStudent(student: Omit<Job, 'id'>): Promise<Job> {
        const payload = {
            ...student,
            skills: student.skills.join(',')
        };
        const response = await fetch(`${API_BASE_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to add student');
        const data = await response.json();
        return {
            ...data,
            id: data.id.toString(),
            skills: data.skills ? data.skills.split(',').map((s: string) => s.trim()) : []
        };
    },

    async analyzeStudent(studentId: string, jobDescription: string): Promise<AIAnalysisResponse> {
        const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId: parseInt(studentId), jobDescription })
        });
        if (!response.ok) throw new Error('Failed to analyze student');
        return response.json();
    }
};
