import { TFunction } from 'i18next';

import { AnnotationsType, CalendarType, ColorMode, DateFormat, View } from '../types';

/**
 * Links Options
 */
export const LINK_OPTIONS = (t: TFunction) => [
  { value: true, label: t('panelOptions.quickLinks.options.enabled') },
  { value: false, label: t('panelOptions.quickLinks.options.disabled') },
];

/**
 * Scroll Options
 */
export const SCROLL_OPTIONS = (t: TFunction) => [
  { value: true, label: t('panelOptions.autoScroll.options.enabled') },
  { value: false, label: t('panelOptions.autoScroll.options.disabled') },
];

/**
 * Display Time Options
 */
export const DISPLAY_TIME_OPTIONS = (t: TFunction) => [
  { value: true, label: t('panelOptions.displayTime.options.enabled') },
  { value: false, label: t('panelOptions.displayTime.options.disabled') },
];

/**
 * Color Options
 */
export const COLOR_OPTIONS = (t: TFunction) => [
  { value: ColorMode.FRAME, label: t('panelOptions.colors.options.frame') },
  { value: ColorMode.EVENT, label: t('panelOptions.colors.options.event') },
];

/**
 * Calendar Type Options
 */
export const CALENDAR_TYPE_OPTIONS = (t: TFunction) => [
  { value: CalendarType.LEGACY, label: t('panelOptions.calendarType.options.legacy') },
  { value: CalendarType.BIG_CALENDAR, label: t('panelOptions.calendarType.options.bigCalendar') },
];

/**
 * Annotations Options
 */
export const ANNOTATIONS_OPTIONS = (t: TFunction) => [
  { value: true, label: t('panelOptions.annotations.annotations.options.enabled') },
  { value: false, label: t('panelOptions.annotations.annotations.options.disabled') },
];

/**
 * Annotations Type Options
 */
export const ANNOTATIONS_TYPE_OPTIONS = (t: TFunction) => [
  { value: AnnotationsType.ALL, label: t('panelOptions.annotations.annotationsType.options.all') },
  { value: AnnotationsType.ALERT, label: t('panelOptions.annotations.annotationsType.options.alert') },
  { value: AnnotationsType.ANNOTATION, label: t('panelOptions.annotations.annotationsType.options.annotation') },
];

/**
 * Calendar View Options
 */
export const CALENDAR_VIEW_OPTIONS = (t: TFunction) => [
  { value: View.DAY, label: t('panelOptions.views.options.day') },
  { value: View.WEEK, label: t('panelOptions.views.options.week') },
  { value: View.WORK_WEEK, label: t('panelOptions.views.options.workWeek') },
  { value: View.MONTH, label: t('panelOptions.views.options.month') },
  { value: View.YEAR, label: t('panelOptions.views.options.year') },
];

/**
 * Date Format Options
 */
export const DATE_FORMAT_OPTIONS = (t: TFunction) =>
  Object.values(DateFormat).map((format) => ({
    value: format,
    label: t(`panelOptions.dateFormat.options.${format}`),
  }));
