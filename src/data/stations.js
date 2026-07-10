export const STATIONS = [
  { id: 'CAM-01', name: '동도 북방 A', lat: 37.2452, lng: 131.8695, depth: 8,  status: 'active',  temp: 14.3 },
  { id: 'CAM-02', name: '동도 동측 B', lat: 37.2415, lng: 131.8718, depth: 14, status: 'active',  temp: 13.9 },
  { id: 'CAM-03', name: '서도 남방 C', lat: 37.2378, lng: 131.8605, depth: 11, status: 'active',  temp: 14.6 },
  { id: 'CAM-04', name: '서도 북방 D', lat: 37.2452, lng: 131.8594, depth: 19, status: 'warning', temp: 15.1 },
]

/* AI Re-ID로 식별된 개체 목록 (사용자가 입양 가능) */
export const DETECTED_INDIVIDUALS = [
  { bolId: 'BOL-0042', speciesId: 'SPE001', cam: 'CAM-01', firstDate: '2026-04-12', confidence: 94, sightings: 7 },
  { bolId: 'BOL-0087', speciesId: 'SPE014', cam: 'CAM-03', firstDate: '2026-05-01', confidence: 89, sightings: 3 },
  { bolId: 'BOL-0103', speciesId: 'SPE004', cam: 'CAM-02', firstDate: '2026-05-10', confidence: 92, sightings: 2 },
  { bolId: 'BOL-0156', speciesId: 'SPE003', cam: 'CAM-01', firstDate: '2026-05-15', confidence: 87, sightings: 4 },
  { bolId: 'BOL-0204', speciesId: 'SPE010', cam: 'CAM-04', firstDate: '2026-05-18', confidence: 76, sightings: 1 },
  { bolId: 'BOL-0231', speciesId: 'SPE009', cam: 'CAM-03', firstDate: '2026-05-20', confidence: 83, sightings: 2 },
  { bolId: 'BOL-0278', speciesId: 'SPE002', cam: 'CAM-02', firstDate: '2026-05-22', confidence: 91, sightings: 1 },
]

export const EDNA_DATA = [
  { name: '볼락',   value: 28 },
  { name: '노래미', value: 18 },
  { name: '문어',   value: 12 },
  { name: '전복',   value: 10 },
  { name: '성게',   value: 9 },
  { name: '독도새우', value: 8 },
  { name: '기타',   value: 15 },
]

export const BEHAVIORS = ['먹이 활동 중', '이동 중', '은신 중', '짝짓기 행동', '군집 형성']

export const CURRENT_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

export const SHOP_ITEMS = [
  { id: 'postcard',  name: '독도 기념 엽서',     emoji: '📮', price: 50,  desc: '독도 전경 고화질 엽서 4종 세트 (실물 배송)',    stock: 99 },
  { id: 'magnet',    name: '독도 냉장고 자석',    emoji: '🧲', price: 100, desc: '독도 해양 생물 일러스트 마그넷 세트',            stock: 50 },
  { id: 'badge',     name: '해양 지킴이 배지',    emoji: '🏅', price: 150, desc: '독도 해양 지킴이 공식 금속 배지',                stock: 30 },
  { id: 'calendar',  name: '독도 생태 달력 2027', emoji: '📅', price: 200, desc: '독도 해양 생물 사진으로 구성된 탁상 달력',        stock: 20 },
  { id: 'ecobag',    name: '독도 에코백',         emoji: '🛍️', price: 300, desc: '독도 지킴이 로고 캔버스 에코백 (친환경 소재)',    stock: 15 },
  { id: 'photobook', name: '독도 생태 사진집',    emoji: '📸', price: 500, desc: '해양 생태 전문 사진집 (A4 40페이지, 고급 양장)',  stock: 10 },
]
