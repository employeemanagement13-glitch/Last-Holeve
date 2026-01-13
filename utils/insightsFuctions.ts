// utils/fetchInsightsClient.ts
import { ProjectData } from "@/types/datatypes";

const INSIGHTS_IMAGES_BUCKET = "insight-images";
const PLACEHOLDER_IMAGE = "/placeholder-image.jpg";

/**
 * Get public URL for an image stored in Supabase storage
 */
function getImageUrl(supabase: any, imagePath: string | null): string {
  if (!imagePath) return PLACEHOLDER_IMAGE;
  
  // If already a full URL, return as is
  if (typeof imagePath === "string" && imagePath.startsWith("http")) {
    return imagePath;
  }
  
  // Try to get public URL from Supabase storage
  try {
    const { data: storageData } = supabase.storage
      .from(INSIGHTS_IMAGES_BUCKET)
      .getPublicUrl(imagePath);
    
    if (storageData?.publicUrl) {
      return storageData.publicUrl;
    }
    
    // Fallback to placeholder
    return PLACEHOLDER_IMAGE;
  } catch (e) {
    console.error("Error getting image URL:", e);
    return PLACEHOLDER_IMAGE;
  }
}

/**
 * Parse JSON fields from insight data
 */
function parseInsightFields(insight: any): any {
  return {
    ...insight,
    fact: typeof insight.fact === 'string' ? JSON.parse(insight.fact) : insight.fact,
    content: typeof insight.content === 'string' ? JSON.parse(insight.content) : insight.content,
    centeredcontent: typeof insight.centeredcontent === 'string' 
      ? JSON.parse(insight.centeredcontent) 
      : insight.centeredcontent
  };
}

/**
 * Fetch insights and map them to ProjectData format (id, imageUrl, title, link)
 */
export async function fetchInsightsAsProjects(
  supabase: any, 
  limit: number = 8
): Promise<ProjectData[]> {
  try {
    const { data: rows, error } = await supabase
      .from("insights")
      .select("id, title, centeredimage, cmpdate, category")
      .order("cmpdate", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Fetch insights error:", error);
      throw error;
    }

    if (!rows || rows.length === 0) {
      return [];
    }

    // Map to ProjectData format
    const projects: ProjectData[] = rows.map((insight: any, index: number) => {
      // Use the index as numerical ID, or you can use the database ID
      // Since your example uses numbers 1,2,3,4, we'll use index + 1
      // But we'll also keep the database ID available if needed
      const projectId = insight.id; // Using database UUID as string
      
      // Get the centered image URL
      const imageUrl = getImageUrl(supabase, insight.centeredimage);
      
      return {
        id: projectId, // or use: (index + 1) for numerical IDs like your example
        imageUrl: imageUrl,
        title: insight.title || "",
        link: `/insights/${insight.id}` // Format as /insights/insight.id
      };
    });

    return projects;
  } catch (error) {
    console.error("Error in fetchInsightsAsProjects:", error);
    return [];
  }
}

/**
 * Fetch and cache first 8 insights as ProjectData format
 */
export async function initializeInsightsFromClients(supabase: any): Promise<ProjectData[]> {
  try {
    const projects = await fetchInsightsAsProjects(supabase, 8);
    console.log(`Fetched ${projects.length} insights for clients section`);
    return projects;
  } catch (error) {
    console.error("Failed to initialize insights from clients:", error);
    return [];
  }
}