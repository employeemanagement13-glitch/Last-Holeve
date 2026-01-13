"use client";
import { supabase } from '@/utils/supabaseClient';
import FeedbackCard from './FeedbackCard';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Define the FeedbackItem type for FeedbackCard
type FeedbackItem = {
  id: string;
  imageUrl: string;
  feedbackText: string;
  readMoreLink: string;
  readMoreText: string;
  author: string;
};

// Fetch feedbacks from database
async function getFeedbacks() {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error || !data || data.length === 0) {
      console.error('Error fetching feedbacks:', error);
      return [];
    }
    
    const feedbackSection = data[0];
    const feedbacksArray = typeof feedbackSection.feedbacks === 'string' 
      ? JSON.parse(feedbackSection.feedbacks) 
      : feedbackSection.feedbacks;
    
    // Transform the data to match FeedbackItem structure
    const feedbackData: FeedbackItem[] = feedbacksArray.map((feedback: any, index: number) => ({
      id: feedback.id || index.toString(),
      imageUrl: feedback.image 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/feedback-images/${feedback.image}`
        : '/fallback-person.jpg',
      feedbackText: feedback.description,
      readMoreLink: feedback.link,
      readMoreText: feedback.linktext || 'Read More',
      author: `${feedback.person}${feedback.designation ? `, ${feedback.designation}` : ''}`
    }));
    
    return feedbackData;
  } catch (error) {
    console.error('Failed to fetch feedbacks:', error);
    return [];
  }
}

// Client component to display feedbacks
const FeedbacksPage = () => {
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionTitle, setSectionTitle] = useState("Feedbacks");
  const [sectionSubtitle, setSectionSubtitle] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  async function fetchFeedbacks() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching feedbacks:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const feedbackSection = data[0];
        setSectionTitle("Feedbacks");
        setSectionSubtitle(feedbackSection.sectiontitle || "Feedbacks");
        
        const feedbacksArray = typeof feedbackSection.feedbacks === 'string' 
          ? JSON.parse(feedbackSection.feedbacks) 
          : feedbackSection.feedbacks;
        
        const transformedData: FeedbackItem[] = feedbacksArray.map((feedback: any, index: number) => ({
          id: feedback.id || index.toString(),
          imageUrl: feedback.image 
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/feedback-images/${feedback.image}`
            : '/fallback-person.jpg',
          feedbackText: feedback.description,
          readMoreLink: feedback.link,
          readMoreText: feedback.linktext || 'Read More',
          author: `${feedback.person}${feedback.designation ? `, ${feedback.designation}` : ''}`
        }));
        
        setFeedbackData(transformedData);
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="font-sans bg-white min-h-fit w-full"
    >
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block">
            <motion.div 
              className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                ease: "linear" as const 
              }}
            />
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-600"
          >
            Loading feedbacks...
          </motion.p>
        </div>
      ) : feedbackData.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <FeedbackCard 
            feedbacks={feedbackData} 
            title={sectionTitle}
            subtitle={sectionSubtitle}
            className='w-[90%] mx-auto'
          />
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20"
        >
          <p className="text-gray-500">No feedbacks available yet.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FeedbacksPage;