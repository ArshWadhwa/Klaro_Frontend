'use client';

import { useState, useEffect } from 'react';
import { FolderKanban, Search, Loader2, Users } from 'lucide-react';
import Link from 'next/link';
import { projectsApi } from '@/lib/api/projects.api';
import toast from 'react-hot-toast';
import { Project } from '@/types/project.types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectsApi.getUserProjects();
      setProjects(data);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = searchQuery
    ? projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Projects</h1>
          <p className="text-gray-500 mt-1">View all your projects across groups</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#131316] border border-[#1f1f23] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {!isLoading && filteredProjects.length === 0 && (
        <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-12 text-center">
          <FolderKanban className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'Try adjusting your search' : 'Projects are created within groups. Go to a group to create a project.'}
          </p>
          {!searchQuery && (
            <Link
              href="/groups"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Users className="h-5 w-5" />
              Go to Groups
            </Link>
          )}
        </div>
      )}

      {!isLoading && filteredProjects.length > 0 && (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-[#131316] border border-[#1f1f23] rounded-xl p-6 hover:border-[#2a2a2e] transition-colors">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FolderKanban className="h-6 w-6 text-blue-400" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                      {project.groupName && (
                        <p className="text-sm text-gray-500">{project.groupName}</p>
                      )}
                    </div>
                    <Link
                      href={`/projects/${project.id}`}
                      className="px-4 py-2 border border-[#1f1f23] rounded-lg text-gray-300 hover:bg-[#1a1a1d] hover:border-[#2a2a2e] transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                  
                  {project.description && (
                    <p className="text-gray-400 mb-4">{project.description}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <span>👤</span>
                      <span>Created by {project.createdBy}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>📅</span>
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
