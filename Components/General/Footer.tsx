import React from 'react'
import Navlink from './Navlink';
import { socialImages } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';
import { companyLinks } from '@/lib/data';
import EmailSubscriptionForm from './EmailSubscriptionForm';

// Fetch works from database for the footer
async function getWorksForFooter() {
  try {
    const { data, error } = await supabase
      .from('works')
      .select('id, title')
      .order('title', { ascending: true })
      .limit(10);
    
    if (error) {
      console.error('Error fetching works for footer:', error);
      return [];
    }
    
    // Transform to NavItem format
    const worksLinks = data.map(work => ({
      name: work.title,
      link: `/work/${work.id}`
    }));
    
    return worksLinks;
  } catch (error) {
    console.error('Failed to fetch works for footer:', error);
    return [];
  }
}

// Split array into two columns for display
function splitArray<T>(array: T[]): [T[], T[]] {
  const middle = Math.ceil(array.length / 2);
  return [array.slice(0, middle), array.slice(middle)];
}

const Footer = async () => {
  // Fetch works data on the server
  const worksLinks = await getWorksForFooter();
  
  // Split works into two columns
  const [projectsColumn1, projectsColumn2] = splitArray(worksLinks);

  return (
    <footer className="bg-black text-white py-12 md:py-20" id='contact'>
      <div className="container px-4 sm:px-6 lg:px-8 max-w-[90%] mx-auto">
        
        {/* Top Section: Links and Join Us */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-12 pb-16 border-b border-gray-800">
          
          {/* Column 1: Company */}
          <div>
            <h4 className="text-lg font-bold mb-4"><Link href={`/`}>Company</Link></h4>
            <div className="flex flex-col space-y-2 text-gray-400 text-base">
              {companyLinks.map((companyLink, index) => (
                <Navlink key={`company-${index}`} item={companyLink} variant="footer" />
              ))}
            </div>
          </div>

          {/* Column 2 & 3: Projects */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-bold mb-4"><Link href={`/work`}>Projects</Link></h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-0 sm:gap-x-12">
              {/* Projects Column 1 */}
              <div>
                <div className="flex flex-col space-y-2 text-gray-400 text-base">
                  {projectsColumn1.map((work, index) => (
                    <Navlink key={`project1-${index}`} item={work} variant="footer" />
                  ))}
                </div>
              </div>
              {/* Projects Column 2 */}
              <div>
                <div className="flex flex-col space-y-2 text-gray-400 text-base">
                  {projectsColumn2.map((work, index) => (
                    <Navlink key={`project2-${index}`} item={work} variant="footer" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Column 4/5: Join Us (Subscription) */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <h4 className="text-lg font-bold mb-4">Join our mailing list</h4>
            <EmailSubscriptionForm />
          </div>
        </div>

        {/* Bottom Section: Copyright and Socials */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h4 className="text-lg font-bold mb-2">Holeve</h4>
            <p className="text-sm text-gray-500">
              @2025 Company | <Link href="/privacy" className="hover:text-white transition duration-150">Privacy Policy</Link>
            </p>
          </div>
          
          {/* Social Icons */}
          <div className="flex space-x-4 text-gray-500 text-2xl">
            {socialImages.map((social, index) => (
              <Link 
                href={social.link} 
                key={index} 
                aria-label={social.link || "Social link"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image 
                  src={social.image} 
                  height={40} 
                  width={40} 
                  className="rounded-full scale-100 transition-all hover:scale-105 duration-200" 
                  alt={social.link || "Social icon"} 
                />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;