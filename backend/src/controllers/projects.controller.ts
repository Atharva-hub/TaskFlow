import { Request, Response } from 'express';
import { getAllProjects, createProject, getProjectById, updateProject, deleteProject, } from '../services/projects.service.js';

export function handleGetAllProjects(req: Request, res: Response) {
  const projects = getAllProjects();
  res.json(projects);
}

export function handleGetProjectById(req:Request<{id:string}>, res: Response){
    const project = getProjectById(req.params.id);
    if(!project){
        res.status(404).json({message: 'Project not found'});
        return;
    }
    res.json(project);
}

interface UpdateProjectBody {
    name?: string;
    description?: string;
}

export function handleUpdateProject(req:Request<{id:string}, {}, UpdateProjectBody>, res: Response){
    const project = updateProject(req.params.id, req.body);
    if(!project){
        res.status(404).json({message: 'Project not found'});
        return;
    }
    res.json(project);
}

export function handleDeleteProject(req:Request<{id:string}>,res: Response){

    const wasDeleted = deleteProject(req.params.id);
    if(!wasDeleted){
        res.status(404).json({message: 'Project not found'});
        return;
    }
    res.status(204).send();

}

interface CreateProjectBody {
  name: string;
  description: string;
}

export function handleCreateProject(
  req: Request<{}, {}, CreateProjectBody>,
  res: Response
) {
  const { name, description } = req.body;
  const project = createProject({ name, description });
  res.status(201).json(project);
}