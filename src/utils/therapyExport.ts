export interface TherapyExportData {
  exportDate: string;
  dateRange: {
    start: string;
    end: string;
  };
  emotionalSummary: {
    topEmotions: Array<{ emotion: string; count: number; percentage: number }>;
    emotionalTrends: string;
  };
  commonTriggers: string[];
  positivePatterns: string[];
  transformationProgress: {
    totalEntries: number;
    completedTransformations: number;
    completionRate: number;
  };
  recommendedTopics: string[];
  journalHighlights: Array<{
    date: string;
    mood: string;
    insight: string;
  }>;
}

export function analyzeJournalEntries(entries: any[]): TherapyExportData {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentEntries = entries.filter(
    (entry) => new Date(entry.created_at) >= thirtyDaysAgo
  );

  const moodCount: Record<string, number> = {};
  recentEntries.forEach((entry) => {
    if (entry.mood) {
      moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;
    }
  });

  const totalMoodEntries = Object.values(moodCount).reduce((a, b) => a + b, 0);
  const topEmotions = Object.entries(moodCount)
    .map(([emotion, count]) => ({
      emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      count,
      percentage: Math.round((count / totalMoodEntries) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const commonTriggers = extractCommonThemes(
    recentEntries.map((e) => e.text_entry),
    [
      'work',
      'stress',
      'relationship',
      'family',
      'health',
      'money',
      'future',
      'past',
      'loneliness',
      'anxiety',
    ]
  );

  const positivePatterns = extractPositivePatterns(recentEntries);

  const completedTransformations = recentEntries.filter(
    (e) => e.reframed_perspective || e.renewal_step
  ).length;

  const journalHighlights = selectMeaningfulEntries(recentEntries);

  const emotionalTrends = generateEmotionalTrends(topEmotions);

  const recommendedTopics = generateTherapyTopics(
    topEmotions,
    commonTriggers,
    positivePatterns
  );

  return {
    exportDate: now.toISOString(),
    dateRange: {
      start: thirtyDaysAgo.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0],
    },
    emotionalSummary: {
      topEmotions,
      emotionalTrends,
    },
    commonTriggers,
    positivePatterns,
    transformationProgress: {
      totalEntries: recentEntries.length,
      completedTransformations,
      completionRate:
        recentEntries.length > 0
          ? Math.round((completedTransformations / recentEntries.length) * 100)
          : 0,
    },
    recommendedTopics,
    journalHighlights,
  };
}

function extractCommonThemes(entries: string[], keywords: string[]): string[] {
  const themes: string[] = [];
  keywords.forEach((keyword) => {
    const count = entries.filter((entry) =>
      entry.toLowerCase().includes(keyword)
    ).length;
    if (count >= 2) {
      themes.push(
        keyword.charAt(0).toUpperCase() + keyword.slice(1) + ` (${count} mentions)`
      );
    }
  });
  return themes.slice(0, 5);
}

function extractPositivePatterns(entries: any[]): string[] {
  const patterns: string[] = [];

  const gratefulCount = entries.filter(
    (e) => e.mood && e.mood.toLowerCase().includes('grat')
  ).length;
  if (gratefulCount >= 2) {
    patterns.push(`Practicing gratitude (${gratefulCount} times)`);
  }

  const completedActions = entries.filter((e) => e.action_completed).length;
  if (completedActions > 0) {
    patterns.push(`Taking action on insights (${completedActions} completed)`);
  }

  const transformations = entries.filter((e) => e.reframed_perspective).length;
  if (transformations >= 3) {
    patterns.push(`Consistent emotional reframing (${transformations} times)`);
  }

  const innerChildWork = entries.filter((e) => e.is_inner_child_mode).length;
  if (innerChildWork > 0) {
    patterns.push(`Inner child healing work (${innerChildWork} sessions)`);
  }

  if (entries.length >= 7) {
    patterns.push(`Regular journaling practice (${entries.length} entries)`);
  }

  return patterns;
}

function selectMeaningfulEntries(entries: any[]): Array<{
  date: string;
  mood: string;
  insight: string;
}> {
  return entries
    .filter((e) => e.reframed_perspective || e.renewal_step)
    .slice(0, 3)
    .map((entry) => ({
      date: new Date(entry.created_at).toLocaleDateString(),
      mood: entry.mood || 'Mixed',
      insight:
        entry.reframed_perspective ||
        entry.renewal_step ||
        'Completed transformation process',
    }));
}

function generateEmotionalTrends(
  topEmotions: Array<{ emotion: string; percentage: number }>
): string {
  if (topEmotions.length === 0) {
    return 'Not enough data to identify trends';
  }

  const primary = topEmotions[0];
  const trend = [];

  if (primary.percentage > 40) {
    trend.push(
      `Primary emotion: ${primary.emotion} (${primary.percentage}% of entries)`
    );
  } else {
    trend.push(`Varied emotional states with no single dominant emotion`);
  }

  const negativeEmotions = ['Anxious', 'Sad', 'Angry', 'Stressed', 'Hurt'];
  const negativeCount = topEmotions.filter((e) =>
    negativeEmotions.includes(e.emotion)
  ).length;

  if (negativeCount >= 3) {
    trend.push('Notable presence of challenging emotions');
  }

  return trend.join('. ') + '.';
}

function generateTherapyTopics(
  emotions: Array<{ emotion: string }>,
  triggers: string[],
  patterns: string[]
): string[] {
  const topics: string[] = [];

  const emotionList = emotions.map((e) => e.emotion.toLowerCase());

  if (
    emotionList.includes('anxious') ||
    emotionList.includes('stressed') ||
    triggers.some((t) => t.toLowerCase().includes('anxiety'))
  ) {
    topics.push('Anxiety management and coping strategies');
  }

  if (
    emotionList.includes('sad') ||
    emotionList.includes('lonely') ||
    emotionList.includes('hurt')
  ) {
    topics.push('Processing grief and emotional pain');
  }

  if (
    emotionList.includes('angry') ||
    emotionList.includes('frustrated')
  ) {
    topics.push('Anger expression and boundary setting');
  }

  if (
    triggers.some((t) =>
      t.toLowerCase().includes('relationship' || 'family')
    )
  ) {
    topics.push('Relationship dynamics and communication patterns');
  }

  if (triggers.some((t) => t.toLowerCase().includes('work'))) {
    topics.push('Work-life balance and professional stress');
  }

  if (patterns.some((p) => p.toLowerCase().includes('inner child'))) {
    topics.push('Deeper inner child healing work');
  }

  if (patterns.length >= 2) {
    topics.push('Sustaining positive coping mechanisms');
  }

  if (topics.length === 0) {
    topics.push('General emotional wellness and self-awareness');
  }

  return topics.slice(0, 5);
}

export function generateTherapyExportText(data: TherapyExportData): string {
  return `
EMOTIONAL WELLNESS PROGRESS SUMMARY
For Therapy Discussion
Generated: ${new Date(data.exportDate).toLocaleDateString()}
Period: ${data.dateRange.start} to ${data.dateRange.end}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 EMOTIONAL SUMMARY

Top Emotions (Past 30 Days):
${data.emotionalSummary.topEmotions
  .map(
    (e) =>
      `  • ${e.emotion}: ${e.count} entries (${e.percentage}% of emotional check-ins)`
  )
  .join('\n')}

Emotional Trends:
${data.emotionalSummary.emotionalTrends}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 COMMON THEMES & TRIGGERS

${
  data.commonTriggers.length > 0
    ? data.commonTriggers.map((t) => `  • ${t}`).join('\n')
    : '  • No specific recurring triggers identified'
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ POSITIVE PATTERNS & PROGRESS

${
  data.positivePatterns.length > 0
    ? data.positivePatterns.map((p) => `  • ${p}`).join('\n')
    : '  • Building foundation for growth'
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 TRANSFORMATION ENGAGEMENT

  • Total Journal Entries: ${data.transformationProgress.totalEntries}
  • Completed Transformations: ${data.transformationProgress.completedTransformations}
  • Engagement Rate: ${data.transformationProgress.completionRate}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 KEY INSIGHTS FROM RECENT ENTRIES

${
  data.journalHighlights.length > 0
    ? data.journalHighlights
        .map(
          (h) => `${h.date} (${h.mood})
  "${h.insight}"`
        )
        .join('\n\n')
    : 'Continue building your journaling practice to generate insights.'
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🗣️ SUGGESTED DISCUSSION TOPICS FOR THERAPY

${data.recommendedTopics.map((t, i) => `  ${i + 1}. ${t}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 NOTES FOR YOUR THERAPIST

This summary reflects self-reported emotional experiences and patterns
identified through journaling and self-reflection exercises. It is
intended to facilitate therapeutic discussion, not replace professional
clinical assessment.

Areas of focus might include:
• Emotional regulation strategies
• Identifying and processing core beliefs
• Developing healthier coping mechanisms
• Exploring relationship patterns
• Building resilience and self-compassion

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated by Emotional Recycle
A companion tool for your healing journey
  `;
}

export function downloadTherapyExport(data: TherapyExportData): void {
  const text = generateTherapyExportText(data);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `therapy-summary-${data.dateRange.end}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
