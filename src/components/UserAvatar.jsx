import React from 'react';

// Soft light gradient palette
const softLightGradients = [
  ['#fceabb', '#f8b500'],
  ['#e0c3fc', '#8ec5fc'],
  ['#f6d365', '#fda085'],
  ['#a1c4fd', '#c2e9fb'],
  ['#ffecd2', '#fcb69f'],
  ['#d4fc79', '#96e6a1'],
  ['#fbc2eb', '#a6c1ee'],
  ['#fddb92', '#d1fdff'],
  ['#cfd9df', '#e2ebf0'],
  ['#ffdee9', '#b5fffc']
];

// Hash function to convert name → index
const getGradientByName = (name) => {
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % softLightGradients.length;
  const [start, end] = softLightGradients[index];
  return { start, end };
};

const UserAvatar = ({ name = 'User', isOnline }) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const { start, end } = getGradientByName(name); // consistent gradient based on name

  return (
    <div
      className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-md"
      style={{
        backgroundImage: `linear-gradient(135deg, ${start}, ${end})`,
      }}
    >
      <span className="text-white font-semibold">{initials}</span>
      {isOnline && (
        <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 border-2 border-white rounded-full animate-bounce" />
      )}
    </div>
  );
};

export default UserAvatar;
