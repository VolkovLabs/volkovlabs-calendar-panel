import { dateTime, FieldType, getLocaleData } from '@grafana/data';
import { renderHook } from '@testing-library/react';
import dayjs from 'dayjs';

import { ColorMode } from '../types';
import { useCalendarEvents } from './useCalendarEvents';

/**
 * Mock @grafana/data
 */
jest.mock('@grafana/data', () => ({
  ...jest.requireActual('@grafana/data'),
  getLocaleData: jest.fn(() => ({
    firstDayOfWeek: jest.fn(() => 0),
  })),
}));

/**
 * Use Calendar Events
 */
describe('useCalendarEvents', () => {
  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02 12:30');

  const defaultTimeRange = {
    from: dateTime(getSafeDate()),
    to: dateTime(getSafeDate()),
    raw: {
      from: dateTime(getSafeDate()),
      to: dateTime(getSafeDate()),
    },
  };

  it('Should return events', () => {
    const frames = [
      {
        labels: [{ values: ['label 1'] }],
        text: {
          type: FieldType.string,
          name: 'text',
          values: ['111'],
          getLinks: () => null,
        },
        start: {
          type: FieldType.string,
          name: 'start',
          values: [getSafeDate()],
        },
      },
    ];
    const { result } = renderHook(() =>
      useCalendarEvents(frames as any, { colors: ColorMode.FRAME } as any, [], defaultTimeRange, 'browser')
    );

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: '111',
          labels: ['label 1'],
        }),
      ])
    );
  });

  it('Should return events with end', () => {
    const frames = [
      {
        text: {
          type: FieldType.string,
          name: 'text',
          values: ['111'],
          getLinks: () => null,
        },
        start: {
          type: FieldType.string,
          name: 'start',
          values: [getSafeDate()],
        },
        end: {
          type: FieldType.string,
          name: 'end',
          values: [getSafeDate()],
        },
      },
    ];
    const { result } = renderHook(() =>
      useCalendarEvents(frames as any, { colors: ColorMode.FRAME } as any, [], defaultTimeRange, 'browser')
    );

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          end: dayjs(getSafeDate()),
        }),
      ])
    );
  });

  it('Should return events with local offset', () => {
    const frames = [
      {
        text: {
          type: FieldType.string,
          name: 'text',
          values: ['111'],
          getLinks: () => null,
        },
        start: {
          type: FieldType.string,
          name: 'start',
          values: [getSafeDate()],
        },
        end: {
          type: FieldType.string,
          name: 'end',
          values: [getSafeDate()],
        },
      },
    ];

    /**
     * Negative Time Zone Offset without DST
     * UTC-7:00
     */
    const { result: result1 } = renderHook(() =>
      useCalendarEvents(frames as any, { colors: ColorMode.FRAME } as any, [], defaultTimeRange, 'America/Phoenix')
    );

    expect(result1.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          start: dayjs(getSafeDate()).add(-420, 'minutes'),
          end: dayjs(getSafeDate()).add(-420, 'minutes'),
        }),
      ])
    );

    /**
     * Positive Time Zone Offset without DST
     * UTC+10:00
     */
    const { result: result2 } = renderHook(() =>
      useCalendarEvents(frames as any, { colors: ColorMode.FRAME } as any, [], defaultTimeRange, 'Australia/Brisbane')
    );

    expect(result2.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          start: dayjs(getSafeDate()).add(600, 'minutes'),
          end: dayjs(getSafeDate()).add(600, 'minutes'),
        }),
      ])
    );

    /**
     * Zero Time Zone Offset
     * UTC
     */
    const { result: result3 } = renderHook(() =>
      useCalendarEvents(frames as any, { colors: ColorMode.FRAME } as any, [], defaultTimeRange, 'utc')
    );

    expect(result3.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          start: dayjs(getSafeDate()),
          end: dayjs(getSafeDate()),
        }),
      ])
    );
  });

  it('Should return event with displayed text', () => {
    const frames = [
      {
        text: {
          type: FieldType.string,
          name: 'text',
          values: ['111'],
          getLinks: () => null,
          display: () => ({ text: 'displayed' }),
        },
        start: {
          type: FieldType.string,
          name: 'start',
          values: [getSafeDate()],
        },
        end: {
          type: FieldType.string,
          name: 'end',
          values: [getSafeDate()],
        },
      },
    ];
    const { result } = renderHook(() =>
      useCalendarEvents(frames as any, { colors: ColorMode.FRAME } as any, [], defaultTimeRange, 'browser')
    );

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: 'displayed',
        }),
      ])
    );
  });

  it('Should not return event without start', () => {
    const frames = [
      {
        labels: [{ values: ['label 1'] }],
        text: {
          type: FieldType.string,
          name: 'text',
          values: ['111'],
          getLinks: () => null,
        },
      },
    ];
    const { result } = renderHook(() =>
      useCalendarEvents(frames as any, { colors: ColorMode.FRAME } as any, [], defaultTimeRange, 'browser')
    );

    expect(result.current).toHaveLength(0);
  });

  it('Should return event with isoWeek date', () => {
    jest.mocked(getLocaleData).mockImplementationOnce(() => ({
      firstDayOfWeek: jest.fn(() => 1),
    }));
    const frames = [
      {
        text: {
          type: FieldType.string,
          name: 'text',
          values: ['111'],
          getLinks: () => null,
        },
        start: {
          type: FieldType.string,
          name: 'start',
          values: [getSafeDate()],
        },
        end: {
          type: FieldType.string,
          name: 'end',
          values: [],
        },
      },
    ];
    const { result } = renderHook(() =>
      useCalendarEvents(frames as any, { colors: ColorMode.FRAME } as any, [], defaultTimeRange, 'browser')
    );

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          end: dayjs(getSafeDate()),
        }),
      ])
    );
  });

  it('Should return events with description', () => {
    const frames = [
      {
        labels: [{ values: ['label 1'] }],
        text: {
          type: FieldType.string,
          name: 'text',
          values: ['111'],
          getLinks: () => null,
          display: () => ({ text: 'displayed' }),
        },
        start: {
          type: FieldType.string,
          name: 'start',
          values: [getSafeDate()],
        },
        end: {
          type: FieldType.string,
          name: 'end',
          values: [getSafeDate()],
        },
        description: [
          {
            type: FieldType.string,
            name: 'description',
            values: ['description 1'],
          },
        ],
      },
    ];
    const { result } = renderHook(() =>
      useCalendarEvents(
        frames as any,
        { colors: 'frame', descriptionField: ['description'] } as any,
        [],
        defaultTimeRange,
        'browser'
      )
    );

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          description: ['description 1'],
        }),
      ])
    );
  });

  it('Should return events with description in correct order', () => {
    const frames = [
      {
        labels: [{ values: ['label 1'] }],
        text: {
          type: FieldType.string,
          name: 'text',
          values: ['111'],
          getLinks: () => null,
          display: () => ({ text: 'displayed' }),
        },
        start: {
          type: FieldType.string,
          name: 'start',
          values: [getSafeDate()],
        },
        end: {
          type: FieldType.string,
          name: 'end',
          values: [getSafeDate()],
        },
        description: [
          {
            type: FieldType.string,
            name: 'description',
            values: ['description 1'],
          },
          {
            type: FieldType.string,
            name: 'description2',
            values: ['description 2'],
          },
          {
            type: FieldType.string,
            name: 'description3',
            values: ['description 3'],
          },
        ],
      },
    ];
    const { result } = renderHook(() =>
      useCalendarEvents(
        frames as any,
        { colors: 'frame', descriptionField: ['description2', 'description', 'description3'] } as any,
        [],
        defaultTimeRange,
        'browser'
      )
    );

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          description: ['description 2', 'description 1', 'description 3'],
        }),
      ])
    );
  });

  it('Should not return events with description if options not specified', () => {
    const frames = [
      {
        labels: [{ values: ['label 1'] }],
        text: {
          type: FieldType.string,
          name: 'text',
          values: ['111'],
          getLinks: () => null,
          display: () => ({ text: 'displayed' }),
        },
        start: {
          type: FieldType.string,
          name: 'start',
          values: [getSafeDate()],
        },
        end: {
          type: FieldType.string,
          name: 'end',
          values: [getSafeDate()],
        },
        description: [
          {
            type: FieldType.string,
            name: 'description',
            values: ['description 1'],
          },
        ],
      },
    ];
    const { result } = renderHook(() =>
      useCalendarEvents(
        frames as any,
        { colors: 'frame', descriptionField: [] } as any,
        [],
        defaultTimeRange,
        'browser'
      )
    );

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          description: [],
        }),
      ])
    );
  });

  it('Should not return events with description if options specified incorrect', () => {
    const frames = [
      {
        labels: [{ values: ['label 1'] }],
        text: {
          type: FieldType.string,
          name: 'text',
          values: ['111'],
          getLinks: () => null,
          display: () => ({ text: 'displayed' }),
        },
        start: {
          type: FieldType.string,
          name: 'start',
          values: [getSafeDate()],
        },
        end: {
          type: FieldType.string,
          name: 'end',
          values: [getSafeDate()],
        },
        description: [
          {
            type: FieldType.string,
            name: 'description',
            values: ['description 1'],
          },
        ],
      },
    ];
    const { result } = renderHook(() =>
      useCalendarEvents(
        frames as any,
        { colors: 'frame', descriptionField: ['des'] } as any,
        [],
        defaultTimeRange,
        'browser'
      )
    );

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          description: [],
        }),
      ])
    );
  });

  it('Should return event with override color if thresholds specified', () => {
    const frames = [
      {
        text: {
          type: FieldType.string,
          name: 'text',
          values: ['111'],
          getLinks: () => null,
          display: () => ({ text: 'displayed' }),
        },
        start: {
          type: FieldType.string,
          name: 'start',
          values: [getSafeDate()],
        },
        end: {
          type: FieldType.string,
          name: 'end',
          values: [getSafeDate()],
        },
        color: {
          type: FieldType.number,
          name: 'color',
          values: ['50'],
          getLinks: () => null,
          display: () => ({ color: '#FF7383' }),
        },
      },
    ];
    const { result } = renderHook(() =>
      useCalendarEvents(
        frames as any,
        { colors: ColorMode.THRESHOLDS } as any,
        ['#000000', '#ffffff'],
        defaultTimeRange,
        'browser'
      )
    );
    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: frames[0].color.display().color,
        }),
      ])
    );
  });

  it('Should return event with color if thresholds is not specified', () => {
    const colors = ['#000000', '#ffffff'];
    const frames = [
      {
        text: {
          type: FieldType.string,
          name: 'text',
          values: ['111'],
          getLinks: () => null,
          display: () => ({ text: 'displayed' }),
        },
        start: {
          type: FieldType.string,
          name: 'start',
          values: [getSafeDate()],
        },
        end: {
          type: FieldType.string,
          name: 'end',
          values: [getSafeDate()],
        },
        color: {
          type: FieldType.number,
          name: 'color',
          values: ['50'],
          getLinks: () => null,
          display: () => ({ color: '#FF7383' }),
        },
      },
    ];
    const { result } = renderHook(() =>
      useCalendarEvents(frames as any, { colors: ColorMode.FRAME } as any, colors, defaultTimeRange, 'browser')
    );
    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: colors[0],
        }),
      ])
    );
  });
});
