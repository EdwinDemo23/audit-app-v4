import React from 'react';
import './Badge.css';

/**
 * Enterprise Badge / Status Chip
 * Variants: scheduled, in-progress, completed, pending, overdue, draft, success, warning, danger, info, neutral
 */
export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = true,
  className = '',
  ...props
}) {
  const normVariant = variant.toLowerCase().replace(/\s+/g, '-');

  return (
    <span
      className={`ent-badge ent-badge--${normVariant} ent-badge--${size} ${className}`}
      {...props}
    >
      {dot && <span className="ent-badge__dot" aria-hidden="true" />}
      <span className="ent-badge__text">{children}</span>
    </span>
  );
}
