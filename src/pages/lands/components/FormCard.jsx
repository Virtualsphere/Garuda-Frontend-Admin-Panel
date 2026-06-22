import React from 'react';

export const FormCard = ({ title, icon: Icon, colorTheme, children }) => {
  const color = colorTheme || 'blue';
  return (
    <div className={`land-card land-card--${color}`}>
      <div className={`land-card__header land-card__header--${color}`}>
        <div className={`land-card__badge land-card__badge--${color}`}>
          <Icon size={20} />
        </div>
        <div className={`land-card__title land-card__title--${color}`}>
          {title}
        </div>
      </div>
      <div className="land-card__body">
        {children}
      </div>
    </div>
  );
};

// Main Component