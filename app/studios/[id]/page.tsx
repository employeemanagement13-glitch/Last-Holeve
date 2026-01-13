import FeatureBlock from '@/Components/General/FeatureBlock'
import ParallelCards from '@/Components/General/ParallelCards'
import { ImageContentBlock } from '@/Components/insights/FullImage'
import SayHello from '@/Components/studios/SayHello'
import { notFound } from 'next/navigation'
import { supabase } from '@/utils/supabaseClient'
import ParallelContent from '@/Components/Home/ParallelContent'

// Define types for the studio data
type StudioData = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectname: string;
  location: string;
  phone: string[];
  socials: {
    facebook: string;
    x: string;
    instagram: string;
    linkedin: string;
  };
  content: Array<{
    id: string;
    image?: string;
    title: string;
    description: string;
  }>;
  leaders: Array<{
    id: string;
    image?: string;
    name: string;
    designation: string;
    link: string;
  }>;
};

// Define type for work data
type WorkData = {
  id: string;
  title: string;
  location: string;
  projectimage: string;
  // Add other work fields as needed
};

// Fetch studio data from database
async function getStudio(id: string): Promise<StudioData | null> {
  try {
    const { data, error } = await supabase
      .from('studios')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('Error fetching studio:', error)
      return null
    }

    // Parse JSON fields if they're stored as strings
    const studio = {
      ...data,
      socials: typeof data.socials === 'string' ? JSON.parse(data.socials) : data.socials,
      content: typeof data.content === 'string' ? JSON.parse(data.content) : data.content,
      leaders: typeof data.leaders === 'string' ? JSON.parse(data.leaders) : data.leaders,
    } as StudioData

    return studio
  } catch (error) {
    console.error('Failed to fetch studio:', error)
    return null
  }
}

// Fetch works by studio ID from works table
async function getWorksByStudioId(studioid: string): Promise<WorkData[]> {
  try {
    const { data, error } = await supabase
      .from('works')
      .select('id, title, location, projectimage')
      .eq('studioid', studioid)
      .order('cmpdate', { ascending: false })

    if (error) {
      console.error('Error fetching works by studio:', error)
      return []
    }

    return data as WorkData[]
  } catch (error) {
    console.error('Failed to fetch works:', error)
    return []
  }
}

// Transform socials object to array format for ImageContentBlock
function transformSocials(socials: StudioData['socials']) {
  const socialImages = []

  if (socials.facebook) {
    socialImages.push({
      platform: "facebook",
      image: "/Socials/Facebook.png",
      link: socials.facebook
    })
  }

  if (socials.x) {
    socialImages.push({
      platform: "x",
      image: "/Socials/Twitter.png",
      link: socials.x
    })
  }

  if (socials.instagram) {
    socialImages.push({
      platform: "instagram",
      image: "/Socials/Instagram.png",
      link: socials.instagram
    })
  }

  if (socials.linkedin) {
    socialImages.push({
      platform: "linkedin",
      image: "/Socials/Linkedin.png",
      link: socials.linkedin
    })
  }

  return socialImages
}

// Transform content items for FeatureBlock
function transformContentItem(contentItem: StudioData['content'][0], index: number, supabaseUrl: string) {
  return {
    id: contentItem.id,
    title: contentItem.title,
    imageUrl: contentItem.image 
      ? `${supabaseUrl}/storage/v1/object/public/studio-images/${contentItem.image}`
      : '/fallback-content.jpg',
    imageAlt: contentItem.title,
    paragraph: contentItem.description,
    layout: index % 2 === 0 ? 'left' : 'right' as 'left' | 'right',
    bright: false,
    className: "",
  }
}

// Transform leaders to ParallelCards format
function transformLeaders(leaders: StudioData['leaders'], supabaseUrl: string) {
  return leaders.map(leader => ({
    id: leader.id,
    imageUrl: leader.image
      ? `${supabaseUrl}/storage/v1/object/public/studio-images/${leader.image}`
      : '/fallback-leader.jpg',
    title: leader.name,
    subtitle: leader.designation,
    link: leader.link || '#'
  }))
}

// Transform works to ParallelCards format
function transformWorks(works: WorkData[], supabaseUrl: string) {
  return works.map(work => ({
    id: work.id,
    imageUrl: work.projectimage
      ? `${supabaseUrl}/storage/v1/object/public/work-images/${work.projectimage}`
      : '/fallback-work.jpg',
    title: work.title,
    subtitle: work.location,
    link: `/work/${work.id}`
  }))
}

interface PageProps {
  params: {
    id: string
  }
}

const StudioPage = async ({ params }: PageProps) => {
  const { id } = await params;
  
  // Fetch studio and works in parallel for better performance
  const [studio, works] = await Promise.all([
    getStudio(id),
    getWorksByStudioId(id)
  ])

  if (!studio) {
    notFound()
  }

  // Get Supabase URL from environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

  // Transform socials for ImageContentBlock
  const socialImages = transformSocials(studio.socials)

  // Prepare contact info for SayHello
  const contactInfo = {
    name: studio.projectname || "Say hello",
    location: studio.location,
    phoneNumber: studio.phone.length > 0
      ? studio.phone.map(phone => `t ${phone}`).join('\n')
      : "Contact us"
  }

  // Prepare full image URL for main studio image
  const mainImageUrl = studio.imageUrl
    ? `${supabaseUrl}/storage/v1/object/public/studio-images/${studio.imageUrl}`
    : '/Purpose/team1.jpg'

  // Transform works for ParallelCards
  const workItems = transformWorks(works, supabaseUrl)

  return (
    <div>
      <div className="min-h-screen w-full">
        <ImageContentBlock
          imageSrc={mainImageUrl}
          heading={`Welcome to our ${studio.title} Studio`}
          paragraph={studio.description}
          socials={true}
          socialImages={socialImages}
          wrapperClass="max-w-full mx-auto rounded-2xl pb-16"
          paragraphClass="text-lg text-[#1A1A1A]"
          headingClass="parallelheading"
          contentClass="md:px-20 px-4"
          bg=""
        />
      </div>

      <section className="min-h-fit bg-white p-8 sm:p-12 md:p-16 lg:p-24 flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          <SayHello
            data={contactInfo}
            imageUrl={mainImageUrl}
            imageAlt={`Our office in ${studio.title}`}
          />
        </div>
      </section>

      {/* Render FeatureBlocks for each content item */}
      {studio.content.map((contentItem, index) => {
        const featureBlockProps = transformContentItem(contentItem, index, supabaseUrl)
        return (
          <FeatureBlock
            key={contentItem.id}
            {...featureBlockProps}
          />
        )
      })}

      {/* Our Leadership */}
      {studio.leaders.length > 0 && (
        <ParallelCards
          projects={transformLeaders(studio.leaders, supabaseUrl)}
          title={`Our ${studio.title} Leadership`}
          subtitle=""
          className="w-full mx-auto"
        />
      )}

      {/* Work By Studio - Now fetched from works table */}
      {works.length > 0 && (
        <div className="py-12 md:py-20">
          <ParallelCards
            projects={workItems}
            title={`Work By ${studio.title}`}
            subtitle={`${works.length} project${works.length > 1 ? 's' : ''} completed`}
            className="w-full mx-auto"
          />
        </div>
      )}

      {/* Optional: Show message if no works found */}
      {works.length === 0 && (
        <ParallelContent title={`Work By ${studio.title}`} subtitle={`${works.length} project${works.length > 1 ? 's' : ''} completed`}  /> 
      )}
    </div>
  )
}

export default StudioPage