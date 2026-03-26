import { ScrollySection } from '../scrollytelling/ScrollySection';
import { CrisisVisual } from './CrisisVisual';

const STEPS = [
  {
    id: 'pre-crisis',
    title: '141 ships a day',
    titleColor: 'var(--color-ink)',
    text: 'February 27, 2026. Normal operations. Oil tankers, gas carriers, container ships — threading through the strait in an orderly procession that has continued, almost without interruption, for decades.',
  },
  {
    id: 'day-1',
    title: 'The strike',
    titleColor: 'var(--color-accent)',
    text: 'February 28. Operation Epic Fury begins. US and Israeli forces strike Iranian military installations and nuclear facilities. Iran\'s Supreme Leader is killed. Within hours, the IRGC mobilises fast-attack boats, coastal missiles, and naval mines across the strait.',
  },
  {
    id: 'day-3',
    title: 'Three ships',
    titleColor: 'var(--color-accent)',
    text: 'March 3. Only three vessels transit the strait. Lloyd\'s and other insurers quadruple war-risk premiums overnight. Within days, coverage becomes unobtainable at any price. Major shipping companies evacuate every vessel from the Gulf.',
  },
  {
    id: 'day-7',
    title: 'The shutdown',
    titleColor: 'var(--color-accent-warm)',
    text: 'March 7. Four transits. One hundred and fifty laden tankers are anchored outside the strait, unable to enter. Eight million barrels of crude per day — stranded with no route to market. The world has never seen a supply disruption of this scale.',
  },
  {
    id: 'day-11',
    title: 'Emergency measures',
    titleColor: 'var(--color-ink)',
    text: 'March 11. The IEA orders the release of 400 million barrels from strategic reserves — the largest coordinated release in history. It covers roughly 25 days of disrupted supply. A stopgap. Not a solution.',
  },
  {
    id: 'day-13',
    title: 'Selective reopening',
    titleColor: 'var(--color-ink)',
    text: 'March 13. Iran allows Indian, Turkish, and Saudi ships through under military escort. Transits rise to 22 per day — still 83% below normal. The strait is not closed. It is not open. It is controlled.',
  },
];

export function CrisisScrolly() {
  return (
    <ScrollySection
      steps={STEPS.map((s) => ({
        id: s.id,
        content: (
          <div>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, color: s.titleColor, marginBottom: '0.75rem' }}>
              {s.title}
            </p>
            <p>{s.text}</p>
          </div>
        ),
      }))}
      visual={(activeStep) => <CrisisVisual activeStep={activeStep} />}
    />
  );
}
