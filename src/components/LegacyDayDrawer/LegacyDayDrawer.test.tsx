import { fireEvent, render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';

import { TEST_IDS } from '../../constants';
import { CalendarEvent } from '../../types';
import { LegacyDayDrawer } from './LegacyDayDrawer';

/**
 * Component Props
 */
type Props = React.ComponentProps<typeof LegacyDayDrawer>;

/**
 * Day Drawer
 */
describe('DayDrawer', () => {
  const onClose = jest.fn();

  /**
   * Get Tested Component
   * @param restProps
   */
  const getComponent = ({ ...restProps }: Partial<Props>) => {
    return <LegacyDayDrawer onClose={onClose} {...(restProps as any)} />;
  };

  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

  it('Should find component', async () => {
    const day = dayjs(getSafeDate());

    render(
      getComponent({
        day,
        events: {
          [day.format('YYYY-MM-DD')]: [],
        },
      })
    );

    expect(screen.getByLabelText(TEST_IDS.dayDrawer.root(day.format('LL')))).toBeInTheDocument();
  });

  it('Should find component if day is not specified', () => {
    render(
      getComponent({
        day: null as any,
        events: {},
      })
    );

    expect(screen.getByLabelText(TEST_IDS.dayDrawer.root('Day'))).toBeInTheDocument();
  });

  it('Should render event', () => {
    const day = dayjs(getSafeDate());
    const onEventClick = jest.fn();

    const event: CalendarEvent = {
      text: 'event 1',
      start: day,
      labels: [],
      color: '#999999',
      links: [
        {
          title: 'link',
          onClick: onEventClick,
          href: '/',
        } as any,
        {
          title: 'link 2',
          onClick: jest.fn(),
          href: '/',
          target: '_self',
        } as any,
      ],
    };

    render(
      getComponent({
        day,
        events: {
          [day.format('YYYY-MM-DD')]: [event],
        },
        event,
      })
    );

    expect(screen.getByTestId(TEST_IDS.eventDetails.root)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.eventDetails.titleText)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.eventDetails.titleText)).toContainHTML(event.text);

    /**
     * Click event link
     */
    fireEvent.click(screen.getAllByLabelText(TEST_IDS.eventDetails.link)[0]);

    expect(onEventClick).toHaveBeenCalled();
  });

  it('Should render day events', () => {
    const day = dayjs(getSafeDate());
    const setEvent = jest.fn();

    const event: CalendarEvent = {
      text: 'event 1',
      start: day,
      end: day,
      labels: [],
      color: '#999999',
    };

    render(
      getComponent({
        day,
        events: {
          [day.format('YYYY-MM-DD')]: [event, null as any],
        },
        setEvent,
      })
    );

    const dayEvents = screen.getAllByTestId(TEST_IDS.eventDetails.root);

    expect(dayEvents[0]).toBeInTheDocument();
    expect(dayEvents).toHaveLength(1);

    /**
     * Click on event
     */
    expect(screen.getByLabelText(TEST_IDS.eventDetails.titleButton)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(TEST_IDS.eventDetails.titleButton));

    expect(setEvent).toHaveBeenCalledWith(event);
  });
});
