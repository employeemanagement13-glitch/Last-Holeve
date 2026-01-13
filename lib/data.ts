import { FeatureBlockProps, FeedbackItem, NavItem, ProjectData } from "@/types/datatypes";
import { fetchInsightsAsProjects } from "@/utils/insightsFuctions";
// import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { supabase } from "@/utils/supabaseClient";
import { fetchInsightsCardData, getImageUrl, InsightCardData } from "./fetch-insightsdata";
// Project Data for the Slider
export const projectData: ProjectData[] = [
    { id: 1, imageUrl: "/museum.jpg", title: "Heisenberg Museum, Hall", subtitle: "Heisenberg, Sweden", link: "museum" },
    { id: 2, imageUrl: "/house.jpg", title: "Lake House", subtitle: "North Pole", link: "lakehouse" },
    { id: 3, imageUrl: "/heisenbergcity.jpg", title: "Heisenberg City Library", subtitle: "Heisenberg, Sweden", link: "library" },
    { id: 4, imageUrl: "/heisenbergcity.jpg", title: "Heisenberg City Library", subtitle: "Heisenberg, Sweden", link: "library" },
];

 export const navItems: NavItem[] = [
    { name: "Work", link: "/work" },
    { name: "Insights", link: "/insights" },
    { name: "Purpose", link: "/purpose" },
    { name: "People", link: "/people" },
    { name: "Careers", link: "/careers" },
    { name: "Studios", link: "/studios" }
  ];

  
// Define company links
export const companyLinks = [
  { name: "Purpose", link: "/purpose" },
  { name: "Insights", link: "/insights" },
  { name: "People", link: "/people" },
  { name: "Careers", link: "/careers" },
  { name: "Studios", link: "/studios" }
];

// export const insightsfromclients: ProjectData[] = [
//     { id: 1, imageUrl: "/law.webp", title: "An international law firm brings the glowry of nature inside", link: "museum" },
//     { id: 2, imageUrl: "/3d.jpg", title: "Can landscape design help communities promote justice", link: "lakehouse" },
//     { id: 3, imageUrl: "/brutalism.jpg", title: "These community help growing cities maintain their identities", link: "library" },
//     { id: 4, imageUrl: "/3d.jpg", title: "Can landscape design help communities promote justice", link: "library" },
// ];

// Global variable to store first 8 insights from clients
export let insightsfromclients: ProjectData[] = [];

export async function refreshInsightsFromClients(supabase: any): Promise<void> {
  try {
    const data = await fetchInsightsAsProjects(supabase, 8);
    insightsfromclients = data;
    console.log(`Updated insightsfromclients with ${data.length} items`);
  } catch (error) {
    console.error("Error refreshing insights from clients:", error);
    insightsfromclients = [];
  }
}

/**
 * Get insights from clients (fetches if empty or forces refresh)
 */
export async function getInsightsFromClients(
  supabase: any, 
  forceRefresh: boolean = false
): Promise<ProjectData[]> {
  if (forceRefresh || insightsfromclients.length === 0) {
    await refreshInsightsFromClients(supabase);
  }
  return insightsfromclients;
}

/**
 * Get a single insight by ID
 */
export async function getInsightProjectById(
  supabase: any, 
  id: string
): Promise<ProjectData | null> {
  try {
    const { data, error } = await supabase
      .from("insights")
      .select("id, title, centeredimage")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("Error fetching insight by ID:", error);
      return null;
    }

    return {
      id: data.id,
      imageUrl: getImageUrl(supabase, data.centeredimage),
      title: data.title || "",
      link: `/insights/${data.id}`
    };
  } catch (error) {
    console.error("Error in getInsightProjectById:", error);
    return null;
  }
}

export const STATIC_INSIGHTS_CARD_DATA = [
  
];

/**
 * Get insights card data - dynamically fetches from database or uses fallback
 */
export async function getINSIGHTS_CARD_DATA(): Promise<InsightCardData[]> {
  try {
    // Try to fetch from Supabase
    const dynamicData = await fetchInsightsCardData(supabase, 6);
    
    if (dynamicData && dynamicData.length > 0) {
      // Merge dynamic data with static properties if needed
      return dynamicData.map((item, index) => ({
        ...item,
        // You can add any additional properties here if needed
      }));
    }
    
    // Fallback to static data
    console.warn("Using static insights card data - Supabase fetch failed");
    return STATIC_INSIGHTS_CARD_DATA;
  } catch (error) {
    console.error("Error fetching insights card data:", error);
    return STATIC_INSIGHTS_CARD_DATA;
  }
}

// Export as default for backward compatibility
export default STATIC_INSIGHTS_CARD_DATA;

// --- DATA MOCK ---
export const INSIGHTS_DATA = [
    {
        id: 1,
        imageSrc: "/insights/familycentered.avif",
        tag: "Head to Heart",
        headline:
            "50 years after opening, this building remains the paragon of family centered architectures.",
    },
    {
        id: 2,
        imageSrc: "/insights/urbanplanning.jpg",
        tag: "New Frontiers",
        headline:
            "How sustainable urban planning is changing the future of city living and development.",
    },
    {
        id: 3,
        imageSrc: "/insights/publicplaces.jpg",
        tag: "Design Theory",
        headline:
            "Exploring the brutalist movement and its unexpected resurgence in modern public spaces.",
    },
    {
        id: 4,
        imageSrc: "/insights/greenroofing.jpg",
        tag: "Sustainability",
        headline:
            "Innovations in green roofing technology reducing heat islands in major metropolitan areas.",
    },
    {
        id: 5,
        imageSrc: "/insights/historiclandmarks.webp",
        tag: "Heritage",
        headline:
            "The delicate balance of preservation and modernization in historic landmark restoration.",
    },
];





export const insight1: FeatureBlockProps = {
    title: "What would you say makes NIO different from other EV makers? ",
    subheading: "",
    paragraph: "NIO was born a global startup, with investors and teams from around the world. As early as 2015 when NIO was first founded, we set up the R&D and design teams in Munich, the advanced engineering team in Oxford, and the smart technology team in San Jose. Of course, our major teams are in Shanghai, Hefei, and Beijing. We hope to draw together the best talent worldwide to achieve a shared vision. Being a global startup has been one of our founding principles since the beginning.",
    imageUrl: "/career.jpg",
    imageAlt: "noone",
    readMoreLink: "",
    readMoreText: "",
    layout: 'left',
    bright: true,
};
export const insight2: FeatureBlockProps = {
    title: "What is now available in several European markets, Do you have similar plans to expand to US",
    subheading: "",
    paragraph: "Despite being one of the largest auto markets in the world, the U.S. has a relatively low penetration of smart EVs (compared with China’s new car penetration at over 50%). The biggest issue here is a lack of competition. If the supply of products increases, consumers only stand to benefit. The same goes to the whole industry. We would like to enter the U.S. market at the right time and in the right way.",
    imageUrl: "/career.jpg",
    imageAlt: "noone",
    readMoreLink: "",
    readMoreText: "",
    layout: 'right',
    bright: true,
};


// Then I want to create a table for studios having fields like : 
// title, description, socials { facebook: "", x: "", instagram: "", linkedin: ""} , proejectname, location, phone [ "", ""], content [{ image, title, description} may be multiple], leaders { image, name, designation, link } workby { image, name, location, link }. wants the code just like the previous ones. 
// Give me sql for its bucket and creating table of studios just like mentioned above. 
// Also give me a code fully working just like this : 


// Dummy Feedback Data for the Slider
export const feedbackData: FeedbackItem[] = [
    {
        id: 1,
        imageUrl: "/rooftaop.webp",
        feedbackText: "The merger effectively doubles the size of our New York City and Philadelphia studios, allowing us to respond to growing demand for high-end, amenity-rich office design in New York City and beyond in what Interior Design calls 'one of the more promising couplings in recent memory.' So tell us what do you need to know about it and about us.",
        readMoreLink: "#read-more-1",
        readMoreText: "Read here",
        author: "Jane Doe, CEO of TechCorp"
    },
    {
        id: 2,
        imageUrl: "/atlantis.jpg",
        feedbackText: "Their commitment to sustainability while maintaining aesthetic excellence is unparalleled. The new headquarters project exceeded all our expectations regarding both form and function. Highly recommended.",
        readMoreLink: "#read-more-2",
        readMoreText: "View Case Study",
        author: "John Smith, Head of Operations"
    },
    {
        id: 3,
        imageUrl: "/landscape.jpg",
        feedbackText: "Working with this team was a seamless experience. They captured our vision perfectly and delivered a master piece that truly defines modern living. A great partner for any ambitious project.",
        readMoreLink: "#read-more-3",
        readMoreText: "See Details",
        author: "Alice Johnson, Private Client"
    },
];


export const demo2Props: FeatureBlockProps = {
    title: "We've won five AIA national awards.",
    subheading: "News",
    paragraph: "From a sustainable workplace in Houston to a new station reconnecting Chicago’s West Side, these projects show how design can respond to community needs with creativity, care, and vision.",
    imageUrl: "/landscape.jpg",
    imageAlt: "noone",
    readMoreLink: "landscape",
    readMoreText: "Read here",
    layout: 'left',
    bright: true,
};
export const demo3Props: FeatureBlockProps = {
    title: "Book About the Collaborative Design Process.",
    subheading: "News",
    paragraph: "The mergend to growing demand for high-end, amenity-rich office design in New York City and beyond in what Interior Design calls “one of the more promising couplings in recent memory.",
    imageUrl: "/book.jpg",
    imageAlt: "noone",
    readMoreLink: "landscape",
    readMoreText: "Read here",
    layout: 'right',
    bright: true,
};
export const demo4Props: FeatureBlockProps = {
    title: "What our purpose is mentioned & what we deliver more engaging and interactive designs here. ",
    subheading: "Purpose",
    paragraph: "The mergend to growing demand for high-end, amenity-rich office design in New York City and beyond in what Interior Design calls “one of the more promising couplings in recent memory.”",
    imageUrl: "/printhouse.jpg",
    imageAlt: "noone",
    readMoreLink: "purpose",
    readMoreText: "Read here",
    layout: 'right',
    bright: true,
};

export const demo5Props: FeatureBlockProps = {
    title: "Design Your Career With Us.",
    subheading: "Career",
    paragraph: "We grow our firm by growing our people — if you are a recent graduate or a seasoned designer who believes in the power of design, we invite you to search for opportunities and explore how you can reimagine the future with us.",
    imageUrl: "/career.jpg",
    imageAlt: "noone",
    readMoreLink: "careers",
    readMoreText: "Join Our Team",
    layout: 'right',
    bright: true,
};

export const PurpseHeader: FeatureBlockProps = {
    title: "Our Guiding Purpose",
    subheading: "",
    paragraph: "We design to improve how people live, work, and connect. Each project challenges us to respond with sensitivity—environmentally, socially, and culturally. Our purpose is to shape spaces that foster community, health, and belonging.",
    imageUrl: "/purpose.jpeg",
    imageAlt: "noone",
    readMoreLink: "process",
    readMoreText: "Begin Process",
    layout: 'right',
    bright: true
};
export const listento: FeatureBlockProps = {
    title: "We Listen to Place",
    subheading: "",
    paragraph: "Every site carries memory, potential, and constraints. We begin by seeing, hearing, and learning—from the people, the land, and the environment. That deep listening shapes everything that follows.",
    imageUrl: "/hotel.jpg",
    imageAlt: "noone",
    readMoreLink: "",
    readMoreText: "",
    layout: 'left',
    bright: true
};
export const imaginepossibility: FeatureBlockProps = {
    title: "We Imagine Possibility",
    subheading: "",
    paragraph: "Ideas take form where insight meets exploration. We blend artistry, research, and experimentation to craft visions rooted in meaning.",
    imageUrl: "/team.jpg",
    imageAlt: "noone",
    readMoreLink: "",
    readMoreText: "",
    layout: 'right',
    bright: true
};

export const PurposeContent: FeatureBlockProps[] = [
    {
        title: "Our Guiding Purpose",
        subheading: "",
        paragraph: "We design to improve how people live, work, and connect. Each project challenges us to respond with sensitivity—environmentally, socially, and culturally. Our purpose is to shape spaces that foster community, health, and belonging.",
        imageUrl: "/purpose.jpeg",
        imageAlt: "noone",
        readMoreLink: "careers",
        readMoreText: "Begin Process",
        layout: 'right',
        bright: true
    },
    {
        title: "We Listen to Place",
        subheading: "",
        paragraph: "Every site carries memory, potential, and constraints. We begin by seeing, hearing, and learning—from the people, the land, and the environment. That deep listening shapes everything that follows.",
        imageUrl: "/hotel.jpg",
        imageAlt: "noone",
        readMoreLink: "",
        readMoreText: "",
        layout: 'left',
        bright: true
    },
    {
        title: "We Imagine Possibility",
        subheading: "",
        paragraph: "Ideas take form where insight meets exploration. We blend artistry, research, and experimentation to craft visions rooted in meaning.",
        imageUrl: "/team.jpg",
        imageAlt: "noone",
        readMoreLink: "",
        readMoreText: "",
        layout: 'right',
        bright: true
    },
    {
        title: "We Realize Form",
        subheading: "",
        paragraph: "Vision becomes space through craft. We work intimately with builders, engineers, and artisans so each detail expresses intention.",
        imageUrl: "/details.jpg",
        imageAlt: "noone",
        readMoreLink: "",
        readMoreText: "",
        layout: 'left',
        bright: true
    },
    {
        title: "We Amplify Impact",
        subheading: "",
        paragraph: "Architecture should uplift lives. We design for connection — to community, to nature, to shared experience.",
        imageUrl: "/beautifulcity.jpg",
        imageAlt: "noone",
        readMoreLink: "",
        readMoreText: "",
        layout: 'right',
        bright: true
    }

]

export const socialImages = [
    {
        image: "/Socials/Facebook.png",
        link: "https://facebook.com"
    },
    {
        image: "/Socials/Instagram.png",
        link: "https://instagram.com"
    },
    {
        image: "/Socials/Linkedin.png",
        link: "https://linkedin.com"
    },
    {
        image: "/Socials/Twitter.png",
        link: "https://twitter.com"
    },
]



export const images = [
    { id: 1, src: "/Purpose/headshot1.jpg", alt: "Portrait" },
    { id: 2, src: "/Purpose/team1.jpg", alt: "Team" },
    { id: 3, src: "/Purpose/team3.jpg", alt: "Brainstorm" },
    { id: 4, src: "/Purpose/team4.jpg", alt: "Office" },
    { id: 5, src: "/Purpose/team3.jpg", alt: "Celebration" },
    { id: 6, src: "/Purpose/team1.jpg", alt: "Work" },
];

export const studioinfo1: FeatureBlockProps = {
    title: "What is now available in several European markets, Do you have similar plans to expand to US",
    subheading: "",
    paragraph: "Despite being one of the largest auto markets in the world, the U.S. has a relatively low penetration of smart EVs (compared with China’s new car penetration at over 50%). The biggest issue here is a lack of competition. If the supply of products increases, consumers only stand to benefit. The same goes to the whole industry. We would like to enter the U.S. market at the right time and in the right way.",
    imageUrl: "/career.jpg",
    imageAlt: "noone",
    readMoreLink: "",
    readMoreText: "",
    layout: 'right',
    bright: true,
};
export const studioinfo2: FeatureBlockProps = {
    title: "What is now available in several European markets, Do you have similar plans to expand to US",
    subheading: "",
    paragraph: "Despite being one of the largest auto markets in the world, the U.S. has a relatively low penetration of smart EVs (compared with China’s new car penetration at over 50%). The biggest issue here is a lack of competition. If the supply of products increases, consumers only stand to benefit. The same goes to the whole industry. We would like to enter the U.S. market at the right time and in the right way.",
    imageUrl: "/career.jpg",
    imageAlt: "noone",
    readMoreLink: "",
    readMoreText: "",
    layout: 'left',
    bright: true,
};


export const studios: ProjectData[] = [
    { id: 1, imageUrl: "/studios/Atlanta.jpg", title: "Atlanta", link: "/studios/atlanta" },
    { id: 2, imageUrl: "/studios/Houston.webp", title: "Houston", link: "/studios/Houston" },
    { id: 3, imageUrl: "/studios/London.webp", title: "London", link: "/studios/London" },
    { id: 4, imageUrl: "/studios/Shangai.webp", title: "Shangai", link: "/studios/Shangai" },
];

export const londonLeadership: ProjectData[] = [
    { id: 1, imageUrl: "/studios/headshot1.webp", title: "Jordan Richard", link: "https://linkedin.com" },
    { id: 2, imageUrl: "/studios/headshot2.jpg", title: "Bon Saimon", link: "https://linkedin.com" },
    { id: 3, imageUrl: "/studios/headshot3.webp", title: "Baird Peter", link: "https://linkedin.com" },
    { id: 4, imageUrl: "/studios/headshot4.jpg", title: "Marks Rafael", link: "https://linkedin.com" },
];

export const workbylondon: ProjectData[] = [
    { id: 1, imageUrl: "/studios/150holborn.webp", title: "150 Holborn", link: "/studios/atlanta" },
    { id: 2, imageUrl: "/studios/ucl.webp", title: "University College London", link: "/studios/Houston" },
    { id: 3, imageUrl: "/studios/Houston.webp", title: "New QE|| Hospital", link: "/studios/London" },
    { id: 4, imageUrl: "/studios/Bishopsgate.webp", title: "280 Bishopsgate", link: "/studios/Shangai" },
];



export const greateststrength: FeatureBlockProps = {
    title: "Our greatest strength is you.",
    subheading: "",
    paragraph: "We know our most valuable asset is our people. That’s why we put people first—in everything we do. Happy, healthy individuals contribute to positive, high-performance teams. Your personal success is our collective success.",
    imageUrl: "/Purpose/team3.jpg",
    imageAlt: "noone",
    readMoreLink: "https://linkedin.com",
    readMoreText: "Browse Available Positions",
    layout: 'right',
    bright: true,
};



export const careersdata: FeatureBlockProps[] = [
    {
        title: "Your professional growth matters to us.",
        subheading: "",
        paragraph: "We believe everyone has the potential to be a great leader. So we’re committed to helping people realize that potential. Our Leadership Institute invites emerging leaders from around the firm to participate in a year-long program to strengthen and refine their leadership skills. With the mentorship of more seasoned staff, these rising stars follow a curriculum of activities that enhance their business savvy, sharpen their problem-solving skills, and bolster their emotional intelligence.",
        imageUrl: "/purpose.jpeg",
        imageAlt: "noone",
        readMoreLink: "",
        readMoreText: "",
        layout: 'right',
        bright: true
    },
    {
        title: "Supporting your health and well-being is a big deal to us.",
        subheading: "",
        paragraph: "We support the physical, financial, and emotional well-being of our colleagues so everyone can be at their best. Team members enjoy perks like gym discounts, wellness educational sessions, mental health resources, and prizes for winning the activity challenge during our annual “Wellness Week.” We also provide a public transportation subsidy to get you moving more sustainably.",
        imageUrl: "/hotel.jpg",
        imageAlt: "noone",
        readMoreLink: "",
        readMoreText: "",
        layout: 'left',
        bright: true
    },
    {
        title: "We encourage curiosity and nurture inquiring minds.",
        subheading: "",
        paragraph: "Sure, some might call us geeks. But we take that as a compliment. We’re proud of our culture of curiosity, and we go the extra mile to keep it flourishing. One way we do that is through our Innovation Incubator which awards micro-grants to self-organized teams interested in researching a specific aspect of design. By nurturing idea exploration, we grease the wheels for creative problem-solving.",
        imageUrl: "/team.jpg",
        imageAlt: "noone",
        readMoreLink: "",
        readMoreText: "",
        layout: 'right',
        bright: true
    }
]

export const offerings: FeatureBlockProps = {
    title: "Come design a better, more beautiful world with us.",
    subheading: "",
    paragraph: "Come create a world that restores, nurtures, and protects life on our planet through sustainability, resilience, diversity, inclusion, well-being, and programs that give back to our communities. Be part of some of something bigger.",
    imageUrl: "/career/company.webp",
    imageAlt: "noone",
    readMoreLink: "https://linkedin.com",
    readMoreText: "Search Positions",
    layout: 'right',
    bright: true,
};
export const designofwork: FeatureBlockProps = {
    title: "Design",
    subheading: "",
    paragraph: "The design for the USCG building draws upon the traditions of the turn of the century buildings that occupy the site, which were designed and positioned to support a walkable campus. Their proportion and detail provide access to natural daylight and respond to the human scale, while the landscape and access to nature play an equally important role in enhancing the user experience.",
    imageUrl: "/career/company.webp",
    imageAlt: "noone",
    readMoreLink: "",
    readMoreText: "",
    layout: 'right',
    bright: true,
};
export const landscapeofwork: FeatureBlockProps = {
    title: "Landscape",
    subheading: "",
    paragraph: "The building is fragmented and strategically placed to form a series of linked, cascading quadrangles that are woven into the natural landscape fabric of the existing hillside. The building’s wings step and reveal to further break down the scale to match the texture of the historic campus, and allow for greater penetration of daylight to reduce the demand for artificial lighting and energy. The building’s envelope takes its cues from the existing context, with the material palette influenced directly from elements found on site: brick, schist stone, glass, metal, and vegetation.",
    imageUrl: "/career/company.webp",
    imageAlt: "noone",
    readMoreLink: "",
    readMoreText: "",
    layout: 'left',
    bright: true,
};


// Fetch works from database
export async function getFeaturedWorks(): Promise<ProjectData[]> {
  try {
    
    const { data, error } = await supabase
      .from('works')
      .select('id, title, projectimage, cmpdate')
      .order('cmpdate', { ascending: false })
      .limit(8) // Limit to 8 featured works
    
    if (error) {
      console.error('Error fetching works:', error)
      return []
    }
    
    // Transform the data
    const works: ProjectData[] = data.map(work => ({
      id: work.id,
      title: work.title,
      imageUrl: work.projectimage 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/work-images/${work.projectimage}`
        : '/fallback-work.jpg',
      link: `/work/${work.id}`,
      subtitle: work.cmpdate 
        ? new Date(work.cmpdate).toLocaleDateString('en-US', { year: 'numeric' })
        : undefined
    }))
    
    return works
  } catch (error) {
    console.error('Failed to fetch works:', error)
    return []
  }
}





const IMAGES_BUCKET = "update-images"; // <- change to your bucket if different
const PLACEHOLDER_IMAGE = "/brutalism.jpg"; // fallback if update has no image


export async function fetchMappedUpdates(supabase: any): Promise<FeatureBlockProps[]> {
    const { data: rows, error } = await supabase
        .from("updates")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Fetch updates error:", error);
        throw error;
    }

    if (!rows || rows.length === 0) return [];

    const mapped: FeatureBlockProps[] = rows.map((update: any, idx: number) => {
        // candidate image value coming from your row (could be a path or a full URL)
        let imageUrlFromRow = update.image ?? ""; // adjust key name if different

        // If the stored value is already a full URL, use it. Otherwise try to build public URL from storage.
        let finalImageUrl = PLACEHOLDER_IMAGE;
        if (imageUrlFromRow) {
            if (typeof imageUrlFromRow === "string" && imageUrlFromRow.startsWith("http")) {
                finalImageUrl = imageUrlFromRow;
            } else if (typeof imageUrlFromRow === "string") {
                // use Supabase storage public URL helper (this is synchronous)
                // supabase.storage.from(bucket).getPublicUrl(path) -> { data: { publicUrl } }
                try {
                    const { data: storageData } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(imageUrlFromRow);
                    if (storageData?.publicUrl) finalImageUrl = storageData.publicUrl;
                    else finalImageUrl = imageUrlFromRow; // fallback (maybe already a relative path)
                } catch (e) {
                    // if storage access fails, fall back to raw value or placeholder
                    finalImageUrl = imageUrlFromRow || PLACEHOLDER_IMAGE;
                }
            } else {
                // if image stored as object (rare), try common properties
                if (imageUrlFromRow?.path) {
                    const { data: storageData } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(imageUrlFromRow.path);
                    finalImageUrl = storageData?.publicUrl ?? PLACEHOLDER_IMAGE;
                } else finalImageUrl = PLACEHOLDER_IMAGE;
            }
        }

        return {
            title: update.title ?? "",
            subheading: update.category ?? "", // maps to `subheading`
            paragraph: update.description ?? "",
            imageUrl: finalImageUrl,
            imageAlt: update.title ?? "",
            readMoreLink: update.link ?? (update.id ? `news-${update.id}` : "#"),
            readMoreText: "Read here",
            layout: idx % 2 === 0 ? "right" : "left", // right, left, right, left...
            bright: true,
        };
    });

    return mapped;
}

const rowsdata = await fetchMappedUpdates(supabase)
// console.log(rowsdata)
// export default rowsdata


// Demo 1: Text Left, Image Right, Bright Mode (Matches original image style)
export const demo1Props = rowsdata[0]
export const updatesdata = rowsdata.filter((_, index) => index !== 0);
// console.log(updatesdata)
// console.log(updatesdata)

