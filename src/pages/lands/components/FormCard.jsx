import React from 'react';

export const FormCard = ({ title, icon: Icon, colorTheme, children }) => {
  const themes = {
    red: { bg: 'bg-red-50', border: 'border-t-red-500', text: 'text-red-600', iconBg: 'bg-red-500' },
    green: { bg: 'bg-green-50', border: 'border-t-green-500', text: 'text-green-600', iconBg: 'bg-green-500' },
    blue: { bg: 'bg-blue-50', border: 'border-t-blue-500', text: 'text-blue-600', iconBg: 'bg-blue-500' },
    orange: { bg: 'bg-orange-50', border: 'border-t-orange-500', text: 'text-orange-600', iconBg: 'bg-orange-500' },
    teal: { bg: 'bg-teal-50', border: 'border-t-teal-500', text: 'text-teal-600', iconBg: 'bg-teal-500' },
  };
  const theme = themes[colorTheme] || themes.blue;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden border-t-4 ${theme.border}`}>
      <div className={`pt-4 pb-3 px-6 flex flex-col items-center justify-center border-b border-gray-100 ${theme.bg}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white mb-2 shadow-sm ${theme.iconBg}`}>
          <Icon size={16} />
        </div>
        <h3 className={`text-[10px] font-bold uppercase tracking-wider ${theme.text}`}>
          {title}
        </h3>
      </div>
      <div className="p-5 space-y-4">
        {children}
      </div>
    </div>
  );
};

// Main Component