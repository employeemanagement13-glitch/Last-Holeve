import { InsightCardData } from '@/lib/fetch-insightsdata';
import Link from 'next/link';
import React from 'react'

const InsightCard = ({ data, className }: { data: InsightCardData, className: string }) => (
    <Link href={data.link} className={className}>
        {/* Card Image */}
        <div className="relative overflow-hidden rounded-t-lg">
            <img
                src={data.imageSrc}
                alt={data.headline}
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                style={{ aspectRatio: '4/3' }}
                onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/400x280/333333/999999?text=Image+Load+Error";
                }}
            />
        </div>

        {/* Card Text Content */}
        <div className="p-5">
            <p className="text-yellow-500 text-sm font-medium mb-1">
                {data.category}
            </p>
            <h3 className="text-lg font-normal leading-snug">
                {data.headline}
            </h3>
        </div>
    </Link>
);


export default InsightCard
