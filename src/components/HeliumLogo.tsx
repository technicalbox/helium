import React from 'react';

interface HeliumLogoProps {
  className?: string;
  size?: number;
  starOnly?: boolean;
}

export const HeliumLogo: React.FC<HeliumLogoProps> = ({ className = '', size = 24, starOnly = false }) => {
  if (starOnly) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 56 56"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path d="M33.3232 52.0297L28 56L22.6768 52.0297L25.0958 33.0855L10.0649 44.6731L4 42L4.74054 35.3577L22.1898 28L4.74054 20.6423L4 14L10.0649 11.3269L25.0958 22.9145L22.6768 3.97031L28 0L33.3232 3.97031L30.9042 22.9145L45.9351 11.3269L52 14L51.2595 20.6423L33.8102 28L51.2595 35.3577L52 42L45.9351 44.6731L30.9042 33.0855L33.3232 52.0297Z" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="256" height="256" rx="67" fill="#3551D2" />
      <path
        d="M145.966 207.813L128 221L110.034 207.813L118.198 144.891L67.4689 183.379L47 174.5L49.4993 152.438L108.391 128L49.4993 103.562L47 81.5L67.4689 72.6214L118.198 111.109L110.034 48.1871L128 35L145.966 48.1871L137.802 111.109L188.531 72.6214L209 81.5L206.501 103.562L147.609 128L206.501 152.438L209 174.5L188.531 183.379L137.802 144.891L145.966 207.813Z"
        fill="#FEFBFF"
      />
    </svg>
  );
};
