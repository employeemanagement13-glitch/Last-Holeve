import FeatureBlock from '@/Components/General/FeatureBlock'
import HeroHeading from '@/Components/General/HeroHeading'
import Culture from '@/Components/Purpose/Culture'
import { PurposeContent } from '@/lib/data'

const page = () => {
  return (
    <div>
        <div className='min-h-[85vh] w-full flex items-center justify-center'>
        <HeroHeading text="We’re a global collective of designers and changemakers." className='w-[80%] justify-center' headingclass='mainheading' />
         {/* paragraph='William Li, CEO of global EV automaker NIO, shares his inspiration for unique owner clubs' date='January 23, 2024' belongsto='High Tech’s Higher Purpose' className='w-[80%] h-[90vh] flex flex-col justify-center text-white' */}
        </div>
      {/* <FeatureBlock {...PurpseHeader} className="" layout="right" />
      <FeatureBlock {...listento} className=""  />
      <FeatureBlock {...imaginepossibility} className=""  /> */}

      {PurposeContent.map((pupose, index) => (
        <FeatureBlock key={index} {...pupose} className="" />
      ))}

    <Culture />
    </div>
  )
}

export default page