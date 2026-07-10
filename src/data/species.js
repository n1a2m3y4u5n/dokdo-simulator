export const SPECIES = [
  { id: 'SPE001', korean: '볼락', scientific: 'Sebastes inermis', emoji: '🐟', color: '#e85d04', category: 'fish' },
  { id: 'SPE002', korean: '노래미', scientific: 'Hexagrammos otakii', emoji: '🐠', color: '#6a4c93', category: 'fish' },
  { id: 'SPE003', korean: '돌돔', scientific: 'Oplegnathus fasciatus', emoji: '🐡', color: '#1982c4', category: 'fish' },
  { id: 'SPE004', korean: '문어', scientific: 'Octopus vulgaris', emoji: '🐙', color: '#8338ec', category: 'cephalopod' },
  { id: 'SPE005', korean: '해삼', scientific: 'Apostichopus japonicus', emoji: '🐛', color: '#3a86ff', category: 'echinoderm' },
  { id: 'SPE006', korean: '전복', scientific: 'Haliotis discus', emoji: '🐚', color: '#06d6a0', category: 'mollusk' },
  { id: 'SPE007', korean: '성게', scientific: 'Strongylocentrotus nudus', emoji: '🦔', color: '#fb5607', category: 'echinoderm' },
  { id: 'SPE008', korean: '홍합', scientific: 'Mytilus coruscus', emoji: '🦪', color: '#264653', category: 'mollusk' },
  { id: 'SPE009', korean: '오징어', scientific: 'Todarodes pacificus', emoji: '🦑', color: '#e9c46a', category: 'cephalopod' },
  { id: 'SPE010', korean: '꽃게', scientific: 'Portunus trituberculatus', emoji: '🦀', color: '#e63946', category: 'crustacean' },
  { id: 'SPE011', korean: '미역', scientific: 'Undaria pinnatifida', emoji: '🌿', color: '#2d6a4f', category: 'algae' },
  { id: 'SPE012', korean: '다시마', scientific: 'Saccharina japonica', emoji: '🌱', color: '#40916c', category: 'algae' },
  { id: 'SPE013', korean: '감태', scientific: 'Ecklonia cava', emoji: '🌾', color: '#52b788', category: 'algae' },
  { id: 'SPE014', korean: '독도새우', scientific: 'Pandalus latirostris', emoji: '🦐', color: '#ff6b6b', category: 'crustacean' },
  { id: 'SPE015', korean: '참돔', scientific: 'Pagrus major', emoji: '🐠', color: '#ffd166', category: 'fish' },
];

export const QUIZ_OPTIONS = [
  [
    { id: 'SPE001', korean: '볼락', correct: true },
    { id: 'SPE002', korean: '노래미', correct: false },
    { id: 'SPE015', korean: '참돔', correct: false },
    { id: 'SPE003', korean: '돌돔', correct: false },
  ],
  [
    { id: 'SPE004', korean: '문어', correct: true },
    { id: 'SPE009', korean: '오징어', correct: false },
    { id: 'SPE005', korean: '해삼', correct: false },
    { id: 'SPE008', korean: '홍합', correct: false },
  ],
  [
    { id: 'SPE010', korean: '꽃게', correct: true },
    { id: 'SPE014', korean: '독도새우', correct: false },
    { id: 'SPE007', korean: '성게', correct: false },
    { id: 'SPE006', korean: '전복', correct: false },
  ],
  [
    { id: 'SPE014', korean: '독도새우', correct: true },
    { id: 'SPE010', korean: '꽃게', correct: false },
    { id: 'SPE009', korean: '오징어', correct: false },
    { id: 'SPE004', korean: '문어', correct: false },
  ],
  [
    { id: 'SPE011', korean: '미역', correct: true },
    { id: 'SPE012', korean: '다시마', correct: false },
    { id: 'SPE013', korean: '감태', correct: false },
    { id: 'SPE006', korean: '전복', correct: false },
  ],
];
