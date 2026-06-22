import React from 'react';
import { motion } from 'framer-motion';
import FeatureCatalog, { FeatureGroup } from './FeatureCatalog';

const GROUPS: FeatureGroup[] = [
  {
    label: 'Anomaly detection',
    features: [
      {
        name: 'Basic anomalies',
        desc: 'Holding patterns, speed, turn and climb/descent deviations, go-arounds, low-altitude flight and off-course tracks.',
      },
      {
        name: 'Safety anomalies',
        desc: 'Close approaches and conflicts between aircraft, flagged as they develop.',
      },
      {
        name: 'Emergency anomalies',
        desc: 'Distress squawk codes and crash-pattern behaviour surfaced the moment they appear.',
      },
      {
        name: 'L1: declared vs real',
        desc: 'Cross-checks what an aircraft declares against how it physically flies.',
      },
      {
        name: 'L2: peer comparison',
        desc: 'Compares an aircraft to others of the same model to expose outliers.',
      },
      {
        name: 'L3: self comparison',
        desc: 'Compares an aircraft to its own history to catch behaviour abnormal for it.',
      },
    ],
  },
  {
    label: 'Map & airspace',
    features: [
      {
        name: 'Airways map',
        desc: 'Every air route, flight corridor and path between any two points.',
      },
      {
        name: 'Aircraft track history',
        desc: 'The full route of an aircraft over time, not just its current flight.',
      },
      {
        name: 'NOTAM integration',
        desc: 'Official aviation alerts pulled live and layered onto the map.',
      },
      {
        name: 'Points of interest',
        desc: 'Airports, military bases and strategic sites as icons with detail on click, worldwide.',
      },
    ],
  },
  {
    label: 'Spoofing & jamming',
    features: [
      {
        name: 'Spoofing map',
        desc: 'Detect spoofing across the arena and investigate aircraft, live or in history.',
      },
      {
        name: 'GPS-jamming heatmap',
        desc: 'A daily-updated heatmap of jamming: who was hit, when, and their flight course.',
      },
      {
        name: 'Transponder-shutoff detection',
        desc: 'Catches aircraft that vanish by killing ADS-B to move under electronic darkness.',
      },
    ],
  },
  {
    label: 'Alerts',
    features: [
      {
        name: 'Security alert',
        desc: 'Warns when a suspicious aircraft approaches or rubs against national airspace.',
      },
      {
        name: 'Non-corridor crossing',
        desc: 'Flags entry into airspace outside the official entry corridor.',
      },
    ],
  },
  {
    label: 'Prediction',
    features: [
      {
        name: 'Route prediction',
        desc: 'Predicts the path an aircraft will fly home, from its history and known routes.',
      },
      {
        name: 'Missing-data inference',
        desc: 'Infers destination and probable origin for aircraft flying without a declared target.',
      },
    ],
  },
  {
    label: 'Classification',
    features: [
      {
        name: 'Real-time classifier',
        desc: 'When the data is missing, kinematics (speed, altitude, turn rate) reveal fighter vs UAV vs cargo.',
      },
    ],
  },
  {
    label: 'Investigation chat',
    features: [
      {
        name: 'Chat modes',
        desc: 'Deep, fast and fully on-prem chat.',
      },
      {
        name: 'Event chat',
        desc: 'Investigate a single flight in natural language.',
      },
      {
        name: 'Macro chat',
        desc: 'Question the whole arena, connect events and understand the bigger picture.',
      },
    ],
  },
  {
    label: 'Replay & reporting',
    features: [
      {
        name: '3D investigation',
        desc: 'Replay an event in 3D over satellite imagery, from any angle.',
      },
      {
        name: 'Event-to-report',
        desc: 'Cut any event from the timeline into a polished, distribution-ready report.',
      },
      {
        name: 'Daily intelligence report',
        desc: 'An automatic daily summary of every anomaly in the arena, exported for you.',
      },
    ],
  },
  {
    label: 'Time machine',
    features: [
      {
        name: 'Sky history',
        desc: 'Rewind to any date and time. Anomalies, jamming and weather included.',
      },
      {
        name: 'Weather layer',
        desc: 'Toggle live weather, and replay it through history.',
      },
    ],
  },
  {
    label: 'Planning & simulation',
    features: [
      {
        name: 'Mission planner',
        desc: 'Score risk across future date and time windows to find the optimal moment, by polygon or flight path.',
      },
      {
        name: 'System simulator',
        desc: 'A live simulation mode to test systems and algorithms and train on scenarios.',
      },
    ],
  },
];

const TracerSection: React.FC = () => {
  return (
    <section
      id="tracer"
      className="relative w-full flex items-center justify-center px-safe py-24 md:py-32"
    >
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-3 text-cyan-300/70 text-[10px] tracking-[0.32em] font-bold uppercase">
              <span className="block w-8 h-px bg-cyan-300/40" />
              02 — Tracer 42
              <span className="block w-8 h-px bg-cyan-300/40" />
            </div>
            <h2 className="font-display text-[clamp(1.875rem,8vw,2.75rem)] md:text-7xl font-light leading-[1.05] md:leading-[1.02] tracking-tight">
              The eye on{' '}
              <span className="italic font-normal text-white">every</span> aircraft.
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
            className="mt-8 md:mt-10 mx-auto text-white/65 text-base md:text-xl leading-relaxed font-light max-w-2xl"
          >
            Tracer 42 monitors, detects, classifies and reports on anything moving through
            global airspace, in real time. Open any capability set to see what ships inside.
          </motion.p>
        </div>

        <FeatureCatalog groups={GROUPS} />
      </div>
    </section>
  );
};

export default TracerSection;
