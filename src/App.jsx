import { useState, useRef } from 'react'
import './App.css'

const TEXT = {
  ko: {
    title: '✈️ AI 여행 플래너',
    subtitle: '당신의 취향에 맞는 완벽한 여행지를 AI가 추천해드립니다',
    formTitle: '여행 조건 설정',
    langBtn: 'English',
    labels: {
      style: '여행 스타일',
      budget: '예산대',
      people: '여행 인원',
      duration: '여행 기간',
    },
    options: {
      style: ['휴양', '액티비티', '문화탐방', '맛집투어', '혼합'],
      budget: ['50만원 이하', '50~100만원', '100~200만원', '200만원 이상', '직접 입력'],
      people: ['혼자', '2인', '3~4인', '5인 이상'],
      duration: ['당일', '1박2일', '2박3일', '3박4일', '일주일이상'],
    },
    regionDomestic: '국내',
    regionOverseas: '해외',
    submitBtn: '여행지 추천받기',
    loadingText: 'AI가 최적의 여행지를 분석 중입니다...',
    resultsTitle: '추천 여행지',
    badge: '3곳 추천',
    pdfBtn: 'PDF 저장',
    pdfSaving: '저장 중...',
    sections: {
      schedule: '📅 일정',
      cost: '💰 예상 비용',
      essentials: '🎒 필수 준비물',
      accommodation: '🏨 숙소 추천',
      attractions: '🗺️ 관광지 추천',
    },
    reason: '추천 이유',
  },
  en: {
    title: '✈️ AI Travel Planner',
    subtitle: 'Let AI recommend the perfect destination tailored to your preferences',
    formTitle: 'Set Travel Preferences',
    langBtn: '한국어',
    labels: {
      style: 'Travel Style',
      budget: 'Budget',
      people: 'Group Size',
      duration: 'Duration',
    },
    options: {
      style: ['Relaxation', 'Activities', 'Culture', 'Food Tour', 'Mixed'],
      budget: ['Under ₩500k', '₩500k~1M', '₩1M~2M', '₩2M+', 'Custom'],
      people: ['Solo', '2 People', '3~4 People', '5+ People'],
      duration: ['Day Trip', '1 Night', '2 Nights', '3 Nights', '1 Week+'],
    },
    regionDomestic: 'Domestic',
    regionOverseas: 'Overseas',
    submitBtn: 'Get Recommendations',
    loadingText: 'AI is analyzing the best destinations for you...',
    resultsTitle: 'Recommended Destinations',
    badge: '3 Picks',
    pdfBtn: 'Save PDF',
    pdfSaving: 'Saving...',
    sections: {
      schedule: '📅 Itinerary',
      cost: '💰 Estimated Cost',
      essentials: '🎒 Essentials',
      accommodation: '🏨 Accommodation',
      attractions: '🗺️ Attractions',
    },
    reason: 'Why we recommend',
  },
}

const KO_OPTIONS = ['휴양', '액티비티', '문화탐방', '맛집투어', '혼합', '50만원 이하', '50~100만원', '100~200만원', '200만원 이상', '직접 입력', '혼자', '2인', '3~4인', '5인 이상', '당일', '1박2일', '2박3일', '3박4일', '일주일이상']
const EN_OPTIONS = ['Relaxation', 'Activities', 'Culture', 'Food Tour', 'Mixed', 'Under ₩500k', '₩500k~1M', '₩1M~2M', '₩2M+', 'Custom', 'Solo', '2 People', '3~4 People', '5+ People', 'Day Trip', '1 Night', '2 Nights', '3 Nights', '1 Week+']

const CUSTOM_BUDGET = { ko: '직접 입력', en: 'Custom' }

function buildPrompt(selections, lang, region, customBudget) {
  const { style, people, duration } = selections
  const budget = (selections.budget === CUSTOM_BUDGET.ko || selections.budget === CUSTOM_BUDGET.en)
    ? (customBudget || selections.budget)
    : selections.budget
  const regionKo = region === 'domestic' ? '국내' : '해외'
  const regionEn = region === 'domestic' ? 'Domestic (South Korea)' : 'Overseas (international)'
  if (lang === 'ko') {
    return `[언어 규칙 - 최우선 적용]
모든 텍스트는 반드시 순수 한국어(한글)로만 작성할 것.
한자, 중국어, 일본어, 베트남어 등 어떤 외국어도 절대 사용하지 말 것.
고유명사(여행지 이름, 관광지, 숙소 등)도 반드시 한글로 표기할 것.
이 규칙을 어기면 응답 전체가 무효 처리됨.

당신은 전문 여행 컨설턴트입니다. 아래 조건에 맞는 여행지 3곳을 추천해주세요.

조건:
- 여행 지역: ${regionKo}
- 여행 스타일: ${style}
- 예산대: ${budget}
- 여행 인원: ${people}
- 여행 기간: ${duration}

반드시 다음 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "destinations": [
    {
      "name": "여행지 이름",
      "reason": "이 여행지를 추천하는 이유 (2-3문장)",
      "schedule": "구체적인 일정 (일별로 나열)",
      "cost": ["항공/교통: 00만원", "숙소: 00만원", "식비: 00만원", "관광/활동: 00만원", "기타: 00만원", "총합계: 00만원"],
      "essentials": ["준비물1", "준비물2", "준비물3", "준비물4", "준비물5"],
      "accommodation": "숙소 추천 (유형, 가격대, 추천 지역 포함)",
      "attractions": ["관광지1", "관광지2", "관광지3", "관광지4", "관광지5"]
    }
  ]
}`
  }
  return `You are a professional travel consultant. Please recommend 3 travel destinations based on the following conditions.

Conditions:
- Region: ${regionEn}
- Travel Style: ${style}
- Budget: ${budget}
- Group Size: ${people}
- Duration: ${duration}

Respond ONLY in the following JSON format (no other text):
{
  "destinations": [
    {
      "name": "Destination name",
      "reason": "Why we recommend this destination (2-3 sentences)",
      "schedule": "Detailed itinerary (listed by day)",
      "cost": ["Flights/Transport: $000", "Accommodation: $000", "Food: $000", "Activities: $000", "Others: $000", "Total: $000"],
      "essentials": ["item1", "item2", "item3", "item4", "item5"],
      "accommodation": "Accommodation recommendations (type, price range, area)",
      "attractions": ["attraction1", "attraction2", "attraction3", "attraction4", "attraction5"]
    }
  ]
}`
}

async function fetchRecommendations(selections, lang, region, customBudget) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) throw new Error('API key not found. Please set VITE_GROQ_API_KEY in .env file.')

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{ role: 'user', content: buildPrompt(selections, lang, region, customBudget) }],
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error: ${res.status}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty response from API')

  const parsed = JSON.parse(content)
  if (!parsed.destinations || !Array.isArray(parsed.destinations)) {
    throw new Error('Unexpected response format')
  }
  return parsed.destinations
}

function DestinationCard({ dest, index, t }) {
  return (
    <div className="destination-card">
      <div className="destination-header">
        <div className="dest-number">{index + 1}</div>
        <div className="dest-name">{dest.name}</div>
      </div>
      <div className="dest-reason">
        <strong>{t.reason}:</strong> {dest.reason}
      </div>
      <div className="dest-sections">
        <div className="section-block full-width">
          <div className="section-title">{t.sections.schedule}</div>
          <div className="section-content">{dest.schedule}</div>
        </div>
        <div className="section-block">
          <div className="section-title">{t.sections.cost}</div>
          <div className="section-content">
            {Array.isArray(dest.cost) ? (
              <ul className="cost-list">
                {dest.cost.map((item, i) => (
                  <li key={i} className={i === dest.cost.length - 1 ? 'cost-total' : ''}>{item}</li>
                ))}
              </ul>
            ) : (
              <span className="cost-value">{dest.cost}</span>
            )}
          </div>
        </div>
        <div className="section-block">
          <div className="section-title">{t.sections.essentials}</div>
          <div className="section-content">
            <ul>
              {Array.isArray(dest.essentials)
                ? dest.essentials.map((item, i) => <li key={i}>{item}</li>)
                : <li>{dest.essentials}</li>}
            </ul>
          </div>
        </div>
        <div className="section-block full-width">
          <div className="section-title">{t.sections.accommodation}</div>
          <div className="section-content">{dest.accommodation}</div>
        </div>
        <div className="section-block full-width">
          <div className="section-title">{t.sections.attractions}</div>
          <div className="section-content">
            <ul>
              {Array.isArray(dest.attractions)
                ? dest.attractions.map((item, i) => <li key={i}>{item}</li>)
                : <li>{dest.attractions}</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState('ko')
  const t = TEXT[lang]

  const [selections, setSelections] = useState({
    style: t.options.style[0],
    budget: t.options.budget[0],
    people: t.options.people[0],
    duration: t.options.duration[0],
  })
  const [region, setRegion] = useState('domestic')
  const [customBudget, setCustomBudget] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const resultsRef = useRef(null)

  const generatePDF = async () => {
    if (!resultsRef.current) return
    setPdfLoading(true)
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#F8FAFC',
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const imgW = pageW
      const imgH = (canvas.height * imgW) / canvas.width
      const margin = 0
      let y = margin
      let remainH = imgH

      while (remainH > 0) {
        pdf.addImage(imgData, 'PNG', margin, y, imgW, imgH)
        remainH -= (pageH - margin * 2)
        if (remainH > 0) {
          pdf.addPage()
          y = margin - (imgH - remainH)
        }
      }

      const date = new Date().toISOString().slice(0, 10)
      pdf.save(`travel-plan-${date}.pdf`)
    } finally {
      setPdfLoading(false)
    }
  }

  const toggleLang = () => {
    const next = lang === 'ko' ? 'en' : 'ko'
    const nextT = TEXT[next]

    // translate current selections to new language
    const translateOption = (val) => {
      const koIdx = KO_OPTIONS.indexOf(val)
      const enIdx = EN_OPTIONS.indexOf(val)
      if (next === 'en' && koIdx !== -1) return EN_OPTIONS[koIdx]
      if (next === 'ko' && enIdx !== -1) return KO_OPTIONS[enIdx]
      return val
    }

    setSelections(prev => ({
      style: translateOption(prev.style) || nextT.options.style[0],
      budget: translateOption(prev.budget) || nextT.options.budget[0],
      people: translateOption(prev.people) || nextT.options.people[0],
      duration: translateOption(prev.duration) || nextT.options.duration[0],
    }))
    setLang(next)
    setResults(null)
    setError(null)
  }

  const handleChange = (key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const data = await fetchRecommendations(selections, lang, region, customBudget)
      setResults(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'style', label: t.labels.style, options: t.options.style },
    { key: 'budget', label: t.labels.budget, options: t.options.budget },
    { key: 'people', label: t.labels.people, options: t.options.people },
    { key: 'duration', label: t.labels.duration, options: t.options.duration },
  ]

  return (
    <div className="app">
      <div className="header">
        <div className="header-title">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <button className="lang-btn" onClick={toggleLang}>{t.langBtn}</button>
      </div>

      <div className="form-card">
        <h2>{t.formTitle}</h2>
        <div className="region-toggle">
          <button
            className={`region-btn${region === 'domestic' ? ' active' : ''}`}
            onClick={() => { setRegion('domestic'); setResults(null) }}
          >
            {t.regionDomestic}
          </button>
          <button
            className={`region-btn${region === 'overseas' ? ' active' : ''}`}
            onClick={() => { setRegion('overseas'); setResults(null) }}
          >
            {t.regionOverseas}
          </button>
        </div>
        <div className="form-grid">
          {fields.map(({ key, label, options }) => (
            <div key={key} className="field">
              <label htmlFor={key}>{label}</label>
              <select
                id={key}
                value={selections[key]}
                onChange={e => handleChange(key, e.target.value)}
              >
                {options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {key === 'budget' && (selections.budget === CUSTOM_BUDGET.ko || selections.budget === CUSTOM_BUDGET.en) && (
                <input
                  className="custom-budget-input"
                  type="text"
                  placeholder={lang === 'ko' ? '예) 1인 80만원' : 'e.g. ₩800k per person'}
                  value={customBudget}
                  onChange={e => setCustomBudget(e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? '...' : t.submitBtn}
        </button>
      </div>

      {error && <div className="error-box">⚠️ {error}</div>}

      {loading && (
        <div className="loading-wrap">
          <div className="spinner" />
          <p>{t.loadingText}</p>
        </div>
      )}

      {results && !loading && (
        <div>
          <div className="results-header">
            <h2>{t.resultsTitle}</h2>
            <span className="results-badge">{t.badge}</span>
            <button className="pdf-btn" onClick={generatePDF} disabled={pdfLoading}>
              {pdfLoading ? t.pdfSaving : `⬇ ${t.pdfBtn}`}
            </button>
          </div>
          <div ref={resultsRef}>
            {results.map((dest, i) => (
              <DestinationCard key={i} dest={dest} index={i} t={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
