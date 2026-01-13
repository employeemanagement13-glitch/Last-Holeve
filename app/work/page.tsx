// app/works/page.tsx
import HeroHeading from '@/Components/General/HeroHeading'
import ParallelCards from '@/Components/General/ParallelCards'
import { getFeaturedWorks } from '@/lib/data';
import { supabase } from '@/utils/supabaseClient';

// Define the ProjectData type
type ProjectData = {
  id: string | number;
  imageUrl: string;
  title: string;
  link: string;
  subtitle?: string;
};

// Fetch people (leaders) from all studios
async function getFeaturedPeople(): Promise<ProjectData[]> {
  try {
    
    // Fetch studios with leaders
    const { data: studios, error } = await supabase
      .from('studios')
      .select('id, title, leaders')
      .limit(8)
    
    if (error) {
      console.error('Error fetching studios for people:', error)
      return []
    }
    
    const allPeople: ProjectData[] = []
    
    studios.forEach(studio => {
      try {
        const leaders = typeof studio.leaders === 'string' 
          ? JSON.parse(studio.leaders) 
          : studio.leaders
        
        if (Array.isArray(leaders)) {
          leaders.slice(0, 2).forEach(leader => { // Take max 2 leaders per studio
            if (leader && leader.name) {
              allPeople.push({
                id: leader.id || `${studio.id}-${leader.name}`,
                title: leader.name,
                subtitle: leader.designation,
                imageUrl: leader.image
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/studio-images/${leader.image}`
                  : '/fallback-person.jpg',
                link: leader.link || `/studios/${studio.id}`
              })
            }
          })
        }
      } catch (e) {
        console.error('Error parsing leaders for studio:', studio.id, e)
      }
    })
    
    // Shuffle and limit to 8 people
    return allPeople
      .sort(() => Math.random() - 0.5)
      .slice(0, 8)
    
  } catch (error) {
    console.error('Failed to fetch people:', error)
    return []
  }
}

const WorksPage = async () => {
  // Fetch data on the server side in parallel
  const [featuredWorks, featuredPeople] = await Promise.all([
    getFeaturedWorks(),
    getFeaturedPeople()
  ])
  
  return (
    <div>
      <div className='min-h-[90vh] w-full flex items-center justify-center'>
        <HeroHeading 
          text="Places that honor humanity." 
          className='w-[80%] justify-center' 
          headingclass='mainheading' 
        />
      </div>

      <ParallelCards 
        projects={featuredWorks} 
        title="Featured Work" 
        subtitle="" 
        className="w-full mx-auto" 
      />
      
      <ParallelCards 
        projects={featuredPeople} 
        title="People" 
        subtitle="" 
        className="w-full mx-auto darkbg" 
      />
    </div>
  )
}

export default WorksPage