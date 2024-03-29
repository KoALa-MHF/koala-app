import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Tutorial und Handbuch',
    Svg: require('@site/static/img/menu_book.svg').default,
    description: <>Ein Handbuch für Koala.</>,
  },
  {
    title: 'API Dokumentation',
    Svg: require('@site/static/img/api_webhook_icon.svg').default,
    description: <>Entwickler Dokumentation. Datenmodell etc… Für alle die tiefer in Koala einsteigen wollen.</>,
  },
  {
    title: 'Blog',
    Svg: require('@site/static/img/rss_feed.svg').default,
    description: <>Neuigkeiten aus der Entwicklung und zu Einsatzmöglichekeiten der Koala-App.</>,
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
