export function checkConflicts(classes) {
  const conflicts = [];
  const timeToMin = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  for (let i = 0; i < classes.length; i++) {
    for (let j = i + 1; j < classes.length; j++) {
      const c1 = classes[i];
      const c2 = classes[j];

      const sharedDays = c1.days.filter((d) => c2.days.includes(d));
      if (sharedDays.length === 0) continue;

      const s1 = timeToMin(c1.startTime);
      const e1 = timeToMin(c1.endTime);
      const s2 = timeToMin(c2.startTime);
      const e2 = timeToMin(c2.endTime);

      if (s1 < e2 && s2 < e1) {
        conflicts.push({
          classA: c1,
          classB: c2,
          days: sharedDays,
        });
      }
    }
  }
  return conflicts;
}