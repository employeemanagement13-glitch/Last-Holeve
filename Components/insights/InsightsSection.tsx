"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getINSIGHTS_CARD_DATA } from '@/lib/data';
import InsightCard from './InsightCard';
import { InsightCardData } from '@/lib/fetch-insightsdata';

// --- MAIN SECTION COMPONENT ---
const InsightsSection = () => {
    const [insightsData, setInsightsData] = useState<InsightCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<'Theme' | 'Topic'>('Theme');

    // Fetch insights data on component mount
    useEffect(() => {
        async function loadInsights() {
            setLoading(true);
            try {
                const data = await getINSIGHTS_CARD_DATA();
                setInsightsData(data);
            } catch (error) {
                console.error('Error loading insights data:', error);
            } finally {
                setLoading(false);
            }
        }
        
        loadInsights();
    }, []);

    // Memoized filter options based on the fetched data
    const themes = useMemo(() => {
        const uniqueThemes = Array.from(new Set(insightsData.map(i => i.theme)));
        return uniqueThemes.filter(theme => theme); // Remove empty/null values
    }, [insightsData]);

    const topics = useMemo(() => {
        const uniqueTopics = Array.from(new Set(insightsData.map(i => i.topic)));
        return uniqueTopics.filter(topic => topic); // Remove empty/null values
    }, [insightsData]);

    // Set initial filter value when data is loaded
    const [selectedFilterValue, setSelectedFilterValue] = useState<string>('');
    
    useEffect(() => {
        if (themes.length > 0 && activeFilter === 'Theme') {
            setSelectedFilterValue(themes[0]);
        } else if (topics.length > 0 && activeFilter === 'Topic') {
            setSelectedFilterValue(topics[0]);
        }
    }, [themes, topics, activeFilter]);

    // Combined filtering logic
    const filteredInsights = useMemo(() => {
        if (!insightsData.length) return [];
        
        return insightsData.filter(insight => {
            const matchesSearch = searchTerm === '' || 
                insight.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                insight.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                insight.topic.toLowerCase().includes(searchTerm.toLowerCase());
            
            let matchesFilter = true;
            if (selectedFilterValue && selectedFilterValue !== 'All') {
                if (activeFilter === 'Theme') {
                    matchesFilter = insight.theme === selectedFilterValue;
                } else if (activeFilter === 'Topic') {
                    matchesFilter = insight.topic === selectedFilterValue;
                }
            }

            return matchesSearch && matchesFilter;
        });
    }, [insightsData, searchTerm, activeFilter, selectedFilterValue]);

    // Handles the click on the "Theme" or "Topic" button
    const handleFilterTypeChange = (type: 'Theme' | 'Topic') => {
        setActiveFilter(type);
        // Reset the value to the first available option for the new type
        if (type === 'Theme' && themes.length > 0) {
            setSelectedFilterValue(themes[0]);
        } else if (type === 'Topic' && topics.length > 0) {
            setSelectedFilterValue(topics[0]);
        }
    };
    
    // Handles the change in the specific filter value dropdown
    const handleFilterValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFilterValue(e.target.value);
    };

    // Tailwind classes for the filter buttons
    const getFilterButtonClass = (type: string) => 
        `px-4 py-2 rounded-lg text-sm font-medium transition duration-200 cursor-pointer ${
            activeFilter === type
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
        }`;

    // Loading state
    if (loading) {
        return (
            <section className="bg-black text-white py-12 md:py-20 font-sans min-h-screen">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
                        <p className="mt-4 text-neutral-400">Loading insights...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-black text-white py-12 md:py-20 font-sans min-h-screen">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                
                {/* Search and Filters Layout */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                    
                    {/* Search Bar (Left) */}
                    <div className="relative grow max-w-3xl">
                        <input
                            type="search"
                            placeholder="Search Insights*"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-lg text-white placeholder-neutral-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none transition duration-150"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    </div>

                    {/* Filters (Right) */}
                    <div className="flex items-center space-x-4">
                        {/* Filter Type Buttons (Theme / Topic) */}
                        <button 
                            onClick={() => handleFilterTypeChange('Theme')}
                            className={getFilterButtonClass('Theme')}
                            disabled={themes.length === 0}
                        >
                            Theme
                        </button>
                        <button 
                            onClick={() => handleFilterTypeChange('Topic')}
                            className={getFilterButtonClass('Topic')}
                            disabled={topics.length === 0}
                        >
                            Topic
                        </button>

                        {/* Filter Value Dropdown */}
                        <div className="relative">
                            <select
                                value={selectedFilterValue}
                                onChange={handleFilterValueChange}
                                className="appearance-none block w-full bg-neutral-900 border border-neutral-700 text-white py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-neutral-800 focus:border-amber-600 cursor-pointer min-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={activeFilter === 'Theme' ? themes.length === 0 : topics.length === 0}
                            >
                                <option value="All">All {activeFilter}s</option>
                                {(activeFilter === 'Theme' ? themes : topics).map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="text-neutral-400">
                        Showing {filteredInsights.length} of {insightsData.length} insights
                    </div>
                    {searchTerm && (
                        <div className="text-sm text-amber-600">
                            Search results for: "{searchTerm}"
                        </div>
                    )}
                </div>

                {/* Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredInsights.length > 0 ? (
                        filteredInsights.map((insight) => (
                            <InsightCard 
                                key={insight.id} 
                                data={insight} 
                                // Passing the required className to the card component
                                className="bg-neutral-900 rounded-xl overflow-hidden shadow-2xl transition duration-300 hover:shadow-amber-900/20 hover:transform hover:-translate-y-1" 
                            />
                        ))
                    ) : (
                        <div className="lg:col-span-3 text-center py-16 text-xl text-neutral-500">
                            {searchTerm || selectedFilterValue !== 'All' 
                                ? "No insights found matching your criteria. Try a different search or filter."
                                : "No insights available at the moment."}
                        </div>
                    )}
                </div>

                {/* Empty State if no data at all */}
                {!loading && insightsData.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-amber-600 text-6xl mb-4">📝</div>
                        <h3 className="text-2xl font-bold mb-2">No Insights Available</h3>
                        <p className="text-neutral-400 max-w-md mx-auto">
                            There are currently no insights to display. Check back soon or add insights through the admin panel.
                        </p>
                    </div>
                )}

                {/* Debug info (remove in production) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-neutral-900 rounded-lg text-sm text-neutral-400">
                        <div>Loaded {insightsData.length} insights from database</div>
                        <div>Themes: {themes.join(', ')}</div>
                        <div>Topics: {topics.join(', ')}</div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default InsightsSection;