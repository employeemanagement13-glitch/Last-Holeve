import HeroHeading from '@/Components/General/HeroHeading'
import ParallelCards from '@/Components/General/ParallelCards'
import { ImageContentBlock } from '@/Components/insights/FullImage'
import { londonLeadership } from '@/lib/data'
import React from 'react'

const page = () => {
    return (
        <div>
            <div className="min-h-screen max-md:min-h-fit w-full">
                <ImageContentBlock
                    imageSrc="/Purpose/team1.jpg"
                />
            </div>
            <div className="min-h-screen w-full flex items-center justify-center">
            <HeroHeading text="We're creative thinkers with a passion for design and compassion for our communities."  className='w-[80%] justify-center' headingclass='mainheading'/>
            </div>
            
            <ParallelCards projects={londonLeadership} title="People in Firmware Leadership" subtitle="" className="w-full mx-auto" />
        </div>
    )
}

export default page