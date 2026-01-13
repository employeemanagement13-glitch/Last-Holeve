"use client"
import React, { useEffect, useState } from 'react'
import ParallelCards from '../General/ParallelCards'
import { getInsightsFromClients } from '@/lib/data';
import { supabase } from '@/utils/supabaseClient';
import { ProjectData } from '@/types/datatypes';

const Insights = () => {
    const [insights, setInsights] = useState<ProjectData[]>([]);
       const [loading, setLoading] = useState(true);
      useEffect(() => {
        async function loadInsights() {
          setLoading(true);
          try {
            // Get the first 8 insights in ProjectData format
            const data = await getInsightsFromClients(supabase);
            setInsights(data);
          } catch (error) {
            console.error("Failed to load insights:", error);
          }
          setLoading(false);
        }
    
        loadInsights();
      }, []);
      
  return (
    <ParallelCards projects={insights} title="Insights From Clients" subtitle="Explore our diverse projects that showcase our quality and designs. " className="w-full mx-auto"/>
  )
}

export default Insights