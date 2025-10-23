import type { CertificateInformationData } from "@/features/mint-certificate/components/certificate-information";

// Mock gallery images from Figma
const img1 = "http://localhost:3845/assets/7b23aa3e55b219a62b21e3e531746b4c4dd9dc1c.png";
const img2 = "http://localhost:3845/assets/bd5fab157ab1ae32388f1ed3bcfe927f05153fad.png";
const img3 = "http://localhost:3845/assets/b5944233227d4ac151fbba2229a81b6ac6ff1882.png";
const img4 = "http://localhost:3845/assets/54bf912eb6dccf4f16ab47e070b0a836f6489946.png";

export const mockCertificateInformation: CertificateInformationData = {
  artistName: "Julian Opie (b.1958)",
  artworkTitle: "Suzanne walking in leather Skirt,",
  year: "2008",
  description: [
    "Suzanne Walking in Leather Skirt is from a body of Julian Opie's work that serves a close relationship to two works commissioned through the ICA/Boston's Vita Brevis program launched in 1998. In October 2005, the ICA unveiled two walking portraits by Opie including Suzanne Walking – which served as \"ambassadors\" for the new ICA building.",
    "This work in vinyl, painted in 2008, depicts a figure moving with lightness and grace, unceasingly, as a perpetual and cyclical movement. It exemplifies Opie's signature style of reducing figures and shapes to their most essential outlines using a black line filled with a strong, clear blue color echoing the language of signs and symbols. Amazingly, it is a poignant example of the distinctive style Opie would develop throughout the years.",
  ],
  productionYear: "2024",
  objectType: "Digital Artwork",
  edition: "Edition of 3, 2 APs",
  medium:
    "Interactive video installation, computer, security camera accompanied by an ERC-721 token",
  assetType: "PNG",
  location: "United Kingdom",
  contractAddress: "0x347e860fb6176f252b88d83212040ba75e8a1168",
  contractAddressShort: "0x347e…1168",
  contractAddressUrl:
    "https://etherscan.io/address/0x347e860fb6176f252b88d83212040ba75e8a1168",
  galleryImages: [
    {
      url: img1,
      legend: "Legend",
    },
    {
      url: img2,
      legend: "Legend",
    },
    {
      url: img3,
      legend: "Legend",
    },
    {
      url: img4,
      legend: "Legend",
    },
  ],
};