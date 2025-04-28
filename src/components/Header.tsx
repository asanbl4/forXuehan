import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1>3D Model Viewer</h1>
      <button onClick={() => window.open('https://github.com/yourusername/3d-model-viewer', '_blank')}>
        GitHub
      </button>
    </header>
  );
};

export default Header; 