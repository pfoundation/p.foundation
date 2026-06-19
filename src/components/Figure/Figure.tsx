import clsx from 'clsx';
import React, { FunctionComponent, ReactNode } from 'react';

import styles from './Figure.module.scss';

export interface FigureProps {
  /** Image source URL. */
  src: string;
  /** Alt text for assistive technology. */
  alt?: string;
  /** Optional max width (e.g. '760px') to constrain narrow images. */
  maxWidth?: string;
  /** Visible caption rendered beneath the image. */
  children?: ReactNode;
  className?: string;
}

/**
 * Framed figure for update posts: a bordered surface that holds an image with
 * an optional caption beneath it. Builds on the shared `card` recipe so it
 * inherits the square-corner, dark-theme tokens automatically.
 */
const Figure: FunctionComponent<FigureProps> = ({
  src,
  alt = '',
  maxWidth,
  children,
  className,
}) => (
  <figure
    className={clsx('card', styles.figure, className)}
    style={maxWidth ? { maxWidth } : undefined}
  >
    <img
      className={styles.image}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
    {children && <figcaption className={styles.caption}>{children}</figcaption>}
  </figure>
);

export default Figure;
