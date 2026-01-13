
import FeatureBlock from '@/Components/General/FeatureBlock'
import HeroHeading from '@/Components/General/HeroHeading'
import { ImageContentBlock } from '@/Components/insights/FullImage'
import Testimonial from '@/Components/Work/Testimonial'
import { supabase } from '@/utils/supabaseClient'
import { notFound } from 'next/navigation'

// Define the work data type
type WorkData = {
  id: string;
  title: string;
  location: string;
  projectimage: string;
  bannerImage: string;
  bannerheading: string;
  bannercontent: string;
  client: string;
  size: string;
  sustainability: string;
  cmpdate: string;
  people: Array<{
    id: string;
    name: string;
    designation: string;
    imageUrl?: string;
    link: string;
  }>;
  awards: string[];
  content: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    imageContent?: string;
  }>;
  noted: Array<{
    id: string;
    title: string;
    description: string;
    link: string;
    linkcontent: string;
  }>;
  centeredcontent: Array<{
    id: string;
    image?: string;
    title: string;
    description: string;
  }>;
  quote: {
    quotecontent: string;
    quotereference: string;
  };
};

// Fetch work data from database
async function getWork(id: string): Promise<WorkData | null> {
  try {
    
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error || !data) {
      console.error('Error fetching work:', error)
      return null
    }
    
    // Parse JSON fields if they're stored as strings
    const work = {
      ...data,
      people: typeof data.people === 'string' ? JSON.parse(data.people) : data.people,
      awards: typeof data.awards === 'string' ? JSON.parse(data.awards) : data.awards,
      content: typeof data.content === 'string' ? JSON.parse(data.content) : data.content,
      noted: typeof data.noted === 'string' ? JSON.parse(data.noted) : data.noted,
      centeredContent: typeof data.centeredContent === 'string' 
        ? JSON.parse(data.centeredContent) 
        : data.centeredContent,
      quote: typeof data.quote === 'string' ? JSON.parse(data.quote) : data.quote,
    } as WorkData
    
    return work
  } catch (error) {
    console.error('Failed to fetch work:', error)
    return null
  }
}

// Helper function to split quote reference
function splitQuoteReference(quotereference: string) {
  const parts = quotereference.split(',').map(part => part.trim())
  return {
    name: parts[0] || '',
    title: parts[1] || '',
    organization: parts[2] || ''
  }
}

// Transform content item to FeatureBlock props
function transformContentItem(item: WorkData['content'][0], index: number, supabaseUrl: string) {
  return {
    id: item.id,
    title: item.title,
    subheading: "",
    paragraph: item.description,
    imageUrl: item.imageUrl 
      ? `${supabaseUrl}/storage/v1/object/public/work-images/${item.imageUrl}`
      : '/fallback-content.jpg',
    imageAlt: item.title,
    readMoreLink: "",
    readMoreText: "",
    layout: index % 2 === 0 ? 'left' as const : 'right' as const,
    bright: true,
    imageinfo: item.imageContent || undefined
  }
}

interface PageProps {
  params: {
    id: string
  }
}

const WorkDetailPage = async ({ params }: PageProps) => {
  const { id } = await params
  const work = await getWork(id)
  
  if (!work) {
    notFound()
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  
  // Prepare work data for ImageContentBlock
  const workdata = {
    client: work.client,
    size: work.size,
    cmpdate: work.cmpdate,
    sustainability: work.sustainability,
  }
  
  // Prepare testimonial data
  const attributionParts = splitQuoteReference(work.quote.quotereference)
  const testimonialData = {
    quote: work.quote.quotecontent,
    attribution: {
      name: attributionParts.name,
      title: attributionParts.title,
      organization: attributionParts.organization
    }
  }
  
  // Main banner image URL
  const bannerImageUrl = work.bannerImage
    ? `${supabaseUrl}/storage/v1/object/public/work-images/${work.bannerImage}`
    : '/work/projectsubpage.webp' // Fallback
  
  return (
    <div>
      {/* Main Banner Section */}
      <div className="min-h-screen w-full">
        <ImageContentBlock
          imageSrc={bannerImageUrl}
          heading={work.title}
          paragraph={work.bannercontent}
          socials={true}
          work={true}
          wrapperClass="max-w-full mx-auto rounded-2xl pb-16"
          paragraphClass="text-lg text-[#1A1A1A]"
          headingClass="parallelheading"
          contentClass="md:px-20 px-4"
          workdata={workdata}
          bg=""
        />
      </div>
      
      {/* Content Items as FeatureBlocks */}
      {work.content.map((contentItem, index) => {
        const featureBlockProps = transformContentItem(contentItem, index, supabaseUrl)
        return (
          <FeatureBlock
            key={contentItem.id}
            {...featureBlockProps}
            className=""
          />
        )
      })}
      
      {/* HeroHeading and ImageContentBlock pairs from noted and centeredContent */}
      {work.noted.map((notedItem, index) => {
        const centeredItem = work.centeredcontent[index]
        
        return (
          <div key={`pair-${index}`}>
            {/* HeroHeading for noted item */}
            {notedItem && (
              <div className='min-h-[90vh] w-full flex items-center justify-center'>
                <HeroHeading 
                  text={notedItem.description} 
                  className='w-[80%] justify-center' 
                  headingclass='text-2xl sm:text-3xl md:text-4xl text-[#1A1A1A] font-bold mb-4 md:mb-0' 
                  belongsto={notedItem.title}
                />
              </div>
            )}
            
            {/* ImageContentBlock for centered content item */}
            {centeredItem && (
              <ImageContentBlock
                imageSrc={centeredItem.image 
                  ? `${supabaseUrl}/storage/v1/object/public/work-images/${centeredItem.image}`
                  : '/work/projectsubpage.webp'
                }
                heading={centeredItem.title}
                paragraph={centeredItem.description}
                wrapperClass="max-w-[50%] max-md:max-w-full mx-auto rounded-2xl pb-16"
                paragraphClass="text-lg text-[#1A1A1A]"
                headingClass="text-3xl sm:text-4xl text-[#1A1A1A] font-bold mb-4 md:mb-0"
                contentClass="md:px-20 px-4 flex flex-col items-center"
                bg=""
              />
            )}
          </div>
        )
      })}
      
      {/* If there are more centeredContent items than noted items */}
      {work.centeredcontent.length > work.noted.length && 
        work.centeredcontent.slice(work.noted.length).map((centeredItem, index) => (
          <div key={`extra-centered-${index}`}>
            <ImageContentBlock
              imageSrc={centeredItem.image 
                ? `${supabaseUrl}/storage/v1/object/public/work-images/${centeredItem.image}`
                : '/work/projectsubpage.webp'
              }
              heading={centeredItem.title}
              paragraph={centeredItem.description}
              wrapperClass="max-w-[50%] max-md:max-w-full mx-auto rounded-2xl pb-16"
              paragraphClass="text-lg text-[#1A1A1A]"
              headingClass="text-3xl sm:text-4xl text-[#1A1A1A] font-bold mb-4 md:mb-0"
              contentClass="md:px-20 px-4 flex flex-col items-center"
              bg=""
            />
          </div>
        ))
      }
      
      {/* Testimonial Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white">
        <div className="">
          <Testimonial
            quote={testimonialData.quote}
            attribution={testimonialData.attribution}
          />
        </div>
      </section>
    </div>
  )
}

export default WorkDetailPage