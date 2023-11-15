import React from 'react';
import SolidIcon from '@/_ui/Icon/SolidIcons';

export const Visibility = ({ value, onVisibilityChange, component }) => {
  return (
    <div
      className="cursor-pointer visibility-eye"
      style={{ top: component.component.definition.styles.iconVisibility.value && '42%' }}
      onClick={(e) => {
        e.stopPropagation();
        onVisibilityChange(!component.component.definition.styles.iconVisibility.value);
      }}
    >
      <SolidIcon
        name={component.component.definition.styles.iconVisibility.value ? 'eye1' : 'eyedisable'}
        width="16"
        fill={'var(--slate8)'}
      />
    </div>
  );
};
