import React, { useState } from 'react';

export interface Feature {
  name: string;
  desc: string;
}

export interface FeatureGroup {
  label: string;
  features: Feature[];
}

interface FeatureCatalogProps {
  groups: FeatureGroup[];
}

const FeatureCatalog: React.FC<FeatureCatalogProps> = ({ groups }) => {
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  return (
    <div className="mt-12 md:mt-16 border-t border-white/10">
      {groups.map((group, i) => {
        const isOpen = openLabel === group.label;
        const panelId = `capability-panel-${i}`;

        return (
          <div key={group.label} className="border-b border-white/10">
            <h3 className="m-0">
              <button
                type="button"
                onClick={() => setOpenLabel(isOpen ? null : group.label)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="group flex w-full items-center gap-4 sm:gap-6 py-5 sm:py-6 text-left"
              >
                <span className="w-6 shrink-0 font-heading text-[11px] sm:text-xs tabular-nums text-cyan-300/60">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-heading text-lg sm:text-2xl font-light tracking-tight text-white/80 transition-colors duration-300 group-hover:text-white">
                  {group.label}
                </span>
                <span className="shrink-0 text-[10px] tabular-nums uppercase tracking-[0.25em] text-white/30">
                  {String(group.features.length).padStart(2, '0')}
                </span>
                <span
                  className="relative h-3.5 w-3.5 shrink-0 text-white/40 transition-colors duration-300 group-hover:text-cyan-300"
                  aria-hidden="true"
                >
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                  <span
                    className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-300 ${
                      isOpen ? 'scale-y-0' : 'scale-y-100'
                    }`}
                  />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              style={{
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 450ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div className="overflow-hidden">
                <div
                  className="grid gap-x-10 gap-y-5 pb-8 pl-10 pr-2 sm:grid-cols-2 sm:pl-12 transition-opacity duration-500"
                  style={{ opacity: isOpen ? 1 : 0 }}
                >
                  {group.features.map((feature) => (
                    <div key={feature.name} className="flex items-start gap-3">
                      <span className="mt-[6px] block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300/90 shadow-[0_0_10px_rgba(94,234,212,0.6)]" />
                      <div>
                        <h4 className="text-sm sm:text-[15px] font-medium tracking-tight text-white/90">
                          {feature.name}
                        </h4>
                        <p className="mt-1 text-[13px] font-light leading-relaxed text-white/45">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeatureCatalog;
