"use client"
import React, { useEffect, useState } from 'react';
import ProjectSlider from './ProjectSlider';
import { supabase } from '@/utils/supabaseClient';
import { getFeaturedWorks } from '@/lib/data';
import { ProjectData } from '@/types/datatypes';



const OurMasterpieces: React.FC = () => {  
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const works = await getFeaturedWorks();
      setProjects(works);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-fit">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading projects...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">No projects found</div>
        </div>
      ) : (
        <ProjectSlider
          projects={projects} 
          title="Our Master Pieces" 
          subtitle="Explore our diverse projects that showcase our quality and designs."
        />
      )}
    </div>
  );
};

export default OurMasterpieces;