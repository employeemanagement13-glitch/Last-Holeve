export type InsightCardData = {
  id: number | string;
  category: string;
  headline: string;
  imageSrc: string;
  topic: string;
  link: string;
  theme: string;
};

const INSIGHTS_IMAGES_BUCKET = "insight-images";
const PLACEHOLDER_IMAGE = "https://placehold.co/400x280/121212/FFFFFF?text=Insight";

/**
 * Mapping function to categorize insights by topic
 */
const getTopicFromCategory = (category: string): string => {
  const topicMap: Record<string, string> = {
    "Technology": "Technology",
    "Tech": "Technology",
    "AI": "Technology",
    "Artificial Intelligence": "Technology",
    "Environment": "Environment",
    "Climate": "Environment",
    "Sustainability": "Environment",
    "Urban": "Urbanism",
    "Urbanism": "Urbanism",
    "Design": "Design",
    "Architecture": "Design",
    "Engineering": "Engineering",
    "Health": "Health",
    "Healthcare": "Health",
    "Medical": "Health",
  };
  
  return topicMap[category] || category || "General";
};

/**
 * Mapping function to get theme from category/topic
 */
const getThemeFromCategory = (category: string, topic: string): string => {
  // You can customize this mapping based on your needs
  const themeMap: Record<string, string> = {
    "Technology": "Future",
    "AI": "Future",
    "Environment": "Sustainability",
    "Climate": "Sustainability",
    "Urbanism": "Community",
    "Design": "Heritage",
    "Architecture": "Heritage",
    "Engineering": "Future",
    "Health": "Sustainability",
  };
  
  return themeMap[topic] || themeMap[category] || "Innovation";
};

/**
 * Get public URL for an image stored in Supabase storage
 */
// utils/image-utils.ts
export function getImageUrl(supabase: any, imagePath: string | null): string {
  if (!imagePath) return '/Purpose/team1.jpg'; // Default fallback image
  
  // If already a full URL, return as is
  if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Try to get public URL from Supabase storage
  try {
    const { data: storageData } = supabase.storage
      .from('insight-images')
      .getPublicUrl(imagePath);
    
    if (storageData?.publicUrl) {
      return storageData.publicUrl;
    }
    
    return '/Purpose/team1.jpg'; // Fallback image
  } catch (e) {
    console.error('Error getting image URL:', e);
    return '/Purpose/team1.jpg'; // Fallback image
  }
}

// Helper to get all image URLs from an insight
export async function getInsightImageUrls(supabase: any, insight: any) {
  const parsedInsight = {
    ...insight,
    fact: typeof insight.fact === 'string' ? JSON.parse(insight.fact) : insight.fact,
    content: typeof insight.content === 'string' ? JSON.parse(insight.content) : insight.content,
    centeredcontent: typeof insight.centeredcontent === 'string' 
      ? JSON.parse(insight.centeredcontent) 
      : insight.centeredcontent
  };

  const imageUrls = {
    centeredImage: getImageUrl(supabase, parsedInsight.centeredimage),
    factImage: parsedInsight.fact?.image ? getImageUrl(supabase, parsedInsight.fact.image) : '/Purpose/team1.jpg',
    contentImages: parsedInsight.content?.map((item: any) => 
      item.image ? getImageUrl(supabase, item.image) : '/Purpose/team1.jpg'
    ) || [],
    centeredContentImages: parsedInsight.centeredcontent?.map((item: any) => 
      item.image ? getImageUrl(supabase, item.image) : '/Purpose/team1.jpg'
    ) || []
  };

  return imageUrls;
}

/**
 * Fetch insights and map them to INSIGHTS_CARD_DATA format
 */
export async function fetchInsightsCardData(
  supabase: any, 
  limit: number = 6
): Promise<InsightCardData[]> {
    try {
        const { data: rows, error } = await supabase
        .from("insights")
        .select("id, title, category, centeredimage, reference, cmpdate")
        //   .order("cmpdate", { ascending: false })
        .limit(limit);
        
        console.log(rows)
    if (error) {
      console.error("Fetch insights error:", error);
      throw error;
    }

    if (!rows || rows.length === 0) {
      return [];
    }

    
    // Map to INSIGHTS_CARD_DATA format
    const insightsCardData: InsightCardData[] = rows.map((insight: any, index: number) => {
        const topic = getTopicFromCategory(insight.category);
        const theme = getThemeFromCategory(insight.category, topic);
        
        return {
            id: insight.id, // Using database UUID as string
            category: insight.category || "Insight",
            headline: insight.title || "",
            imageSrc: getImageUrl(supabase, insight.centeredimage),
            topic: topic,
            link: `/insights/${insight.id}`, // or insight.reference if you want external links
            theme: theme,
        };
    });
    
    return insightsCardData;
} catch (error) {
    console.error("Error in fetchInsightsCardData:", error);
    return [];
  }
}