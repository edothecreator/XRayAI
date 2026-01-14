import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import type { PredictionResponse } from '../services/api'

// Language translations
const translations: Record<string, Record<string, string>> = {
  en: {
    reportTitle: 'Medical Imaging Analysis Report',
    aiSystemName: 'AI-Assisted Medical Imaging System',
    disclaimer: 'This report is AI-assisted and does not constitute a medical diagnosis. Please consult with a qualified healthcare professional.',
    patientId: 'Patient ID',
    dateGenerated: 'Date Generated',
    tableOfContents: 'Table of Contents',
    patientOverview: 'Patient Overview',
    clinicalAnalysis: 'Clinical Analysis',
    riskAssessment: 'Risk Assessment',
    recommendations: 'Recommendations',
    conclusion: 'Conclusion',
    medicalDisclaimer: 'Medical Disclaimer',
    condition: 'Condition',
    probability: 'Probability',
    riskLevel: 'Risk Level',
    highRisk: 'High Risk',
    moderateRisk: 'Moderate Risk',
    lowRisk: 'Low Risk',
    findings: 'Findings',
    summary: 'Summary',
    noImmediateConcerns: 'No immediate concerns detected. Continue routine monitoring.',
    consultDoctor: 'Consult with a qualified healthcare professional for proper evaluation.',
    followUp: 'Follow-up examination may be recommended based on clinical correlation.',
    aiAssisted: 'AI-Assisted Analysis',
    notDiagnosis: 'This report is generated using artificial intelligence and is for informational purposes only. It should not replace professional medical diagnosis, treatment, or advice.',
    consultProfessional: 'Always consult with a qualified healthcare provider for medical decisions.',
    reportId: 'Report ID',
  },
  fr: {
    reportTitle: 'Rapport d\'Analyse d\'Imagerie Médicale',
    aiSystemName: 'Système d\'Imagerie Médicale Assisté par IA',
    disclaimer: 'Ce rapport est assisté par IA et ne constitue pas un diagnostic médical. Veuillez consulter un professionnel de la santé qualifié.',
    patientId: 'ID Patient',
    dateGenerated: 'Date de Génération',
    tableOfContents: 'Table des Matières',
    patientOverview: 'Aperçu du Patient',
    clinicalAnalysis: 'Analyse Clinique',
    riskAssessment: 'Évaluation des Risques',
    recommendations: 'Recommandations',
    conclusion: 'Conclusion',
    medicalDisclaimer: 'Avertissement Médical',
    condition: 'Condition',
    probability: 'Probabilité',
    riskLevel: 'Niveau de Risque',
    highRisk: 'Risque Élevé',
    moderateRisk: 'Risque Modéré',
    lowRisk: 'Risque Faible',
    findings: 'Résultats',
    summary: 'Résumé',
    noImmediateConcerns: 'Aucun problème immédiat détecté. Continuez la surveillance de routine.',
    consultDoctor: 'Consultez un professionnel de la santé qualifié pour une évaluation appropriée.',
    followUp: 'Un examen de suivi peut être recommandé en fonction de la corrélation clinique.',
    aiAssisted: 'Analyse Assistée par IA',
    notDiagnosis: 'Ce rapport est généré à l\'aide de l\'intelligence artificielle et est à des fins d\'information uniquement. Il ne doit pas remplacer le diagnostic, le traitement ou les conseils médicaux professionnels.',
    consultProfessional: 'Consultez toujours un professionnel de la santé qualifié pour les décisions médicales.',
    reportId: 'ID Rapport',
  },
  ar: {
    reportTitle: 'تقرير تحليل التصوير الطبي',
    aiSystemName: 'نظام التصوير الطبي المدعوم بالذكاء الاصطناعي',
    disclaimer: 'هذا التقرير مدعوم بالذكاء الاصطناعي ولا يشكل تشخيصاً طبياً. يرجى استشارة أخصائي رعاية صحية مؤهل.',
    patientId: 'رقم المريض',
    dateGenerated: 'تاريخ الإنشاء',
    tableOfContents: 'جدول المحتويات',
    patientOverview: 'نظرة عامة على المريض',
    clinicalAnalysis: 'التحليل السريري',
    riskAssessment: 'تقييم المخاطر',
    recommendations: 'التوصيات',
    conclusion: 'الخلاصة',
    medicalDisclaimer: 'إخلاء المسؤولية الطبية',
    condition: 'الحالة',
    probability: 'الاحتمالية',
    riskLevel: 'مستوى المخاطر',
    highRisk: 'خطر عالي',
    moderateRisk: 'خطر متوسط',
    lowRisk: 'خطر منخفض',
    findings: 'النتائج',
    summary: 'ملخص',
    noImmediateConcerns: 'لم يتم اكتشاف مخاوف فورية. استمر في المراقبة الروتينية.',
    consultDoctor: 'استشر أخصائي رعاية صحية مؤهل للتقييم المناسب.',
    followUp: 'قد يُنصح بإجراء فحص متابعة بناءً على الارتباط السريري.',
    aiAssisted: 'تحليل مدعوم بالذكاء الاصطناعي',
    notDiagnosis: 'يتم إنشاء هذا التقرير باستخدام الذكاء الاصطناعي وهو لأغراض إعلامية فقط. لا ينبغي أن يحل محل التشخيص الطبي المهني أو العلاج أو المشورة.',
    consultProfessional: 'استشر دائماً مقدم رعاية صحية مؤهل لاتخاذ القرارات الطبية.',
    reportId: 'رقم التقرير',
  },
}

// Helper functions
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0]
}

const getValueColor = (value: number | string | boolean | { risk_level?: 'Low' | 'Moderate' | 'High' }): [number, number, number] => {
  if (typeof value === 'object' && value !== null && 'risk_level' in value) {
    switch (value.risk_level) {
      case 'High':
        return hexToRgb('#dc2626') // red
      case 'Moderate':
        return hexToRgb('#d97706') // amber
      case 'Low':
        return hexToRgb('#059669') // green
      default:
        return hexToRgb('#4b5563') // gray
    }
  }
  if (typeof value === 'number' && value <= 1 && value >= 0) {
    if (value > 0.7) return hexToRgb('#dc2626') // red - high risk
    if (value > 0.4) return hexToRgb('#d97706') // amber - moderate risk
    return hexToRgb('#059669') // green - low risk
  }
  return hexToRgb('#4b5563') // gray
}

const getRiskLevel = (value: number, lang: string = 'en'): string => {
  const t = translations[lang] || translations.en
  if (value > 0.7) return t.highRisk
  if (value > 0.4) return t.moderateRisk
  return t.lowRisk
}

const formatKey = (key: string): string => {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatValue = (value: number | string | boolean | { percentage: number }): string => {
  if (typeof value === 'object' && value !== null && 'percentage' in value) {
    return `${value.percentage.toFixed(2)}%`
  }
  if (typeof value === 'number') {
    if (value <= 1 && value >= 0) {
      return `${(value * 100).toFixed(2)}%`
    }
    return value.toString()
  }
  return String(value)
}

const getRiskLevelFromValue = (value: number | string | boolean | { risk_level?: 'Low' | 'Moderate' | 'High' }, lang: string = 'en'): string => {
  const t = translations[lang] || translations.en
  if (typeof value === 'object' && value !== null && 'risk_level' in value) {
    switch (value.risk_level) {
      case 'High':
        return t.highRisk
      case 'Moderate':
        return t.moderateRisk
      case 'Low':
        return t.lowRisk
      default:
        return 'N/A'
    }
  }
  if (typeof value === 'number' && value <= 1 && value >= 0) {
    if (value > 0.7) return t.highRisk
    if (value > 0.4) return t.moderateRisk
    return t.lowRisk
  }
  return 'N/A'
}

const extractResults = (data: PredictionResponse): Array<[string, any]> => {
  // Check if new format (has results property)
  if (data && typeof data === 'object' && 'results' in data) {
    return Object.entries((data as any).results || {})
  }
  // Old format - flat object
  return Object.entries(data)
}

// Generate anonymous patient ID
const generatePatientID = (): string => {
  return `PAT-${Date.now().toString().slice(-8)}`
}

// Add page number and minimal footer (no watermark)
const addMinimalFooter = (doc: jsPDF, pageWidth: number, pageHeight: number, _margin: number, currentPage: number, totalPages: number) => {
  const footerY = pageHeight - 10
  const textColor = hexToRgb('#6b7280')

  doc.setFontSize(8)
  doc.setTextColor(textColor[0], textColor[1], textColor[2])
  doc.setFont('helvetica', 'normal')
  doc.text(
    `${currentPage} / ${totalPages}`,
    pageWidth / 2,
    footerY,
    { align: 'center' }
  )
}

export const exportToPDF = (
  data: PredictionResponse,
  patientName?: string,
  language: string = 'en'
) => {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin
  let yPos = margin

  const t = translations[language] || translations.en
  const patientID = generatePatientID()
  const reportID = `RPT-${Date.now().toString().slice(-10)}`
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Color palette (professional medical colors)
  const textDark = hexToRgb('#1f2937')
  const textMedium = hexToRgb('#4b5563')
  const borderColor = hexToRgb('#e5e7eb')
  const bgLight = hexToRgb('#f9fafb')

  // Helper to check and add new page
  const checkNewPage = (requiredSpace: number): boolean => {
    if (yPos + requiredSpace > pageHeight - 20) {
      const currentPage = doc.getNumberOfPages()
      addMinimalFooter(doc, pageWidth, pageHeight, margin, currentPage, currentPage)
      doc.addPage()
      yPos = margin
      return true
    }
    return false
  }

  // ========== COVER PAGE ==========
  
  // Clean white background
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // Top border line
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
  doc.setLineWidth(1)
  doc.line(margin, 30, pageWidth - margin, 30)

  yPos = 50

  // Report Title
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(textDark[0], textDark[1], textDark[2])
  doc.text(t.reportTitle, pageWidth / 2, yPos, { align: 'center' })
  yPos += 15

  // AI System Name (subtle)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(textMedium[0], textMedium[1], textMedium[2])
  doc.text(t.aiSystemName, pageWidth / 2, yPos, { align: 'center' })
  yPos += 30

  // Patient Information Box
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2])
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
  doc.setLineWidth(0.5)
  doc.roundedRect(margin, yPos, contentWidth, 60, 2, 2, 'FD')

  yPos += 12

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(textDark[0], textDark[1], textDark[2])
  doc.text(`${t.patientId}: ${patientID}`, margin + 10, yPos)
  yPos += 8

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(textMedium[0], textMedium[1], textMedium[2])
  doc.text(`${t.reportId}: ${reportID}`, margin + 10, yPos)
  yPos += 8

  doc.text(`${t.dateGenerated}: ${dateStr}`, margin + 10, yPos)
  yPos += 20

  // Disclaimer Box
  doc.setFillColor(255, 249, 237)
  doc.setDrawColor(hexToRgb('#f59e0b')[0], hexToRgb('#f59e0b')[1], hexToRgb('#f59e0b')[2])
  doc.setLineWidth(0.5)
  doc.roundedRect(margin, yPos, contentWidth, 25, 2, 2, 'FD')

  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(textMedium[0], textMedium[1], textMedium[2])
  doc.text(t.disclaimer, margin + 10, yPos + 8, { maxWidth: contentWidth - 20, align: 'justify' })

  yPos = pageHeight - 30

  // Cover page footer
  addMinimalFooter(doc, pageWidth, pageHeight, margin, 1, 1)
  doc.addPage()

  // ========== TABLE OF CONTENTS ==========
  
  yPos = margin

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(textDark[0], textDark[1], textDark[2])
  doc.text(t.tableOfContents, margin, yPos)
  yPos += 15

  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 10

  const tocItems = [
    { title: t.patientOverview, page: 3 },
    { title: t.clinicalAnalysis, page: 3 },
    { title: t.riskAssessment, page: 4 },
    { title: t.recommendations, page: 4 },
    { title: t.conclusion, page: 5 },
    { title: t.medicalDisclaimer, page: 5 },
  ]

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(textDark[0], textDark[1], textDark[2])

  tocItems.forEach((item) => {
    doc.text(item.title, margin + 5, yPos)
    const dots = '.'.repeat(60)
    const dotsWidth = doc.getTextWidth(dots)
    doc.text(dots, pageWidth - margin - 30 - dotsWidth, yPos)
    doc.text(item.page.toString(), pageWidth - margin - 5, yPos, { align: 'right' })
    yPos += 8
  })

  addMinimalFooter(doc, pageWidth, pageHeight, margin, 2, 2)
  doc.addPage()

  // ========== PATIENT OVERVIEW ==========
  
  yPos = margin

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(textDark[0], textDark[1], textDark[2])
  doc.text(t.patientOverview, margin, yPos)
  yPos += 12

  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(textMedium[0], textMedium[1], textMedium[2])

  doc.text(`${t.patientId}: ${patientID}`, margin, yPos)
  yPos += 7

  if (patientName) {
    doc.text(`Patient Name: ${patientName}`, margin, yPos)
    yPos += 7
  }

  doc.text(`Date of Analysis: ${dateStr}`, margin, yPos)
  yPos += 7

  // Extract results (handle both old and new format)
  const results = extractResults(data)
  const totalConditions = results.length
  
  // Add model info if available
  if (data && typeof data === 'object' && 'model' in data) {
    doc.text(`AI Model: ${(data as any).model}`, margin, yPos)
    yPos += 7
    if ((data as any).type) {
      doc.text(`Analysis Type: ${(data as any).type}`, margin, yPos)
      yPos += 7
    }
  }

  doc.text(`Total Conditions Analyzed: ${totalConditions}`, margin, yPos)
  yPos += 15

  // ========== CLINICAL ANALYSIS ==========
  
  checkNewPage(30)

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(textDark[0], textDark[1], textDark[2])
  doc.text(t.clinicalAnalysis, margin, yPos)
  yPos += 12

  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 10

  // Sort by probability/percentage (highest first)
  const sortedEntries = results.sort((a, b) => {
    const valA = typeof a[1] === 'object' && a[1] !== null && 'percentage' in a[1] 
      ? (a[1] as any).percentage 
      : typeof a[1] === 'number' ? a[1] : 0
    const valB = typeof b[1] === 'object' && b[1] !== null && 'percentage' in b[1]
      ? (b[1] as any).percentage
      : typeof b[1] === 'number' ? b[1] : 0
    return valB - valA
  })

  // Table header
  const tableTop = yPos
  const rowHeight = 9
  const headerHeight = 10

  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2])
  doc.roundedRect(margin, tableTop, contentWidth, headerHeight, 2, 2, 'F')
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
  doc.setLineWidth(0.5)
  doc.roundedRect(margin, tableTop, contentWidth, headerHeight, 2, 2, 'D')

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(textDark[0], textDark[1], textDark[2])
  doc.text(t.condition, margin + 5, tableTop + 7)
  doc.text(t.probability, margin + contentWidth * 0.6, tableTop + 7)
  doc.text(t.riskLevel, margin + contentWidth * 0.8, tableTop + 7)

  yPos = tableTop + headerHeight

  sortedEntries.forEach(([key, value], index) => {
    checkNewPage(rowHeight + 2)

    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255)
      doc.rect(margin, yPos, contentWidth, rowHeight, 'F')
    }

    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
    doc.setLineWidth(0.3)
    doc.line(margin, yPos, margin + contentWidth, yPos)

    // Condition name
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.text(formatKey(key), margin + 5, yPos + 6, { maxWidth: contentWidth * 0.55 })

    // Probability/Percentage
    const displayValue = formatValue(value)
    const valueColor = getValueColor(value)
    doc.setTextColor(valueColor[0], valueColor[1], valueColor[2])
    doc.setFont('helvetica', 'bold')
    doc.text(displayValue, margin + contentWidth * 0.6, yPos + 6)

    // Risk level
    const riskLevel = getRiskLevelFromValue(value, language)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(textMedium[0], textMedium[1], textMedium[2])
    doc.text(riskLevel, margin + contentWidth * 0.8, yPos + 6)

    yPos += rowHeight
  })

  // Bottom border
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, margin + contentWidth, yPos)
  yPos += 15

  // ========== RISK ASSESSMENT ==========
  
  checkNewPage(40)
  doc.addPage()

  yPos = margin

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(textDark[0], textDark[1], textDark[2])
  doc.text(t.riskAssessment, margin, yPos)
  yPos += 12

  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 15

  // Calculate risk statistics
  const riskCounts = sortedEntries.reduce((acc, [_, value]) => {
    if (typeof value === 'object' && value !== null && 'risk_level' in value) {
      const riskLevel = (value as any).risk_level
      if (riskLevel === 'High') acc.high++
      else if (riskLevel === 'Moderate') acc.moderate++
      else acc.low++
    } else if (typeof value === 'number' && value <= 1 && value >= 0) {
      if (value > 0.7) acc.high++
      else if (value > 0.4) acc.moderate++
      else acc.low++
    }
    return acc
  }, { high: 0, moderate: 0, low: 0 })

  const highRiskCount = riskCounts.high
  const moderateRiskCount = riskCounts.moderate
  const lowRiskCount = riskCounts.low

  // Risk summary boxes
  const boxWidth = (contentWidth - 16) / 3
  const boxHeight = 20

  // High Risk
  doc.setFillColor(hexToRgb('#fee2e2')[0], hexToRgb('#fee2e2')[1], hexToRgb('#fee2e2')[2])
  doc.setDrawColor(hexToRgb('#dc2626')[0], hexToRgb('#dc2626')[1], hexToRgb('#dc2626')[2])
  doc.setLineWidth(1)
  doc.roundedRect(margin, yPos, boxWidth, boxHeight, 2, 2, 'FD')
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(hexToRgb('#dc2626')[0], hexToRgb('#dc2626')[1], hexToRgb('#dc2626')[2])
  doc.text(highRiskCount.toString(), margin + boxWidth / 2, yPos + 10, { align: 'center' })
  doc.setFontSize(8)
  doc.text(t.highRisk, margin + boxWidth / 2, yPos + 16, { align: 'center' })

  // Moderate Risk
  doc.setFillColor(hexToRgb('#fef3c7')[0], hexToRgb('#fef3c7')[1], hexToRgb('#fef3c7')[2])
  doc.setDrawColor(hexToRgb('#d97706')[0], hexToRgb('#d97706')[1], hexToRgb('#d97706')[2])
  doc.roundedRect(margin + boxWidth + 8, yPos, boxWidth, boxHeight, 2, 2, 'FD')
  doc.setFontSize(16)
  doc.setTextColor(hexToRgb('#d97706')[0], hexToRgb('#d97706')[1], hexToRgb('#d97706')[2])
  doc.text(moderateRiskCount.toString(), margin + boxWidth + 8 + boxWidth / 2, yPos + 10, { align: 'center' })
  doc.setFontSize(8)
  doc.text(t.moderateRisk, margin + boxWidth + 8 + boxWidth / 2, yPos + 16, { align: 'center' })

  // Low Risk
  doc.setFillColor(hexToRgb('#d1fae5')[0], hexToRgb('#d1fae5')[1], hexToRgb('#d1fae5')[2])
  doc.setDrawColor(hexToRgb('#059669')[0], hexToRgb('#059669')[1], hexToRgb('#059669')[2])
  doc.roundedRect(margin + (boxWidth + 8) * 2, yPos, boxWidth, boxHeight, 2, 2, 'FD')
  doc.setFontSize(16)
  doc.setTextColor(hexToRgb('#059669')[0], hexToRgb('#059669')[1], hexToRgb('#059669')[2])
  doc.text(lowRiskCount.toString(), margin + (boxWidth + 8) * 2 + boxWidth / 2, yPos + 10, { align: 'center' })
  doc.setFontSize(8)
  doc.text(t.lowRisk, margin + (boxWidth + 8) * 2 + boxWidth / 2, yPos + 16, { align: 'center' })

  yPos += boxHeight + 20

  // ========== RECOMMENDATIONS ==========
  
  checkNewPage(50)

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(textDark[0], textDark[1], textDark[2])
  doc.text(t.recommendations, margin, yPos)
  yPos += 12

  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(textDark[0], textDark[1], textDark[2])

  const recommendations = []
  if (highRiskCount > 0) {
    recommendations.push(`• ${t.consultDoctor} Immediate consultation is recommended for high-risk findings.`)
  }
  if (moderateRiskCount > 0) {
    recommendations.push(`• ${t.followUp} Moderate-risk conditions may require additional evaluation.`)
  }
  if (lowRiskCount === Object.keys(data).length) {
    recommendations.push(`• ${t.noImmediateConcerns}`)
  }
  recommendations.push(`• ${t.consultProfessional}`)
  recommendations.push(`• This analysis is based on imaging data and should be correlated with clinical findings and patient history.`)

  recommendations.forEach((rec) => {
    checkNewPage(8)
    doc.text(rec, margin + 5, yPos, { maxWidth: contentWidth - 10, align: 'justify' })
    yPos += 7
  })

  yPos += 10

  // ========== CONCLUSION ==========
  
  checkNewPage(30)

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(textDark[0], textDark[1], textDark[2])
  doc.text(t.conclusion, margin, yPos)
  yPos += 12

  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(textDark[0], textDark[1], textDark[2])

  const conclusionText = `This analysis has evaluated ${totalConditions} conditions based on the provided medical imaging. ` +
    `The findings indicate ${highRiskCount} high-risk, ${moderateRiskCount} moderate-risk, and ${lowRiskCount} low-risk conditions. ` +
    `It is important to note that this analysis is AI-assisted and should be reviewed by a qualified healthcare professional ` +
    `in conjunction with clinical examination and patient history for comprehensive medical evaluation.`

  doc.text(conclusionText, margin, yPos, { maxWidth: contentWidth, align: 'justify' })

  // ========== MEDICAL DISCLAIMER (FINAL PAGE) ==========
  
  doc.addPage()
  yPos = margin

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(textDark[0], textDark[1], textDark[2])
  doc.text(t.medicalDisclaimer, margin, yPos)
  yPos += 15

  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 15

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(textDark[0], textDark[1], textDark[2])

  const disclaimerTexts = [
    t.notDiagnosis,
    t.consultProfessional,
    'This report is generated using artificial intelligence technology and is intended for informational purposes only.',
    'The analysis provided should not be used as a substitute for professional medical advice, diagnosis, or treatment.',
    'Always seek the advice of qualified healthcare providers with any questions regarding a medical condition.',
    'Never disregard professional medical advice or delay in seeking it because of information in this report.',
    'In case of a medical emergency, contact your local emergency services immediately.',
  ]

  disclaimerTexts.forEach((text) => {
    checkNewPage(10)
    doc.text(text, margin, yPos, { maxWidth: contentWidth, align: 'justify' })
    yPos += 8
  })

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    addMinimalFooter(doc, pageWidth, pageHeight, margin, i, totalPages)
  }

  // Save PDF (no watermark, clean filename)
  const fileName = `Medical-Report-${patientID}-${Date.now()}.pdf`
  doc.save(fileName)
}

export const exportToCSV = (data: PredictionResponse, patientName?: string) => {
  const rows = [['Condition', 'Probability', 'Percentage', 'Risk Level']]
  if (patientName) {
    rows.unshift(['Patient Name', patientName])
    rows.push(['Date', new Date().toLocaleString()])
    rows.push([])
  }

  // Add model info if available
  if (data && typeof data === 'object' && 'model' in data) {
    rows.push(['AI Model', (data as any).model])
    if ((data as any).type) {
      rows.push(['Analysis Type', (data as any).type])
    }
    rows.push([])
  }

  const results = extractResults(data)
  results.forEach(([key, value]) => {
    const riskLevel = getRiskLevelFromValue(value, 'en')
    const percentage = typeof value === 'object' && value !== null && 'percentage' in value
      ? (value as any).percentage.toFixed(2) + '%'
      : formatValue(value)
    const probability = typeof value === 'object' && value !== null && 'probability' in value
      ? ((value as any).probability * 100).toFixed(2) + '%'
      : typeof value === 'number' && value <= 1 && value >= 0
      ? (value * 100).toFixed(2) + '%'
      : 'N/A'
    rows.push([formatKey(key), probability, percentage, riskLevel])
  })

  const csvContent = rows.map((row) => row.map(cell => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `medical-report-${Date.now()}.csv`
  link.click()
}

export const exportToExcel = (data: PredictionResponse, patientName?: string) => {
  const worksheetData: any[][] = []
  
  if (patientName) {
    worksheetData.push(['Patient Name', patientName])
    worksheetData.push(['Date', new Date().toLocaleString()])
    worksheetData.push([])
  }

  // Add model info if available
  if (data && typeof data === 'object' && 'model' in data) {
    worksheetData.push(['AI Model', (data as any).model])
    if ((data as any).type) {
      worksheetData.push(['Analysis Type', (data as any).type])
    }
    worksheetData.push([])
  }

  worksheetData.push(['Condition', 'Probability', 'Percentage', 'Risk Level'])
  const results = extractResults(data)
  results.forEach(([key, value]) => {
    const riskLevel = getRiskLevelFromValue(value, 'en')
    const percentage = typeof value === 'object' && value !== null && 'percentage' in value
      ? (value as any).percentage.toFixed(2) + '%'
      : formatValue(value)
    const probability = typeof value === 'object' && value !== null && 'probability' in value
      ? ((value as any).probability * 100).toFixed(2) + '%'
      : typeof value === 'number' && value <= 1 && value >= 0
      ? (value * 100).toFixed(2) + '%'
      : 'N/A'
    worksheetData.push([formatKey(key), probability, percentage, riskLevel])
  })

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Analysis')
  XLSX.writeFile(workbook, `medical-report-${Date.now()}.xlsx`)
}

export const exportToJSON = (data: PredictionResponse, patientName?: string) => {
  const results = extractResults(data)
  const riskCounts = results.reduce((acc, [_, value]) => {
    if (typeof value === 'object' && value !== null && 'risk_level' in value) {
      const riskLevel = (value as any).risk_level
      if (riskLevel === 'High') acc.high++
      else if (riskLevel === 'Moderate') acc.moderate++
      else acc.low++
    } else if (typeof value === 'number' && value <= 1 && value >= 0) {
      if (value > 0.7) acc.high++
      else if (value > 0.4) acc.moderate++
      else acc.low++
    }
    return acc
  }, { high: 0, moderate: 0, low: 0 })

  const exportData: any = {
    ...(patientName && { patientName }),
    timestamp: new Date().toISOString(),
    patientId: generatePatientID(),
    summary: {
      totalConditions: results.length,
      highRisk: riskCounts.high,
      moderateRisk: riskCounts.moderate,
      lowRisk: riskCounts.low,
    },
    predictions: data,
  }

  // Add model info if available
  if (data && typeof data === 'object' && 'model' in data) {
    exportData.model = (data as any).model
    exportData.type = (data as any).type
    exportData.disclaimer = (data as any).disclaimer
  }

  const jsonContent = JSON.stringify(exportData, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `medical-report-${Date.now()}.json`
  link.click()
}
