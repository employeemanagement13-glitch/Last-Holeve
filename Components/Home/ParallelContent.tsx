import React from 'react'

interface parallel{
    title: string;
    subtitle?: string;
    dark?:boolean;
}

const ParallelContent = ({title, subtitle, dark} : parallel) => {
  return (
            <div className="container max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                {/* Header Section (Our Master Pieces) */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                    <h2 className={dark ? "brightparallelheading" : "parallelheading"}>
                        {title}
                    </h2>
                    <p className={dark ? "brightparalleltext" : "paralleltext"}>
                        {subtitle}
                    </p>
                </div>
            </div>
  )
}

export default ParallelContent