// app/insights/[id]/page.tsx
import { notFound } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import FeatureBlock from '@/Components/General/FeatureBlock';
import HeroHeading from '@/Components/General/HeroHeading';
import { ImageContentBlock } from '@/Components/insights/FullImage';
import { getImageUrl } from '@/lib/fetch-insightsdata';

interface WorkInfo {
  client: string;
  size: string;
  cmpdate: string;
  sustainability: string;
}

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  console.log(id);
  
  try {
    // Fetch the insight by ID
    const { data: insight, error } = await supabase
      .from('insights')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !insight) {
      console.error('Error fetching insight:', error);
      notFound();
    }

    // Parse JSON fields
    const parsedInsight = {
      ...insight,
      fact: typeof insight.fact === 'string' ? JSON.parse(insight.fact) : insight.fact,
      content: typeof insight.content === 'string' ? JSON.parse(insight.content) : insight.content,
      centeredcontent: typeof insight.centeredcontent === 'string' 
        ? JSON.parse(insight.centeredcontent) 
        : insight.centeredcontent
    };

    // Format date
    const formattedDate = new Date(parsedInsight.cmpdate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Get image URLs
    const factImageUrl = parsedInsight.fact?.image 
      ? getImageUrl(supabase, parsedInsight.fact.image)
      : '/Purpose/team1.jpg';

    const centeredImageUrl = parsedInsight.centeredimage
      ? getImageUrl(supabase, parsedInsight.centeredimage)
      : '/Purpose/team1.jpg';

    // Work data
    const workdata: WorkInfo = {
      client: parsedInsight.reference || "Client Name",
      size: "Size not specified",
      cmpdate: formattedDate,
      sustainability: parsedInsight.category || "Category"
    };

    return (
      <div className='darkbg'>
        {/* Hero Section */}
        <div className='min-h-[85vh] w-full darkbg flex items-center justify-center'>
          <HeroHeading 
            text={parsedInsight.title || "Insight Title"} 
            className='w-[80%] h-[90vh] flex flex-col justify-center text-white' 
            headingclass='brightmainheading' 
            paragraph={parsedInsight.reference || ""}
            date={formattedDate}
            belongsto={parsedInsight.category || "Category"}
          />
        </div>

        {/* Fact Section */}
        <div className="min-h-screen py-16 w-full">
          <ImageContentBlock
            imageSrc={factImageUrl}
            paragraph={parsedInsight.fact?.boldtext || ""}
            wrapperClass="max-w-full mx-auto rounded-2xl pb-16"
            paragraphClass="text-3xl sm:text-4xl font-bold mb-6 leading-tight"
            contentClass="md:px-20 px-4"
          />
        </div>

        {/* Content Items - FeatureBlocks */}
        {parsedInsight.content && Array.isArray(parsedInsight.content) && parsedInsight.content.length > 0 && (
          <>
            {parsedInsight.content.map((item: any, index: number) => {
              // Get image URL for content item
              const itemImageUrl = item.image 
                ? getImageUrl(supabase, item.image)
                : '/Purpose/team1.jpg';

              // Determine layout with explicit type
              const layout: "left" | "right" = index % 2 === 0 ? 'left' : 'right';
              
              // Map content item to FeatureBlock props
              const featureBlockProps = {
                title: item.title || "",
                subheading: parsedInsight.category || "",
                paragraph: item.description || "",
                imageUrl: itemImageUrl,
                imageAlt: item.title || "Content image",
                readMoreLink: ``,
                readMoreText: "",
                layout: layout,
                bright: false as const // Add this to ensure TypeScript knows it's false
              };

              return (
                <FeatureBlock
                  key={item.id || index} 
                  {...featureBlockProps} 
                  className="" 
                  bright={false}
                />
              );
            })}
          </>
        )}

        {/* Centered Content Items */}
        {parsedInsight.centeredcontent && Array.isArray(parsedInsight.centeredcontent) && parsedInsight.centeredcontent.length > 0 && (
          <>
            {parsedInsight.centeredcontent.map((item: any, index: number) => {
              // Get image URL for centered content item
              const itemImageUrl = item.image 
                ? getImageUrl(supabase, item.image)
                : '/Purpose/team1.jpg';

              return (
                <div key={item.id || index} className="min-h-screen w-full py-16">
                  <ImageContentBlock
                    imageSrc={itemImageUrl}
                    heading={item.title || ""}
                    paragraph={item.description || ""}
                    wrapperClass="max-w-full mx-auto rounded-2xl pb-16"
                    paragraphClass="text-lg font-semibold mb-2"
                    headingClass="text-3xl sm:text-4xl font-bold mb-6 leading-tight text-white"
                    contentClass="md:px-20 px-4"
                    workdata={index === 0 ? workdata : undefined}
                  />
                </div>
              );
            })}
          </>
        )}

        {/* Fallback */}
        {(!parsedInsight.centeredcontent || parsedInsight.centeredcontent.length === 0) && (
          <div className="min-h-screen w-full py-16">
            <ImageContentBlock
              imageSrc={centeredImageUrl}
              heading="Additional Insights"
              paragraph="Explore more about this topic and related research in our comprehensive analysis."
              wrapperClass="max-w-full mx-auto rounded-2xl pb-16"
              paragraphClass="text-lg font-semibold mb-2"
              headingClass="text-3xl sm:text-4xl font-bold mb-6 leading-tight text-white"
              contentClass="md:px-20 px-4"
              workdata={workdata}
            />
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error in insight page:', error);
    notFound();
  }
};

export default page;