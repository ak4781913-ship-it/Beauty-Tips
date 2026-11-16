import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs text-stone-400 overflow-x-auto whitespace-nowrap scrollbar-none py-1.5 ${className}`}
    >
      <ol className="flex items-center gap-1.5 list-none p-0 m-0">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-stone-400 hover:text-rose-300 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-400 rounded-md px-1 py-0.5"
            title="Back to Home"
          >
            <Home className="w-3.5 h-3.5 text-stone-500 hover:text-rose-400 shrink-0" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-stone-600 shrink-0" aria-hidden="true" />
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="text-stone-400 hover:text-rose-300 transition-colors truncate max-w-[150px] sm:max-w-[240px] focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-400 rounded-md px-1 py-0.5 font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-stone-200 font-semibold truncate max-w-[180px] sm:max-w-[320px] px-1 py-0.5"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
