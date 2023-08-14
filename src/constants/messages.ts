import { Messages } from 'react-big-calendar';

/**
 * Big Calendar Messages
 */
export const LanguageMessages: { [id: string]: Messages } = {
  es: {
    agenda: 'El Diario',
    day: 'Día',
    month: 'Mes',
    next: 'Después',
    previous: 'Atrás',
    showMore: (total) => `+${total} más`,
    today: 'Hoy',
    week: 'Semana',
    work_week: 'Semana de trabajo',
  },
  fr: {
    agenda: 'Ordre du jour',
    day: 'Jour',
    month: 'Mois',
    next: 'Prochain',
    previous: 'Antérieur',
    showMore: (total) => `+${total} plus`,
    today: `Aujourd'hui`,
    week: 'La semaine',
    work_week: 'Semaine de travail',
  },
  de: {
    agenda: 'Agenda',
    day: 'Tag',
    month: 'Monat',
    next: 'Nächste',
    previous: 'Vorherige',
    showMore: (total) => `+${total} mehr`,
    today: `Heute`,
    week: 'Woche',
    work_week: 'Arbeitswoche',
  },
  zh: {
    agenda: '议程',
    day: '天',
    month: '月',
    next: '下一个',
    previous: '以前的',
    showMore: (total) => `+${total} 更多的`,
    today: `今天`,
    week: '星期',
    work_week: '工作周',
  },
};