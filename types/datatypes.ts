
export interface BaseComponentProps {
  className?: string;
}


export interface HeroHeadingProps extends BaseComponentProps {
  text: string;
  paragraph?:string;
  belongsto?:string;
  date?:string;
  headingclass?:string; 
  paraClass?:string; 
}


// --- 5. SINCE SECTION COMPONENT ---

export interface SinceSectionProps extends BaseComponentProps {
  year: string;
  bodyText: string;
}



export interface NavItem {
  name: string;
  link: string;
}

// New generalized props for the background media component
export interface BackgroundMediaProps extends BaseComponentProps {
  mediaType?: 'image' | 'video' | 'default'; // 'default' uses the original city SVG
  mediaUrl?: string; // URL for image or video
}

export interface FeatureBlockProps extends BaseComponentProps {
  // Required content
  title: string;
  imageUrl: string;
  imageAlt: string;

  // Optional content
  subheading?: string;
  paragraph?: string;
  readMoreLink?: string; // Link for the optional "Read More" button
  readMoreText?: string; // Text for the optional "Read More" link

  // Layout and style control
  layout: 'left' | 'right'; // 'left': text on left, image on right
  bright: boolean; // true: white bg, dark text | false: dark bg, light text
  imageinfo?:string;
}


// --- INTERFACES ---

export interface BaseComponentProps {
  className?: string;
}

// Interface for the project data used in the slider
export interface ProjectData {
    id: number | string;
    imageUrl: string;
    title: string;
    subtitle?: string; // The location/description line
    link: string;
    dark?:boolean;
}

export interface ProjectSliderProps extends BaseComponentProps {
    projects: ProjectData[];
    title: string;
    subtitle?: string;
}



// --- New Interface for Feedback Component ---
export interface FeedbackItem {
    id: number | string;
    imageUrl: string;
    feedbackText: string;
    readMoreLink: string;
    readMoreText: string;
    author: string;
}

export interface FeedbackCardProps extends BaseComponentProps {
    feedbacks: FeedbackItem[];
    title: string;
    subtitle: string;
}





export type Update = {
  id: string;
  category: string;
  title: string;
  description: string;
  link: string;
  image: string;
  created_at: string;
};