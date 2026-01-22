// frontend2\src\utils\allIcons.js

import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as AiIcons from 'react-icons/ai';
import * as TbIcons from "react-icons/tb";

// Map the library prefix to the imported module
export const iconLibraries = {
  Fa: FaIcons,
  Si: SiIcons,
  Ai: AiIcons,
  Tb: TbIcons,
};

// Map the library prefix to its full name (optional, for better error messages)
export const libraryNames = {
  Fa: 'Font Awesome',
  Si: 'Simple Icons',
  Ai: 'Ant Design Icons',
  Tb: 'Tabler Icons',
};