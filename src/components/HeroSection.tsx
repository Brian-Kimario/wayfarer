import React from "react";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  children,
}: HeroSectionProps) {
  return (
    <section
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden"
      style={{
        backgroundColor: "var(--color-ocean-950)",
      }}
    >
      {/* Background image overlay */}
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.3,
            }}
          />
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(18, 59, 74, 0.8) 0%, rgba(30, 102, 120, 0.8) 100%)",
            }}
          />
        </>
      )}

      {/* Content */}
      <div className="container-page relative z-10">
        <div className="max-w-2xl">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            style={{ color: "white" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="text-lg md:text-xl mb-8 opacity-90"
              style={{ color: "white" }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Children (typically search widget) */}
        {children && <div className="mt-8 md:mt-12">{children}</div>}
      </div>
    </section>
  );
}
