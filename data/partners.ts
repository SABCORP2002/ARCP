export interface PlatformPartner {
  id: string;
  name: string;
  image: string;
  websiteUrl?: string;
}

export const platformPartners: PlatformPartner[] = [
  { id: "minepded", name: "MINEPDED", image: "/assets/partners/MINEPDED.png" },
  { id: "minresi", name: "MINRESI", image: "/assets/partners/MINRESI.png" },
  { id: "pad", name: "Port Autonome de Douala", image: "/assets/partners/PAD.png" },
  { id: "pak", name: "Port Autonome de Kribi", image: "/assets/partners/PAK.png" },
  { id: "pakazure", name: "PAK Azure", image: "/assets/partners/PAKAZURE.jpg" },
  { id: "sparte-robotics", name: "Sparte Robotics", image: "/assets/partners/Sparte Robotics.jpg" },
];
