export function downloadICS(classes) {
  const dayMap = { Mon: 'MO', Tue: 'TU', Wed: 'WE', Thu: 'TH', Fri: 'FR', Sat: 'SA', Sun: 'SU' };
  
  let icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Eskedule//Student AI Schedule Scanner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  classes.forEach((cls) => {
    const byDay = cls.days.map((d) => dayMap[d]).filter(Boolean).join(',');
    if (!byDay) return;

    const startFormatted = cls.startTime.replace(':', '') + '00';
    const endFormatted = cls.endTime.replace(':', '') + '00';

    icsLines.push(
      'BEGIN:VEVENT',
      `SUMMARY:${cls.code} - ${cls.name}`,
      `LOCATION:${cls.room || 'TBA'}`,
      `DESCRIPTION:Instructor: ${cls.instructor || 'N/A'}`,
      `RRULE:FREQ=WEEKLY;BYDAY=${byDay}`,
      `DTSTART;TZID=Asia/Manila:20260105T${startFormatted}`,
      `DTEND;TZID=Asia/Manila:20260105T${endFormatted}`,
      'END:VEVENT'
    );
  });

  icsLines.push('END:VCALENDAR');

  const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Eskedule_Class_Schedule.ics';
  link.click();
  URL.revokeObjectURL(url);
}