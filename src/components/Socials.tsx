"use client";

import Link from "next/link";
import React from "react";
import { FaGithub, FaGlobe, FaLinkedin, FaTwitter } from "react-icons/fa";

type SocialLinks = {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
};

function Socials({ socialLinks }: { socialLinks: SocialLinks }) {
  const iconClass = "w-5 h-5 transition text-primary hover:text-primary/80";

  return (
    <div className="flex items-center gap-4">
      <Link
        href={socialLinks.linkedin ?? "#"}
        target={socialLinks?.linkedin ? "_blank" : undefined}
        rel="noopener noreferrer"
      >
        <FaLinkedin className={iconClass} />
      </Link>

      <Link
        href={socialLinks?.github ?? "#"}
        target={socialLinks?.github ? "_blank" : undefined}
        rel="noopener noreferrer"
      >
        <FaGithub className={iconClass} />
      </Link>

      <Link
        href={socialLinks.twitter ?? "#"}
        target={socialLinks?.twitter ? "_blank" : undefined}
        rel="noopener noreferrer"
      >
        <FaTwitter className={iconClass} />
      </Link>

      <Link
        href={socialLinks.website ?? "#"}
        target={socialLinks?.website ? "_blank" : undefined}
        rel="noopener noreferrer"
      >
        <FaGlobe className={iconClass} />
      </Link>
    </div>
  );
}

export default Socials;
