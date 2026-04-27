import React from 'react';
import { Button } from '../../elements/Button';
import './EmptyStateTemplate.css';

export interface EmptyStateTemplateProps {
  /** Graphic or icon to render in the center */
  graphic?: React.ReactNode;
  /** Main heading */
  title: string;
  /** Description text */
  description?: string;
  /** Text for the primary action button */
  actionText?: string;
  /** Callback for the primary action button */
  onAction?: () => void;
  /** Optional secondary action text */
  secondaryActionText?: string;
  /** Callback for the secondary action button */
  onSecondaryAction?: () => void;
}

/**
 * nir-t-empty-state — Standard Empty State / Onboarding Template.
 * Used for zero-data states, success screens, or initial onboarding.
 */
export function EmptyStateTemplate({
  graphic,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}: EmptyStateTemplateProps) {
  return (
    <div className="nir-t-empty-state">
      <div className="nir-t-empty-state__content">
        
        {graphic && (
          <div className="nir-t-empty-state__graphic">
            {graphic}
          </div>
        )}
        
        <h2 className="nir-t-empty-state__title">{title}</h2>
        
        {description && (
          <p className="nir-t-empty-state__description">{description}</p>
        )}
        
        <div className="nir-t-empty-state__actions">
          {actionText && (
            <Button
              variant="primary"
              size="lg"
              onClick={onAction}
            >
              {actionText}
            </Button>
          )}
          
          {secondaryActionText && (
            <Button
              variant="secondary"
              size="lg"
              onClick={onSecondaryAction}
            >
              {secondaryActionText}
            </Button>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default EmptyStateTemplate;
