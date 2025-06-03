import React from 'react';

const Footer: React.FC = () => (
    <footer className="w-full py-4 text-center dark:bg-[#0a0a0a] transition-colors duration-300 dark:text-gray-50 bg-[#faf6f6] text-gray-600 fixed bottom-0 left-0 z-50">
        © {new Date().getFullYear()} JobPilot. All rights reserved.
    </footer>
);

export default Footer;