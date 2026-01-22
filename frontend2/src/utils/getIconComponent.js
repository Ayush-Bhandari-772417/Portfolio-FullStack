// frontend2\src\utils\getIconComponent.js
import React, { useState, useEffect } from 'react';
import { iconLibraries } from './allIcons'; // Import the new icon map

const DynamicIcon = ({ name, ...props }) => {
  const [Icon, setIcon] = useState(null);

  useEffect(() => {
    if (!name) return;

    // Use a regular expression to extract the library prefix (e.g., 'Fa', 'Si')
    const prefix = name.match(/[A-Z][a-z]*/g);

    if (prefix && prefix.length > 0) {
      const libraryPrefix = prefix[0];
      const library = iconLibraries[libraryPrefix];

      if (library) {
        const component = library[name];
        if (component) {
          setIcon(() => component);
        } else {
          console.error(`Icon "${name}" not found in library "${libraryPrefix}".`);
          setIcon(null);
        }
      } else {
        console.error(`Icon library for prefix "${libraryPrefix}" not found.`);
        setIcon(null);
      }
    } else {
      console.error(`Could not determine icon library from name "${name}".`);
      setIcon(null);
    }
  }, [name]);

  if (!Icon) {
    return null; // Or a placeholder icon
  }

  return <Icon {...props} />;
};

export default DynamicIcon;