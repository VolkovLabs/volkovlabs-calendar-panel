import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { TEST_IDS } from '../../constants';
import { BigToolbar } from './BigToolbar';

/**
 * Props
 */
type Props = React.ComponentProps<typeof BigToolbar>;

/**
 * Toolbar
 */
describe('Toolbar', () => {
  /**
   * Get Tested Component
   * @param props
   */
  const getComponent = (props: Partial<Props>) => {
    return <BigToolbar localizer={{ messages: {} }} {...(props as any)} />;
  };

  it('Should render navigation buttons', () => {
    const onNavigate = jest.fn();
    render(getComponent({ onNavigate }));

    /**
     * Today button
     */
    expect(screen.getByTestId(TEST_IDS.bigCalendarToolbar.buttonToday)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(TEST_IDS.bigCalendarToolbar.buttonToday));
    expect(onNavigate).toHaveBeenCalledWith('TODAY');

    /**
     * Back Button
     */
    expect(screen.getByTestId(TEST_IDS.bigCalendarToolbar.buttonBack)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(TEST_IDS.bigCalendarToolbar.buttonBack));
    expect(onNavigate).toHaveBeenCalledWith('PREV');

    /**
     * Next Button
     */
    expect(screen.getByTestId(TEST_IDS.bigCalendarToolbar.buttonNext)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(TEST_IDS.bigCalendarToolbar.buttonNext));
    expect(onNavigate).toHaveBeenCalledWith('NEXT');
  });

  it('Should render view buttons', () => {
    const onView = jest.fn();
    render(getComponent({ onView, views: ['month', 'week'] }));

    expect(screen.getByTestId(TEST_IDS.bigCalendarToolbar.buttonView('week'))).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(TEST_IDS.bigCalendarToolbar.buttonView('week')));
    expect(onView).toHaveBeenCalledWith('week');
  });
});
