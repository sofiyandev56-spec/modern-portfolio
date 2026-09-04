export interface SocialLink {
  name: string;
  url: string;
  handle: string;
  icon: "linkedin" | "instagram" | "github" | "mail";
  primary?: boolean;
}

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/sofiyan-shaikh-838328404/",
    handle: "sofiyan-shaikh",
    icon: "linkedin",
    primary: true,
  },
  {
    name: "GitHub",
    url: "https://github.com/sofiyandev56-spec",
    handle: "sofiyandev56-spec",
    icon: "github",
    primary: true,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/sofiyan_shaikh08/",
    handle: "@sofiyan_shaikh08",
    icon: "instagram",
    primary: false,
  },
  {
    name: "Email",
    url: "mailto:sofiyandev56@gmail.com",
    handle: "sofiyandev56@gmail.com",
    icon: "mail",
    primary: true,
  },
];
