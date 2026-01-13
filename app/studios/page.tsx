import HeroHeading from '@/Components/General/HeroHeading'
import ParallelCards from '@/Components/General/ParallelCards'
import { supabase } from '@/utils/supabaseClient';
// Define the ProjectData type for ParallelCards
type ProjectData = {
  id: string | number;
  imageUrl: string;
  title: string;
  link: string;
  // Add other fields if ParallelCards expects them
};

// Fetch studios from database
async function getStudios(): Promise<ProjectData[]> {
  try {
    
    const { data, error } = await supabase
      .from('studios')
      .select('id, title, imageUrl')
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching studios:', error)
      return []
    }
    
    // Transform the data to match ProjectData structure
    const studios: ProjectData[] = data.map(studio => ({
      id: studio.id,
      title: studio.title,
      // Construct full image URL from Supabase storage
      imageUrl: studio.imageUrl 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/studio-images/${studio.imageUrl}`
        : '/fallback-image.jpg', // Provide a fallback image if needed
      link: `/studios/${studio.id}`
    }))
    
    return studios
  } catch (error) {
    console.error('Failed to fetch studios:', error)
    return []
  }
}

const StudiosPage = async () => {
  // Fetch studios on the server side
  const studios = await getStudios()
  
  return (
    <div>
      <div className='min-h-[85vh] w-full darkbg flex items-center justify-center'>
        <HeroHeading 
          text="With studio cultures unique to their place and people, we're the smallest 'big firm' out there."  
          className='w-[80%] justify-center' 
          headingclass='brightmainheading'
        />
      </div>

      <ParallelCards 
        projects={studios} 
        title="Our Studios" 
        subtitle="" 
        className="w-full mx-auto darkbg"
      />
    </div>
  )
}

export default StudiosPage