import FeatureBlock from '@/Components/General/FeatureBlock'
import ParallelContent from '@/Components/Home/ParallelContent'
import { ImageContentBlock } from '@/Components/insights/FullImage'
import { careersdata, greateststrength, offerings } from '@/lib/data'
import React from 'react'

const page = () => {
    return (
        <div>
            <FeatureBlock {...greateststrength} className="" />
            <div className="min-h-screen max-md:min-h-fit w-full">
                <ImageContentBlock
                    imageSrc="/Purpose/team1.jpg"
                />
            </div>
            {careersdata.map((career, index) => (
                <FeatureBlock key={index} {...career} className="" />
            ))}
            <ParallelContent title='Internships' dark={false} />
            <FeatureBlock {...offerings} className="" />
        </div>
    )
}

export default page