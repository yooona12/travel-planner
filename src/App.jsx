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
      month: '여행 시기',
    },
    options: {
      style: ['휴양', '액티비티', '문화탐방', '맛집투어', '혼합'],
      budget: ['50만원 이하', '50~100만원', '100~200만원', '200만원 이상', '직접 입력'],
      people: ['혼자', '2인', '3~4인', '5인 이상'],
      duration: ['당일', '1박2일', '2박3일', '3박4일', '일주일이상'],
      month: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    },
    regionDomestic: '국내',
    regionOverseas: '해외',
    submitBtn: '여행지 추천받기',
    loadingText: 'AI가 최적의 여행지를 분석 중입니다...',
    resultsTitle: '추천 여행지',
    badge: '3곳 추천',
    pdfBtn: 'PDF 저장',
    pdfSaving: '저장 중...',
    conditionTitle: '여행 조건',
    conditionLabels: { region: '지역', style: '스타일', budget: '예산', people: '인원', duration: '기간', month: '시기' },
    sections: {
      schedule: '📅 일정',
      cost: '💰 예상 비용',
      essentials: '🎒 필수 준비물',
      accommodation: '🏨 숙소 추천',
      attractions: '🗺️ 관광지 추천',
      weather: '🌤️ 날씨 정보',
    },
    reason: '추천 이유',
    tab: { ai: '🔍 AI 추천', free: '✏️ 자유 플래너' },
    free: {
      formTitle: '여행 조건 입력',
      destinationLabel: '여행지',
      destinationPlaceholder: '예) 방콕, 도쿄, 파리, 뉴욕, 시드니...',
      submitBtn: '여행 계획 세우기',
      loadingExchange: '실시간 환율 정보 가져오는 중...',
      loadingPlan: 'AI가 여행 계획을 작성 중입니다...',
      exchangeInfo: '적용 환율',
      budgetSection: '💰 예상 예산 (현지 물가 기준)',
    },
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
      month: 'Travel Month',
    },
    options: {
      style: ['Relaxation', 'Activities', 'Culture', 'Food Tour', 'Mixed'],
      budget: ['Under ₩500k', '₩500k~1M', '₩1M~2M', '₩2M+', 'Custom'],
      people: ['Solo', '2 People', '3~4 People', '5+ People'],
      duration: ['Day Trip', '1 Night', '2 Nights', '3 Nights', '1 Week+'],
      month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    },
    regionDomestic: 'Domestic',
    regionOverseas: 'Overseas',
    submitBtn: 'Get Recommendations',
    loadingText: 'AI is analyzing the best destinations for you...',
    resultsTitle: 'Recommended Destinations',
    badge: '3 Picks',
    pdfBtn: 'Save PDF',
    pdfSaving: 'Saving...',
    conditionTitle: 'Travel Conditions',
    conditionLabels: { region: 'Region', style: 'Style', budget: 'Budget', people: 'People', duration: 'Duration', month: 'Month' },
    sections: {
      schedule: '📅 Itinerary',
      cost: '💰 Estimated Cost',
      essentials: '🎒 Essentials',
      accommodation: '🏨 Accommodation',
      attractions: '🗺️ Attractions',
      weather: '🌤️ Weather',
    },
    reason: 'Why we recommend',
    tab: { ai: '🔍 AI Picks', free: '✏️ Free Planner' },
    free: {
      formTitle: 'Enter Travel Details',
      destinationLabel: 'Destination',
      destinationPlaceholder: 'e.g. Bangkok, Tokyo, Paris, New York...',
      submitBtn: 'Create Travel Plan',
      loadingExchange: 'Fetching live exchange rates...',
      loadingPlan: 'AI is creating your travel plan...',
      exchangeInfo: 'Exchange Rate',
      budgetSection: '💰 Estimated Budget (local prices)',
    },
  },
}

const KO_OPTIONS = ['휴양', '액티비티', '문화탐방', '맛집투어', '혼합', '50만원 이하', '50~100만원', '100~200만원', '200만원 이상', '직접 입력', '혼자', '2인', '3~4인', '5인 이상', '당일', '1박2일', '2박3일', '3박4일', '일주일이상', '1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
const EN_OPTIONS = ['Relaxation', 'Activities', 'Culture', 'Food Tour', 'Mixed', 'Under ₩500k', '₩500k~1M', '₩1M~2M', '₩2M+', 'Custom', 'Solo', '2 People', '3~4 People', '5+ People', 'Day Trip', '1 Night', '2 Nights', '3 Nights', '1 Week+', 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const CUSTOM_BUDGET = { ko: '직접 입력', en: 'Custom' }

const KO_MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
const EN_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function getMonthNum(monthStr) {
  const ko = KO_MONTHS.indexOf(monthStr)
  if (ko !== -1) return ko + 1
  const en = EN_MONTHS.indexOf(monthStr)
  if (en !== -1) return en + 1
  return new Date().getMonth() + 1
}

function getSeason(monthNum, lang) {
  if (monthNum >= 3 && monthNum <= 5) return lang === 'ko' ? '봄' : 'Spring'
  if (monthNum >= 6 && monthNum <= 8) return lang === 'ko' ? '여름' : 'Summer'
  if (monthNum >= 9 && monthNum <= 11) return lang === 'ko' ? '가을' : 'Autumn'
  return lang === 'ko' ? '겨울' : 'Winter'
}

const DAYS_MAP = {
  '당일': 1, '1박2일': 2, '2박3일': 3, '3박4일': 4, '일주일이상': 7,
  'Day Trip': 1, '1 Night': 2, '2 Nights': 3, '3 Nights': 4, '1 Week+': 7,
}
const NIGHTS_MAP = {
  '당일': 0, '1박2일': 1, '2박3일': 2, '3박4일': 3, '일주일이상': 6,
  'Day Trip': 0, '1 Night': 1, '2 Nights': 2, '3 Nights': 3, '1 Week+': 6,
}
const PEOPLE_MAP = {
  '혼자': 1, '2인': 2, '3~4인': 4, '5인 이상': 5,
  'Solo': 1, '2 People': 2, '3~4 People': 4, '5+ People': 5,
}
const ACCOM_MAP = {
  '50만원 이하': 40000, '50~100만원': 50000, '100~200만원': 100000, '200만원 이상': 200000,
  'Under ₩500k': 40000, '₩500k~1M': 50000, '₩1M~2M': 100000, '₩2M+': 200000,
}
const TRANSPORT_MAP = {
  '당일': 10000, '1박2일': 50000, '2박3일': 80000, '3박4일': 100000, '일주일이상': 150000,
  'Day Trip': 10000, '1 Night': 50000, '2 Nights': 80000, '3 Nights': 100000, '1 Week+': 150000,
}
const HIGH_FOOD_STYLES = ['맛집투어', '휴양', 'Food Tour', 'Relaxation']

function fmt(n) {
  if (n >= 10000) return `${Math.round(n / 10000)}만원`
  return `${n.toLocaleString()}원`
}

function calculateCost(selections, region, lang) {
  const { style, budget, people, duration } = selections
  const days     = DAYS_MAP[duration] ?? 2
  const nights   = NIGHTS_MAP[duration] ?? 1
  const count    = PEOPLE_MAP[people] ?? 1
  const mealRate = HIGH_FOOD_STYLES.includes(style) ? 20000 : 15000
  const accomRate    = ACCOM_MAP[budget] ?? 50000
  const transportPer = (TRANSPORT_MAP[duration] ?? 50000) * (region === 'overseas' ? 2 : 1)

  const food       = mealRate * 3 * days
  const accom      = accomRate * nights
  const transport  = transportPer
  const activity   = 20000 * days
  const subtotal   = food + accom + transport + activity
  const others     = Math.round(subtotal * 0.1)
  const totalPer   = subtotal + others
  const totalGroup = totalPer * count

  if (lang === 'ko') {
    return [
      `교통: ${fmt(transport)}`,
      `숙소: ${fmt(accom)}`,
      `식비: ${fmt(food)}`,
      `관광/활동: ${fmt(activity)}`,
      `기타: ${fmt(others)}`,
      `총합계: 1인 ${fmt(totalPer)}${count > 1 ? ` / ${count}인 합계 ${fmt(totalGroup)}` : ''}`,
    ]
  }
  return [
    `Transport: ${fmt(transport)}`,
    `Accommodation: ${fmt(accom)}`,
    `Food: ${fmt(food)}`,
    `Activities: ${fmt(activity)}`,
    `Others: ${fmt(others)}`,
    `Total: ${fmt(totalPer)}/person${count > 1 ? ` · ${fmt(totalGroup)} for ${count}` : ''}`,
  ]
}

function buildPrompt(selections, lang, region) {
  const { style, budget, people, duration, month } = selections
  const monthNum = getMonthNum(month)
  const season = getSeason(monthNum, lang)
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
- 여행 시기: ${monthNum}월 (${season})

여행 시기는 ${monthNum}월 ${season}입니다. 이 시기의 날씨와 특성을 고려해서 적합한 여행지를 추천하고, 각 여행지의 해당 시기 날씨와 특이사항(기온, 강수, 혼잡도, 여행 팁 등)을 weather 필드에 함께 안내해줘.

[여행지 추천 가이드라인]
예산대와 여행 기간을 고려해서 현실적으로 갈 수 있는 여행지를 추천해줘. 저예산 단기는 가까운 곳, 고예산 장기는 멀고 다양한 곳을 추천하되, 항상 다양하고 색다른 여행지를 포함해줘. 제주도/부산/강릉 같은 뻔한 곳만 반복하지 말고 숨겨진 명소나 덜 알려진 여행지도 포함해줘.${region === 'overseas' ? '\n\n해외 여행지 추천 시 일본 오사카, 대만 타이베이, 베트남 하노이만 반복 추천하지 말 것. 예산과 기간에 맞는 다양한 나라와 도시를 추천하되, 매 요청마다 다른 조합으로 추천해줘. 홍콩, 싱가포르, 태국, 유럽, 아메리카, 중동, 중앙아시아, 오세아니아 국가 등 다양한 지역을 고루 추천할 것.' : ''}

[필수 준비물 작성 규칙]
- 해당 여행지·여행 스타일에 꼭 필요한 실용적인 항목만 포함할 것
- 다음 항목은 절대 포함하지 말 것: 돈, 현금, 카드, 신용카드, 체크카드, 핸드폰, 스마트폰, 충전기${region === 'domestic' ? ', 여권, 비자, 해외여행보험' : ''}
${region === 'domestic' ? '- 국내여행이므로 여권·비자·해외 관련 항목은 절대 포함하지 말 것\n' : ''}- 날씨·지형·활동에 맞는 의류, 장비, 상비약, 예약 확인서 등 실질적으로 유용한 항목을 추천할 것

반드시 다음 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "destinations": [
    {
      "name": "여행지 이름",
      "reason": "이 여행지를 추천하는 이유 (2-3문장)",
      "schedule": "구체적인 일정 (일별로 나열)",
      "weather": "${monthNum}월 ${season} 날씨 및 특이사항 (기온 범위, 강수, 혼잡도, 여행 팁 포함)",
      "essentials": ["준비물1", "준비물2", "준비물3", "준비물4", "준비물5"],
      "accommodation": "숙소 추천 (유형, 추천 숙소명, 추천 지역 포함)",
      "attractions": ["관광지1", "관광지2", "관광지3", "관광지4", "관광지5"]
    }
  ]
}`
  }
  const season_en = season
  return `You are a professional travel consultant. Please recommend 3 travel destinations based on the following conditions.

Conditions:
- Region: ${regionEn}
- Travel Style: ${style}
- Budget: ${budget}
- Group Size: ${people}
- Duration: ${duration}
- Travel Month: ${EN_MONTHS[monthNum - 1]} (${season_en})

The travel period is ${EN_MONTHS[monthNum - 1]} (${season_en}). Consider the weather and seasonal characteristics when recommending destinations, and include weather info for each destination in the weather field.

[Essentials Rules]
- Include only practical items specific to the destination and travel style
- Never include: money, cash, credit card, phone, charger${region === 'domestic' ? ', passport, visa, travel insurance' : ''}
${region === 'domestic' ? '- Domestic travel: never include passport, visa, or any overseas-related items\n' : ''}- Recommend useful items such as weather-appropriate clothing, gear, medicine, or booking confirmations

Respond ONLY in the following JSON format (no other text):
{
  "destinations": [
    {
      "name": "Destination name",
      "reason": "Why we recommend this destination (2-3 sentences)",
      "schedule": "Detailed itinerary (listed by day)",
      "weather": "Weather and notes for ${EN_MONTHS[monthNum - 1]} (${season_en}): temperature range, precipitation, crowd level, travel tips",
      "essentials": ["item1", "item2", "item3", "item4", "item5"],
      "accommodation": "Accommodation recommendations (type, specific hotel/hostel names, area)",
      "attractions": ["attraction1", "attraction2", "attraction3", "attraction4", "attraction5"]
    }
  ]
}`
}

async function fetchRecommendations(selections, lang, region) {
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
      messages: [{ role: 'user', content: buildPrompt(selections, lang, region) }],
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

  const cost = calculateCost(selections, region, lang)
  return parsed.destinations.map(dest => ({ ...dest, cost }))
}

async function fetchExchangeRates() {
  const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY
  if (!apiKey) throw new Error('환율 API 키가 없습니다.')
  const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`)
  if (!res.ok) throw new Error('환율 정보를 가져오지 못했습니다.')
  const data = await res.json()
  if (data.result !== 'success') throw new Error('환율 API 오류: ' + data['error-type'])
  return data.conversion_rates
}

function buildFreePlannerPrompt(destination, selections, lang) {
  const { month, duration, people } = selections
  const monthNum = getMonthNum(month)
  const season = getSeason(monthNum, lang)
  const daysCount = DAYS_MAP[duration] ?? 2
  if (lang === 'ko') {
    return `[언어 규칙 - 최우선 적용]
모든 텍스트는 반드시 순수 한국어(한글)로만 작성할 것. 통화 코드(JPY, THB 등)와 숫자는 예외.
고유명사(관광지, 숙소 이름 등)도 한글로 표기할 것.

여행지: ${destination}
여행 시기: ${monthNum}월 (${season})
여행 기간: ${duration} (${daysCount}일)
여행 인원: ${people}

위 여행지에 대한 맞춤 여행 계획을 작성해줘.
예산은 반드시 해당 국가의 현지 통화로 제공하고, currency_code는 정확한 ISO 4217 코드(JPY, THB, EUR, USD, VND 등)로 입력해줘.
budget 항목은 1인 기준 현실적인 금액(숫자만)으로 작성해줘.

반드시 다음 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "name": "여행지 이름",
  "country": "국가명",
  "currency_code": "통화 코드 (예: JPY, THB, EUR)",
  "intro": "여행지 소개 (2-3문장)",
  "weather": "${monthNum}월 ${season} 날씨 및 특이사항 (기온, 강수, 혼잡도, 여행 팁 포함)",
  "schedule": "구체적인 일정 (일별로 나열)",
  "budget": {
    "accommodation_per_night": 숫자,
    "food_per_day": 숫자,
    "transport_total": 숫자,
    "activities_per_day": 숫자
  },
  "accommodation": "숙소 추천 (유형, 추천 숙소명, 추천 지역 포함)",
  "attractions": ["관광지1", "관광지2", "관광지3", "관광지4", "관광지5"],
  "essentials": ["준비물1", "준비물2", "준비물3", "준비물4", "준비물5"]
}`
  }
  return `You are a professional travel consultant. Create a detailed travel plan.

Destination: ${destination}
Travel Month: ${EN_MONTHS[monthNum - 1]} (${season})
Duration: ${duration} (${daysCount} days)
Group Size: ${people}

Provide realistic budget estimates in the LOCAL currency of the destination.
Use the correct ISO 4217 currency code. Budget items should be per person.

Respond ONLY in the following JSON format (no other text):
{
  "name": "Destination name",
  "country": "Country name",
  "currency_code": "Currency code (e.g. JPY, THB, EUR)",
  "intro": "Introduction to the destination (2-3 sentences)",
  "weather": "Weather and notes for ${EN_MONTHS[monthNum - 1]} (${season})",
  "schedule": "Detailed itinerary (listed by day)",
  "budget": {
    "accommodation_per_night": number,
    "food_per_day": number,
    "transport_total": number,
    "activities_per_day": number
  },
  "accommodation": "Accommodation recommendations (type, specific names, area)",
  "attractions": ["attraction1", "attraction2", "attraction3", "attraction4", "attraction5"],
  "essentials": ["item1", "item2", "item3", "item4", "item5"]
}`
}

function calculateFreePlannerBudget(aiResult, rates, selections, lang) {
  const { duration, people } = selections
  const days   = DAYS_MAP[duration] ?? 2
  const nights = NIGHTS_MAP[duration] ?? 1
  const count  = PEOPLE_MAP[people] ?? 1
  const { currency_code, budget } = aiResult
  const krwRate   = rates.KRW   || 1350
  const localRate = rates[currency_code] || 1
  const toKRW = (n) => Math.round(n / localRate * krwRate)

  const accom    = (budget.accommodation_per_night || 0) * nights
  const food     = (budget.food_per_day || 0) * days
  const transport= budget.transport_total || 0
  const activity = (budget.activities_per_day || 0) * days
  const subtotal = accom + food + transport + activity
  const misc     = Math.round(subtotal * 0.1)
  const totalPer = subtotal + misc
  const totalGroup = totalPer * count

  const fmtLocal = (n) => `${currency_code} ${Math.round(n).toLocaleString()}`
  const fmtLine  = (label, local) => `${label}: ${fmtLocal(local)} (≈ ${fmt(toKRW(local))})`

  const lines = lang === 'ko'
    ? [
        fmtLine('숙소', accom),
        fmtLine('식비', food),
        fmtLine('교통', transport),
        fmtLine('관광/활동', activity),
        fmtLine('기타', misc),
      ]
    : [
        fmtLine('Accommodation', accom),
        fmtLine('Food', food),
        fmtLine('Transport', transport),
        fmtLine('Activities', activity),
        fmtLine('Others', misc),
      ]

  const totalLine = lang === 'ko'
    ? `총합계: 1인 ${fmt(toKRW(totalPer))}${count > 1 ? ` / ${count}인 합계 ${fmt(toKRW(totalGroup))}` : ''}`
    : `Total: ${fmt(toKRW(totalPer))}/person${count > 1 ? ` · ${fmt(toKRW(totalGroup))} for ${count}` : ''}`

  const krwPerLocal = Math.round(krwRate / localRate)
  const rateDisplay = currency_code === 'USD'
    ? `1 USD = ${krwRate.toLocaleString()} KRW`
    : `1 ${currency_code} = ${krwPerLocal.toLocaleString()} KRW  ·  1 USD = ${Math.round(krwRate).toLocaleString()} KRW`

  return { lines, totalLine, rateDisplay, currency_code }
}

function FreePlanner({ lang, t }) {
  const [destination, setDestination] = useState('')
  const [selections, setSelections] = useState({
    month: t.options.month[new Date().getMonth()],
    duration: t.options.duration[2],
    people: t.options.people[0],
  })
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [budgetInfo, setBudgetInfo] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const resultRef = useRef(null)

  const fields = [
    { key: 'month',    label: t.labels.month,    options: t.options.month },
    { key: 'duration', label: t.labels.duration, options: t.options.duration },
    { key: 'people',   label: t.labels.people,   options: t.options.people },
  ]

  const handleSubmit = async () => {
    if (!destination.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    setBudgetInfo(null)
    try {
      setLoadingStep(t.free.loadingExchange)
      const rates = await fetchExchangeRates()

      setLoadingStep(t.free.loadingPlan)
      const apiKey = import.meta.env.VITE_GROQ_API_KEY
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [{ role: 'user', content: buildFreePlannerPrompt(destination, selections, lang) }],
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
      if (!parsed.name || !parsed.budget) throw new Error('Unexpected response format')
      setBudgetInfo(calculateFreePlannerBudget(parsed, rates, selections, lang))
      setResult(parsed)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
      setLoadingStep('')
    }
  }

  const generatePDF = async () => {
    if (!resultRef.current) return
    setPdfLoading(true)
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'), import('jspdf'),
      ])
      const canvas = await html2canvas(resultRef.current, { scale: 2, useCORS: true, backgroundColor: '#F8FAFC' })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const imgH = (canvas.height * pageW) / canvas.width
      let y = 0, remainH = imgH
      while (remainH > 0) {
        pdf.addImage(imgData, 'PNG', 0, y, pageW, imgH)
        remainH -= pageH
        if (remainH > 0) { pdf.addPage(); y = -(imgH - remainH) }
      }
      pdf.save(`free-travel-plan-${new Date().toISOString().slice(0, 10)}.pdf`)
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div>
      <div className="form-card">
        <h2>{t.free.formTitle}</h2>
        <div className="field free-dest-field">
          <label>{t.free.destinationLabel}</label>
          <input
            type="text"
            className="destination-input"
            placeholder={t.free.destinationPlaceholder}
            value={destination}
            onChange={e => setDestination(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && destination.trim() && handleSubmit()}
          />
        </div>
        <div className="form-grid free-grid">
          {fields.map(({ key, label, options }) => (
            <div key={key} className="field">
              <label htmlFor={`fp-${key}`}>{label}</label>
              <select id={`fp-${key}`} value={selections[key]} onChange={e => setSelections(p => ({ ...p, [key]: e.target.value }))}>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>
        <button className="submit-btn" onClick={handleSubmit} disabled={loading || !destination.trim()}>
          {loading ? (loadingStep || '...') : t.free.submitBtn}
        </button>
      </div>

      {error && <div className="error-box">⚠️ {error}</div>}

      {loading && (
        <div className="loading-wrap">
          <div className="spinner" />
          <p>{loadingStep}</p>
        </div>
      )}

      {result && budgetInfo && !loading && (
        <div>
          <div className="results-header">
            <h2>{result.name}</h2>
            <span className="results-badge">{result.country}</span>
            <button className="pdf-btn" onClick={generatePDF} disabled={pdfLoading}>
              {pdfLoading ? t.pdfSaving : `⬇ ${t.pdfBtn}`}
            </button>
          </div>
          <div ref={resultRef}>
            <div className="exchange-info-bar">
              <span className="exchange-label">{t.free.exchangeInfo}</span>
              <span className="exchange-rate">{budgetInfo.rateDisplay}</span>
            </div>
            <div className="destination-card">
              <div className="destination-header">
                <div className="dest-name">{result.name}, {result.country}</div>
              </div>
              <div className="dest-reason">{result.intro}</div>
              <div className="dest-sections">
                <div className="section-block full-width">
                  <div className="section-title">{t.sections.weather}</div>
                  <div className="section-content section-weather">{result.weather}</div>
                </div>
                <div className="section-block full-width">
                  <div className="section-title">{t.sections.schedule}</div>
                  <div className="section-content">{result.schedule}</div>
                </div>
                <div className="section-block full-width">
                  <div className="section-title">{t.free.budgetSection}</div>
                  <div className="section-content">
                    <ul className="cost-list">
                      {budgetInfo.lines.map((line, i) => <li key={i}>{line}</li>)}
                      <li className="cost-total">{budgetInfo.totalLine}</li>
                    </ul>
                  </div>
                </div>
                <div className="section-block full-width">
                  <div className="section-title">{t.sections.accommodation}</div>
                  <div className="section-content">{result.accommodation}</div>
                </div>
                <div className="section-block">
                  <div className="section-title">{t.sections.attractions}</div>
                  <div className="section-content">
                    <ul>{Array.isArray(result.attractions) ? result.attractions.map((a, i) => <li key={i}>{a}</li>) : <li>{result.attractions}</li>}</ul>
                  </div>
                </div>
                <div className="section-block">
                  <div className="section-title">{t.sections.essentials}</div>
                  <div className="section-content">
                    <ul>{Array.isArray(result.essentials) ? result.essentials.map((a, i) => <li key={i}>{a}</li>) : <li>{result.essentials}</li>}</ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
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
          <div className="section-title">{t.sections.weather}</div>
          <div className="section-content section-weather">{dest.weather}</div>
        </div>
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
  const [activeTab, setActiveTab] = useState('ai')

  const currentMonth = new Date().getMonth() // 0-indexed
  const [selections, setSelections] = useState({
    style: t.options.style[0],
    budget: t.options.budget[0],
    people: t.options.people[0],
    duration: t.options.duration[0],
    month: t.options.month[currentMonth],
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

    const translateMonth = (val) => {
      const ki = KO_MONTHS.indexOf(val)
      const ei = EN_MONTHS.indexOf(val)
      if (next === 'en' && ki !== -1) return EN_MONTHS[ki]
      if (next === 'ko' && ei !== -1) return KO_MONTHS[ei]
      return val
    }
    setSelections(prev => ({
      style: translateOption(prev.style) || nextT.options.style[0],
      budget: translateOption(prev.budget) || nextT.options.budget[0],
      people: translateOption(prev.people) || nextT.options.people[0],
      duration: translateOption(prev.duration) || nextT.options.duration[0],
      month: translateMonth(prev.month) || nextT.options.month[currentMonth],
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
      const data = await fetchRecommendations(selections, lang, region)
      setResults(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'style',    label: t.labels.style,    options: t.options.style },
    { key: 'budget',   label: t.labels.budget,   options: t.options.budget },
    { key: 'people',   label: t.labels.people,   options: t.options.people },
    { key: 'duration', label: t.labels.duration, options: t.options.duration },
    { key: 'month',    label: t.labels.month,    options: t.options.month },
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

      <div className="tabs">
        <button className={`tab-btn${activeTab === 'ai' ? ' active' : ''}`} onClick={() => setActiveTab('ai')}>{t.tab.ai}</button>
        <button className={`tab-btn${activeTab === 'free' ? ' active' : ''}`} onClick={() => setActiveTab('free')}>{t.tab.free}</button>
      </div>

      {activeTab === 'free' ? <FreePlanner lang={lang} t={t} /> : (<>

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
            <div className="condition-summary">
              <span className="condition-summary-title">{t.conditionTitle}</span>
              <div className="condition-tags">
                {[
                  { label: t.conditionLabels.region, value: region === 'domestic' ? t.regionDomestic : t.regionOverseas },
                  { label: t.conditionLabels.style,  value: selections.style },
                  { label: t.conditionLabels.budget, value: selections.budget === (lang === 'ko' ? '직접 입력' : 'Custom') && customBudget ? customBudget : selections.budget },
                  { label: t.conditionLabels.people, value: selections.people },
                  { label: t.conditionLabels.duration, value: selections.duration },
                  { label: t.conditionLabels.month, value: `${selections.month} (${getSeason(getMonthNum(selections.month), lang)})` },
                ].map(({ label, value }) => (
                  <div key={label} className="condition-tag">
                    <span className="condition-tag-label">{label}</span>
                    <span className="condition-tag-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            {results.map((dest, i) => (
              <DestinationCard key={i} dest={dest} index={i} t={t} />
            ))}
          </div>
        </div>
      )}

      </>)}
    </div>
  )
}
