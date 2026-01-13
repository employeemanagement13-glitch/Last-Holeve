"use client"
import FeatureBlock from "@/Components/General/FeatureBlock";
import Showcase from "@/Components/General/ShowCase";
import OurMasterpieces from "@/Components/Home/MasterPieces";
import HomeLanding from "@/Components/Home/HomeLanding";
import { demo1Props, demo2Props, demo3Props, demo4Props, demo5Props, insightsfromclients, updatesdata } from "@/lib/data";
import Feedbacks from "@/Components/Home/Feedbacks";
import Insights from "@/Components/Home/Insights";
export default function Home() {  

  return (
    <main>
      <HomeLanding />
      <Showcase />
      <FeatureBlock {...demo1Props} className=""/>
      <OurMasterpieces />

      {updatesdata.map((update, index)=>(
        <FeatureBlock {...update} key={index} className=""/>
      ))}

      {/* <ParallelCards projects={insights} title="Insights From Clients" subtitle="Explore our diverse projects that showcase our quality and designs. " className="w-full mx-auto"/> */}
      <Insights />
      <FeatureBlock {...demo4Props} className="" layout="right"/>
      <Feedbacks />
      <FeatureBlock {...demo5Props} className="" layout="left"/>
    </main>
  );
}
