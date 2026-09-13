import {randomUUID} from 'crypto';
import {Project} from '../types/models.js';

const projects: Project[] =[];

export function getAllProjects(): Project[] {
    return projects;
}


interface CreateProjectData{
    name: string;
    description: string;
}

export function getProjectById(id: string): Project | undefined {
    return projects.find((project) => project.id === id);
}


interface UpdateProjectData {
    name?: string;
    description?:string;
}

export function updateProject(id:string,data: UpdateProjectData) : Project | undefined {

    const project =projects.find((p) => p.id === id);
    if (!project){
        return undefined;
    }
    if(data.name !== undefined){
        project.name = data.name;
    }
    if(data.description !== undefined){
        project.description = data.description;
    }
    project.updatedAt = new Date();
    return project;

}

export function deleteProject(id: string): boolean{
    const index = projects.findIndex((p) => p.id === id)
    if(index === -1) return false;

    projects.splice(index,1);
    return true;
}

export function createProject(data: CreateProjectData): Project {
    const newProject: Project = {
        id: randomUUID(),
        name: data.name,
        description: data.description,
        status: 'active',
        ownerId: 'temp-owner-id', // Placeholder for the owner ID
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    
    

    projects.push(newProject);
    return newProject;

    


    };