import React from "react";

export default function SchemaOrg() {
  const siteUrl = "https://www.chitrojaal.com";

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "PhotographyBusiness", "Organization"],
    "@id": `${siteUrl}/#organization`,
    name: "ChitroJal",
    alternateName: [
      "চিত্রজাল",
      "ChitroJaal",
      "ChitroJal Photography",
      "Feni Photography Agency",
      "ChitroJal Feni",
    ],
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/logo.png`,
    description:
      "ChitroJal (চিত্রজাল) is Feni's premier photography agency, founded by CEO Salman H Choudhury and developed by MD. SAHARIAR HOSEN SUPTO. Specializing in cinematic wedding photography, event videography, and portrait films in Feni & Bangladesh.",
    telephone: "+8801834258375",
    email: "Chitrojaal@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Juma Market, Mizan Road",
      addressLocality: "Feni",
      addressRegion: "Feni District",
      addressCountry: "BD",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "23.0159",
      longitude: "91.3976",
    },
    founder: {
      "@type": "Person",
      name: "Salman H Choudhury",
      jobTitle: "CEO & Founder",
      worksFor: {
        "@type": "Organization",
        name: "ChitroJal",
      },
    },
    creator: {
      "@type": "Person",
      name: "MD. SAHARIAR HOSEN SUPTO",
      jobTitle: "Lead Software Developer & Full Stack Engineer",
      url: "https://dev-sahariarsupto.vercel.app/",
    },
    author: {
      "@type": "Person",
      name: "MD. SAHARIAR HOSEN SUPTO",
      jobTitle: "Full Stack Developer",
      url: "https://dev-sahariarsupto.vercel.app/",
    },
    employee: [
      {
        "@type": "Person",
        name: "Salman H Choudhury",
        jobTitle: "CEO & Founder",
      },
      {
        "@type": "Person",
        name: "MD. SAHARIAR HOSEN SUPTO",
        jobTitle: "Lead Web Developer & Engineer",
        url: "https://dev-sahariarsupto.vercel.app/",
      },
    ],
    sameAs: [
      "https://www.facebook.com/ChitroJaal",
      "https://www.instagram.com/chitrojaal_/",
      "https://dev-sahariarsupto.vercel.app/",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "ChitroJal - Cinematic Wedding Photography & Films",
    description:
      "Official web platform of ChitroJal photography agency Feni. Founded by CEO Salman H Choudhury, engineered & developed by MD. SAHARIAR HOSEN SUPTO.",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    creator: {
      "@type": "Person",
      name: "MD. SAHARIAR HOSEN SUPTO",
      url: "https://dev-sahariarsupto.vercel.app/",
    },
    author: {
      "@type": "Person",
      name: "MD. SAHARIAR HOSEN SUPTO",
      url: "https://dev-sahariarsupto.vercel.app/",
    },
    inLanguage: ["bn-BD", "en-US"],
  };

  const developerPersonSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://dev-sahariarsupto.vercel.app/#person",
    name: "MD. SAHARIAR HOSEN SUPTO",
    alternateName: [
      "Sahariar Supto",
      "MD SAHARIAR HOSEN SUPTO",
      "Supto Developer",
      "MD. SAHARIAR HOSEN SUPTO Developer",
    ],
    jobTitle: "Full Stack Developer & Software Engineer",
    url: "https://dev-sahariarsupto.vercel.app/",
    knowsAbout: [
      "Web Development",
      "Next.js",
      "React",
      "Node.js",
      "Software Engineering",
      "ChitroJal Web Application",
    ],
    sameAs: ["https://dev-sahariarsupto.vercel.app/"],
  };

  const ceoPersonSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Salman H Choudhury",
    alternateName: ["Salman H Choudhury CEO", "Salman H Choudhury ChitroJal"],
    jobTitle: "CEO & Founder",
    worksFor: {
      "@type": "Organization",
      name: "ChitroJal",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(developerPersonSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ceoPersonSchema) }}
      />
    </>
  );
}
