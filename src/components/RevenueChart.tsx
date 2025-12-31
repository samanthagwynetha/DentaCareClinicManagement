"use client";
import { useState } from "react";

export default function RevenueChart() {
  // Mock data for the chart
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueData = [30, 35, 35, 38, 40, 42, 45, 48, 52, 56, 60, 65];
  const maxRevenue = Math.max(...revenueData);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; month: string; revenue: number } | null>(null);
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Revenue Overview
          </h2>
          <p className="text-sm text-gray-500">Monthly revenue for 2025</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
            1M
          </button>
          <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
            3M
          </button>
          <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
            6M
          </button>
          <button className="px-3 py-1 text-xs font-medium text-white bg-teal-600 rounded-md">
            1Y
          </button>
        </div>
      </div>

      {/* Chart with Y-axis labels */}
      <div className="relative h-64 mb-6 flex gap-4">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between text-xs text-gray-400 py-2">
          <span>₱80k</span>
          <span>₱60k</span>
          <span>₱40k</span>
          <span>₱20k</span>
          <span>₱0k</span>
        </div>
        
        {/* Chart container */}
        <div className="relative flex-1">
          <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="0" x2="800" y2="0" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="0" y1="50" x2="800" y2="50" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="0" y1="150" x2="800" y2="150" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="0" y1="200" x2="800" y2="200" stroke="#e5e7eb" strokeWidth="1" />
            
            {/* Data line with gradient fill */}
            <defs>
              <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            
            {/* Area under the line */}
            <path
              d={`M 0 ${200 - (revenueData[0] / maxRevenue) * 180} ${revenueData
                .map((value, i) => `L ${(i / (revenueData.length - 1)) * 800} ${200 - (value / maxRevenue) * 180}`)
                .join(" ")} L 800 200 L 0 200 Z`}
              fill="url(#revenueGradient)"
            />
            
            {/* Line */}
            <path
              d={`M 0 ${200 - (revenueData[0] / maxRevenue) * 180} ${revenueData
                .map((value, i) => `L ${(i / (revenueData.length - 1)) * 800} ${200 - (value / maxRevenue) * 180}`)
                .join(" ")}`}
              stroke="#14b8a6"
              strokeWidth="3"
              fill="none"
            />
            
            {/* Interactive hover areas */}
            {revenueData.map((value, i) => {
              const x = (i / (revenueData.length - 1)) * 800;
              const y = 200 - (value / maxRevenue) * 180;
              return (
                <g key={i}>
                  <rect
                    x={x - 30}
                    y="0"
                    width="60"
                    height="200"
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredPoint({ x: i, y, month: months[i], revenue: value * 1000 })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {hoveredPoint?.month === months[i] && (
                    <>
                      <line
                        x1={x}
                        y1="0"
                        x2={x}
                        y2="200"
                        stroke="#d1d5db"
                        strokeWidth="1"
                        strokeDasharray="4"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="5"
                        fill="white"
                        stroke="#14b8a6"
                        strokeWidth="3"
                      />
                    </>
                  )}
                </g>
              );
            })}
          </svg>
          
          {/* Hover Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-none z-10"
              style={{
                left: `${(hoveredPoint.x / (revenueData.length - 1)) * 100}%`,
                top: `${(hoveredPoint.y / 200) * 100 - 20}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <p className="text-sm font-semibold text-gray-900">{hoveredPoint.month}</p>
              <p className="text-sm text-teal-600 font-medium">Revenue : ₱{(hoveredPoint.revenue / 1000).toFixed(3).replace(/\.?0+$/, '')}K</p>
            </div>
          )}
          
          {/* Month labels */}
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-400">
            {months.map((month) => (
              <span key={month}>
                {month}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats below chart */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">₱525K</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">vs Last Year</p>
          <p className="text-2xl font-bold text-green-600">+18.2%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Avg Monthly</p>
          <p className="text-2xl font-bold text-gray-900">₱43.8K</p>
        </div>
      </div>
    </div>
  );
}
