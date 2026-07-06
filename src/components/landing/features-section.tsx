'use client';

import { Feature } from '@/types';

interface FeaturesSectionProps {
  features: Feature[];
  title?: string;
  primaryColor: string;
}

export default function FeaturesSection({
  features,
  title,
  primaryColor,
}: FeaturesSectionProps) {
  if (features.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title || 'Core Features'}
          </h2>
          <div
            className="w-20 h-1 mx-auto rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-gray-700 transition-colors"
            >
              {feature.image ? (
                <img src={feature.image} alt={feature.title} className="w-full h-40 object-cover rounded-lg mb-4" />
              ) : (
                <div className="text-4xl mb-4">📷</div>
              )}
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
