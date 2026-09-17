/**
 * .progressBar — the determinate progress bar.
 *
 * Figma node: 84:26
 * https://www.figma.com/design/2k87mtkZMvxQIYwjLX82pu/Horizon.Web.Component.V1.0.In-Progress?node-id=84-26
 *
 * Matrix, read live off the node — four variant rows and one boolean, so
 * 4 x 2 = 8 cells:
 *   tone   primary | positive | negative | warning   (84:2, 84:8, 84:14, 84:20)
 *   meta   boolean — shows the label / value row above the track
 *   label  text
 *   value  text
 *
 * Structure: root column (gap 2xs) > Meta row (84:3) + Track (84:6) > Fill.
 *
 * `value` is a number here, not Figma's string. The node encodes progress by
 * resizing the Fill layer — its own description says "Resize the Fill layer to
 * set the value" — which has no property to match, while the `value` property
 * only carries the text shown on the right. One number drives both, so the
 * label can never disagree with the bar. The name is Figma's; the type is the
 * smallest change that makes the component actually determinate, and it is
 * recorded in docs/progressBar-naming.md.
 *
 * The node's frame is a fixed 320px. That is the artboard width, not a
 * constraint of the component: the Track inside it is `w-full`, so the bar is
 * fluid and the root takes the width its container gives it. Stories set 320
 * to reproduce the node exactly.
 */

import type { HTMLAttributes } from 'react';

export type ProgressBarTone = 'primary' | 'positive' | 'negative' | 'warning';

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma's `tone` variant axis. */
  tone?: ProgressBarTone;
  /** Figma's `meta` boolean — the label / value row above the track. */
  meta?: boolean;
  /** Figma's `label` text property. */
  label?: string;
  /**
   * Progress, 0-100. Drives the Fill's width and the text on the right, which
   * the node keeps as separate concerns. Clamped, so a caller cannot paint a
   * bar past either end of its track.
   */
  value?: number;
}

export function ProgressBar({
  tone = 'primary',
  meta = true,
  label = 'Uploading',
  value = 60,
  ...rest
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div
      className="hds-progressBar"
      data-tone={tone}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={meta ? undefined : label}
      {...rest}
    >
      {meta && (
        <div className="hds-progressBar__meta">
          <span className="hds-progressBar__label">{label}</span>
          <span className="hds-progressBar__value">{pct}%</span>
        </div>
      )}

      <div className="hds-progressBar__track">
        <div className="hds-progressBar__fill" style={{ inlineSize: `${pct}%` }} />
      </div>
    </div>
  );
}
