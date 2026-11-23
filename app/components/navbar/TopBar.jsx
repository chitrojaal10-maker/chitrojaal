import React from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const TopBar = () => {
  return (
    <div className="bg-black/50 backdrop-blur-sm border-b border-white/10 text-neutral-300 text-xs py-2">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1 sm:gap-y-0 gap-x-4 sm:gap-x-6">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-orange-400" />
            <span>Juma Market, Mizan Road, Feni</span>
          </div>
          <div className="flex items-center gap-2">
            <FiPhone className="text-orange-400" />
            <a href="tel:01834258375" className="hover:text-orange-400 transition-colors">01834258375</a>
          </div>
          <div className="flex items-center gap-2 hidden sm:flex">
            <FiMail className="text-orange-400" />
            <a href="mailto:Chitrojaal@gmail.com" className="hover:text-orange-400 transition-colors">Chitrojaal@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
