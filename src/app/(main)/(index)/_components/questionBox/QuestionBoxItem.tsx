'use client';

import { ChevronDownIcon } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';


interface QuestionBoxItemProps {
    question: string;
    answer: string;
    isOpen?: boolean;
    onToggle?: (id: string) => void;
    id: string;
}

export default function QuestionBoxItem({
    question,
    answer,
    isOpen = false,
    onToggle,
    id,
}: QuestionBoxItemProps) {
    const [currentIsOpen, setCurrentIsOpen] = useState(isOpen);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState('0px');

    useEffect(() => {
        setCurrentIsOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(currentIsOpen ? `${contentRef.current.scrollHeight}px` : '0px');
        }
    }, [currentIsOpen]);

    const handleToggle = () => {
        if (onToggle) {
            onToggle(id);
        } else {
            setCurrentIsOpen(!currentIsOpen);
        }
    };

    return (
        <div className="border border-[#CCCC] rounded-15 bg-white overflow-hidden shadow-sm">
            <h3 className="flex">
                <button
                    id={`questionbox-header-${id}`}
                    type="button"
                    aria-expanded={currentIsOpen}
                    aria-controls={`questionbox-panel-${id}`}
                    onClick={handleToggle}
                    // Added h-[80px] here
                    className="flex-1 text-right py-4 px-5 sm:px-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors hover:bg-gray-50 h-[80px]"
                >
                    <span className="text-gray-900 font-semibold text-base sm:text-lg">
                        {question}
                    </span>
                    <ChevronDownIcon
                        className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${currentIsOpen ? 'rotate-180' : ''
                            }`}
                    />
                </button>
            </h3>
            <div
                id={`questionbox-panel-${id}`}
                role="region"
                aria-labelledby={`questionbox-header-${id}`}
                ref={contentRef}
                style={{ maxHeight: contentHeight }}
                className="transition-all duration-300 ease-in-out overflow-hidden"
            >
                <div className="py-5 bg-red-30 min-h-[80px] px-5 sm:px-6 text-gray-700 text-sm sm:text-base border-t border-gray-100">
                    {answer}
                </div>
            </div>
        </div>
    );
}