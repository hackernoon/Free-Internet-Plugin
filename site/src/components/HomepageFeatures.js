import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'A Free Internet is a Better Internet',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        If the individual doesn’t want to run into a paywall, they should be able 
       to filter paywalled content out of its search results and newsfeeds.
      </>
    ),
  },
  {
    title: 'Your Browser, Your Results',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        The business model of paywalls - i.e. annoy the user with a bait and switch ads
      for paying to read - hinders the internet’s ability to be an open experience <code>docs</code> directory.
      </>
    ),
  },
  {
    title: 'Lets Build a Free Internet Together',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        When the free web is more accessible, knowledge proliferates. This open source
      project by HackerNoon is open to more contributors. How can we <i>free the internet?</i> 
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
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
