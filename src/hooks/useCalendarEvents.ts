import { formattedValueToString, getLocaleData, TimeRange } from '@grafana/data';
import { TimeZone } from '@grafana/schema';
import dayjs, { OpUnitType } from 'dayjs';
import { useMemo } from 'react';

import { CalendarEvent, CalendarOptions, ColorMode } from '../types';
import { getMinutesOffsetFromTimeZone } from '../utils';
import { useEventFrames } from './useEventFrames';

/**
 * Get Calendar Events
 * @param frames
 * @param options
 * @param colors
 * @param timeRange
 * @param timeZone
 */
export const useCalendarEvents = (
  frames: ReturnType<typeof useEventFrames>,
  options: CalendarOptions,
  colors: string[],
  timeRange: TimeRange,
  timeZone: TimeZone
): CalendarEvent[] => {
  /**
   * Week Start
   */
  const firstDay = getLocaleData().firstDayOfWeek() === 0 ? 'week' : 'isoWeek';

  /**
   * Minutes Offset from Browser Time Zone
   */
  const minutesOffset = getMinutesOffsetFromTimeZone(timeZone);

  return useMemo(() => {
    const to = dayjs(timeRange.to.valueOf()).add(minutesOffset, 'minutes');
    const endOfRangeWeek = to.endOf(firstDay as OpUnitType);

    return frames.flatMap((frame, frameIdx) => {
      const colorFn = frame.color?.display;

      if (!frame.text || !frame.start) {
        return [];
      }

      return Array.from({ length: frame.text.values.length })
        .map((item, i) => {
          /**
           * Define description with correct order
           */
          const description =
            options.descriptionField
              ?.map((name) => frame.description.find((obj) => obj.name === name))
              .map((field) => field?.values[i])
              .filter((label) => label) || [];

          return {
            text: frame.text?.display
              ? (formattedValueToString(frame.text.display(frame.text?.values[i])) as string)
              : frame.text?.values[i],
            description: description,
            start: frame.start?.values[i],
            end: frame.end?.values[i],
            labels: frame.labels?.map((field) => field.values[i]).filter((label) => label),
            links: frame.text?.getLinks!({ valueRowIndex: i }),
            color: frame.color?.values[i],
            location: frame.location?.values[i],
          };
        })
        .map<CalendarEvent>(({ text, description, labels, links, start, end, color, location }, i) => {
          const idx = options.colors === ColorMode.FRAME ? frameIdx : i;
          return {
            text,
            description,
            labels,
            start: dayjs(start).add(minutesOffset, 'minutes'),
            color:
              (options.colors === ColorMode.THRESHOLDS && colorFn?.(color).color) ||
              colors[Math.floor(idx % colors.length)],
            links,
            end: frame.end ? (end ? dayjs(end).add(minutesOffset, 'minutes') : endOfRangeWeek) : undefined,
            location,
          };
        });
    });
  }, [timeRange.to, minutesOffset, firstDay, frames, options.descriptionField, options.colors, colors]);
};
