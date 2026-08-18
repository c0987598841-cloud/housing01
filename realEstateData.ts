import { Property, RealPriceRecord, PriceTrendPoint, AreaSummary, BuildingType, ParkingType, AgentInfo } from '../types';

// Realistic benchmark price dictionary for Taiwanese districts (in 萬元/坪)
export const DISTRICT_BENCHMARK_PRICES: Record<string, number> = {
  // 臺北市
  '臺北市-大安區': 108.5,
  '臺北市-信義區': 102.0,
  '臺北市-中正區': 96.8,
  '臺北市-松山區': 94.2,
  '臺北市-中山區': 86.5,
  '臺北市-士林區': 78.6,
  '臺北市-內湖區': 74.5,
  '臺北市-南港區': 76.2,
  '臺北市-文山區': 63.8,
  '臺北市-北投區': 62.0,
  '臺北市-大同區': 73.5,
  '臺北市-萬華區': 61.2,

  // 新北市
  '新北市-板橋區': 63.5,
  '新北市-永和區': 65.2,
  '新北市-中和區': 56.8,
  '新北市-三重區': 55.4,
  '新北市-新莊區': 52.6,
  '新北市-新店區': 58.0,
  '新北市-土城區': 51.5,
  '新北市-蘆洲區': 48.2,
  '新北市-汐止區': 43.6,
  '新北市-林口區': 47.8,
  '新北市-樹林區': 38.5,
  '新北市-三峽區': 41.2,
  '新北市-鶯歌區': 35.6,
  '新北市-五股區': 37.2,
  '新北市-淡水區': 32.5,
  '新北市-泰山區': 42.0,
  '新北市-八里區': 28.5,
  '新北市-深坑區': 34.0,

  // 桃園市
  '桃園市-桃園區': 36.8,
  '桃園市-中壢區': 35.2,
  '桃園市-龜山區': 39.5, // 靠近A7/長庚
  '桃園市-八德區': 31.0,
  '桃園市-蘆竹區': 33.5,
  '桃園市-平鎮區': 27.2,
  '桃園市-楊梅區': 22.8,
  '桃園市-大園區': 34.0, // 青埔特區
  '桃園市-大溪區': 23.5,
  '桃園市-龍潭區': 24.0,

  // 新竹市 & 新竹縣
  '新竹市-東區': 66.5,
  '新竹市-北區': 48.2,
  '新竹市-香山區': 32.5,
  '新竹縣-竹北市': 68.8,
  '新竹縣-竹東鎮': 34.5,
  '新竹縣-新豐鄉': 29.8,
  '新竹縣-湖口鄉': 27.5,
  '新竹縣-寶山鄉': 42.0,

  // 臺中市
  '臺中市-西屯區': 54.5, // 七期/逢甲/中科
  '臺中市-南屯區': 50.2, // 八期/單元二/單元三
  '臺中市-北屯區': 44.8, // 14期/機捷特區
  '臺中市-西區': 45.6,  // 草悟道
  '臺中市-北區': 39.2,
  '臺中市-南區': 38.0,
  '臺中市-東區': 41.5,
  '臺中市-中區': 29.5,
  '臺中市-烏日區': 38.6, // 高鐵特區
  '臺中市-大里區': 32.0,
  '臺中市-太平區': 31.5,
  '臺中市-豐原區': 33.2,
  '臺中市-潭子區': 33.8,
  '臺中市-大雅區': 34.2,
  '臺中市-沙鹿區': 31.8,
  '臺中市-清水區': 25.5,

  // 臺南市
  '臺南市-東區': 40.2,
  '臺南市-北區': 36.5,
  '臺南市-中西區': 35.8,
  '臺南市-安平區': 34.2,
  '臺南市-永康區': 32.8,
  '臺南市-善化區': 37.5, // 南科
  '臺南市-新市區': 35.2, // 南科
  '臺南市-安南區': 31.0, // 九份子
  '臺南市-歸仁區': 33.0, // 高鐵
  '臺南市-仁德區': 29.5,

  // 高雄市
  '高雄市-鼓山區': 48.5, // 美術館/農16
  '高雄市-左營區': 41.2, // 高鐵/巨蛋
  '高雄市-前鎮區': 38.5, // 亞灣區
  '高雄市-苓雅區': 36.8,
  '高雄市-三民區': 35.2,
  '高雄市-新興區': 34.0,
  '高雄市-前金區': 37.5,
  '高雄市-楠梓區': 34.8, // 台積電園區
  '高雄市-橋頭區': 35.0, // 新市鎮/半導體
  '高雄市-鳳山區': 33.5,
  '高雄市-仁武區': 29.8,
  '高雄市-鳥松區': 31.2,
  '高雄市-小港區': 24.5,
};

// Realistic street names for major regions
const REGION_ROADS: Record<string, string[]> = {
  '臺北市-大安區': ['敦化南路一段', '忠孝東路四段', '信義路四段', '和平東路二段', '復興南路二段', '仁愛路四段', '新生南路一段'],
  '臺北市-信義區': ['信義路五段', '忠孝東路五段', '松仁路', '松高路', '基隆路一段', '莊敬路', '松德路'],
  '臺北市-中山區': ['民生東路二段', '南京東路二段', '中山北路二段', '林森北路', '松江路', '敬業三路', '明水路'],
  '新北市-板橋區': ['文化路二段', '縣民大道二段', '漢生東路', '新站路', '中山路一段', '雙十路二段', '民生路三段'],
  '新北市-中和區': ['中和路', '景平路', '中山路二段', '連城路', '南山路', '員山路'],
  '新竹縣-竹北市': ['光明六路東二段', '文興路一段', '嘉豐南路二段', '自強南路', '莊敬南路', '科大二街', '高鐵七路'],
  '新竹市-東區': ['光復路一段', '關新路', '關新東路', '慈雲路', '金山街', '明湖路', '食品路'],
  '臺中市-西屯區': ['市政路', '市政北七路', '台灣大道三段', '河南路二段', '朝富路', '福科路', '國安一路'],
  '臺中市-北屯區': ['敦富路', '崇德路三段', '太原路三段', '山西路三段', '軍福十九路', '松竹路一段'],
  '臺南市-東區': ['中華東路一段', '東門路二段', '林森路二段', '長榮路二段', '平實路', '小東路'],
  '臺南市-善化區': ['光復路', '建國路', '民生路', '中正路', '蓮潭里陽光大道', '西拉雅大道'],
  '高雄市-鼓山區': ['明誠四路', '美術東二路', '青海路', '神農路', '博愛二路', '裕誠路'],
  '高雄市-楠梓區': ['藍田路', '大學南路', '德民路', '後昌新路', '高楠公路', '加昌路'],
};

const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
];

const COMMUNITY_PREFIXES = ['聯聚', '國泰', '潤泰', '遠雄', '華固', '富邦', '興富發', '大陸', '寶佳', '惠宇', '順天', '總太', '京城', '城揚', '太普', '豐邑', '冠德'];
const COMMUNITY_SUFFIXES = ['御邸', '天廈', '首璽', '晶華', '名邸', '臻品', '花園廣場', '大院', '四季', '森鄰', '尊爵', '中央公園', '晴川', '美學'];

const AGENT_LIST: AgentInfo[] = [
  {
    name: '林家豪 (經紀人)',
    agency: '信義房屋 旗艦加盟店',
    phone: '0912-345-678',
    licenseNumber: '(111) 登字第412099號',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    experienceYears: 9,
  },
  {
    name: '陳怡君 (專案協理)',
    agency: '永慶不動產 經貿加盟店',
    phone: '0928-888-168',
    licenseNumber: '(108) 登字第351820號',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    experienceYears: 12,
  },
  {
    name: '張哲銘 (資深經理)',
    agency: '住商不動產 精品加盟店',
    phone: '0935-666-999',
    licenseNumber: '(112) 登字第439121號',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    experienceYears: 7,
  },
  {
    name: '黃雅婷 (百萬經紀人)',
    agency: '台灣房屋 核心加盟店',
    phone: '0970-123-456',
    licenseNumber: '(110) 登字第398765號',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    experienceYears: 8,
  },
];

// Helper to get benchmark base price for any city-district combination
export function getBenchmarkBasePrice(city: string, district: string): number {
  const key = `${city}-${district}`;
  if (DISTRICT_BENCHMARK_PRICES[key]) {
    return DISTRICT_BENCHMARK_PRICES[key];
  }
  // Default based on city general tier
  if (city.includes('臺北') || city.includes('台北')) return 72.0;
  if (city.includes('新北')) return 46.0;
  if (city.includes('新竹')) return 48.0;
  if (city.includes('臺中') || city.includes('台中')) return 36.0;
  if (city.includes('臺南') || city.includes('台南')) return 30.0;
  if (city.includes('高雄')) return 32.0;
  if (city.includes('桃園')) return 29.0;
  if (city.includes('基隆') || city.includes('嘉義') || city.includes('彰化') || city.includes('宜蘭') || city.includes('苗栗')) return 22.0;
  return 18.5;
}

// Generate the 5 Most Recent Real Price Registration Records
export function getRecent5RealPriceRecords(city: string, district: string): RealPriceRecord[] {
  const basePrice = getBenchmarkBasePrice(city, district);
  const key = `${city}-${district}`;
  const roads = REGION_ROADS[key] || ['中山路', '中正路', '光明路', '復興路', '成功路', '中華路', '民生街'];
  
  const mockDates = [
    { roc: '115/02', formatted: '2026年02月', monthAgo: 0 },
    { roc: '115/01', formatted: '2026年01月', monthAgo: 1 },
    { roc: '114/12', formatted: '2025年12月', monthAgo: 2 },
    { roc: '114/11', formatted: '2025年11月', monthAgo: 3 },
    { roc: '114/10', formatted: '2025年10月', monthAgo: 4 },
  ];

  const buildingTypes: BuildingType[] = ['電梯大樓', '電梯大樓', '華廈', '公寓', '透天別墅'];
  const pings = [36.8, 48.5, 29.2, 24.6, 62.4];
  const ageList = [3, 8, 16, 32, 11];
  const floors = ['11樓 / 共 15 樓', '7樓 / 共 24 樓', '5樓 / 共 7 樓', '3樓 / 共 5 樓', '全棟 1~4 樓'];
  const layouts = ['3房2廳2衛', '4房2廳2衛', '2房2廳1衛', '3房2廳1衛', '5房3廳4衛'];
  const parkings = [
    '含坡道平面車位 1 個 (230萬)',
    '含坡道平面車位 2 個 (450萬)',
    '含升降機械車位 1 個 (120萬)',
    '無車位',
    '一樓前院平面獨立雙車庫',
  ];

  return mockDates.map((d, index) => {
    const road = roads[index % roads.length];
    const doorNumber = `${(index + 1) * 30 + 1}~${(index + 1) * 30 + 30} 號`;
    const bType = buildingTypes[index];
    const ping = pings[index];
    const age = ageList[index];

    // Price variation based on type and age
    let typeModifier = 1.0;
    if (bType === '電梯大樓') typeModifier = age < 5 ? 1.08 : 1.0;
    if (bType === '華廈') typeModifier = 0.88;
    if (bType === '公寓') typeModifier = 0.72;
    if (bType === '透天別墅') typeModifier = 0.95;

    // Slight variance
    const variance = (index % 2 === 0 ? 1 : -1) * (index * 0.8 + 0.5);
    const unitPricePing = Math.round((basePrice * typeModifier + variance) * 10) / 10;
    const parkingVal = index === 3 ? 0 : (index === 1 ? 450 : 220);
    const totalPrice = Math.round((unitPricePing * (ping - (index === 3 ? 0 : 8)) + parkingVal) * 10) / 10;
    const priceDiffPercent = Math.round(((unitPricePing - basePrice) / basePrice) * 1000) / 10;

    const prefix = COMMUNITY_PREFIXES[(index * 3) % COMMUNITY_PREFIXES.length];
    const suffix = COMMUNITY_SUFFIXES[(index * 2) % COMMUNITY_SUFFIXES.length];
    const communityName = bType === '公寓' ? `${road}經典透天/公寓` : `${prefix}${district.replace('區', '')}${suffix}`;

    return {
      id: `rp-${city}-${district}-${index + 1}`,
      transactionDate: d.roc,
      formattedDate: d.formatted,
      address: `${road} ${doorNumber}`,
      communityName,
      totalPrice,
      areaPing: ping,
      unitPricePing,
      buildingType: bType,
      floor: floors[index],
      age,
      layout: layouts[index],
      parkingInfo: parkings[index],
      priceDiffPercent,
      buildingMaterial: bType === '透天別墅' || bType === '公寓' ? '鋼筋混凝土(RC)' : '鋼骨鋼筋混凝土(SRC)',
      purpose: '住家用',
    };
  });
}

// Generate Historical Price Trend Points (Past 8 Quarters: 2024 Q1 - 2025 Q4 / 2026 Q1)
export function getPriceTrendData(city: string, district: string): PriceTrendPoint[] {
  const currentBasePrice = getBenchmarkBasePrice(city, district);
  
  const periods = [
    { q: '2024 Q2', m: '2024/06', growthFactor: 0.88, volFactor: 1.15 },
    { q: '2024 Q3', m: '2024/09', growthFactor: 0.91, volFactor: 1.25 },
    { q: '2024 Q4', m: '2024/12', growthFactor: 0.94, volFactor: 0.95 },
    { q: '2025 Q1', m: '2025/03', growthFactor: 0.96, volFactor: 0.88 },
    { q: '2025 Q2', m: '2025/06', growthFactor: 0.98, volFactor: 0.92 },
    { q: '2025 Q3', m: '2025/09', growthFactor: 0.99, volFactor: 0.85 },
    { q: '2025 Q4', m: '2025/12', growthFactor: 1.00, volFactor: 0.90 },
    { q: '2026 Q1', m: '2026/03', growthFactor: 1.015, volFactor: 0.94 },
    { q: '2026 Q2', m: '2026/06 (即時)', growthFactor: 1.025, volFactor: 0.96 },
  ];

  return periods.map((p) => {
    const overall = Math.round(currentBasePrice * p.growthFactor * 10) / 10;
    const elevator = Math.round(overall * 1.12 * 10) / 10;
    const lowRise = Math.round(overall * 0.82 * 10) / 10;
    const baseVolume = Math.round(180 + (currentBasePrice > 60 ? 120 : 250) * p.volFactor);
    const minPrice = Math.round(lowRise * 0.88 * 10) / 10;
    const maxPrice = Math.round(elevator * 1.22 * 10) / 10;

    return {
      period: p.q,
      monthLabel: p.m,
      elevatorPrice: elevator,
      lowRisePrice: lowRise,
      overallPrice: overall,
      volume: baseVolume,
      minPrice,
      maxPrice,
    };
  });
}

// Generate Properties For Sale (中古屋待售清單)
export function getPropertiesForSale(city: string, district: string): Property[] {
  const basePrice = getBenchmarkBasePrice(city, district);
  const key = `${city}-${district}`;
  const roads = REGION_ROADS[key] || ['中山路一段', '中正路二段', '光明路', '復興路', '成功路一段', '中華路二段', '民生街'];

  const templates = [
    {
      titleModifier: '捷運站旁稀有景觀高樓三房含車位',
      type: '電梯大樓' as BuildingType,
      rooms: 3, living: 2, baths: 2, balconies: 2,
      pingMain: 28.5, pingSub: 4.2, pingPublic: 12.8,
      age: 4, floor: 12, totalFloors: 18,
      parking: '坡道平面' as ParkingType,
      parkingPrice: 220,
      orientation: '朝南',
      mgtFee: 3200,
      tags: ['捷運旁', '近雙語學區', '邊間採光佳', '全新裝潢', '社區公設完善'],
      desc: '稀有高樓釋出，格局方正前後大陽台，視野無遮蔽採光通風極佳，步行至商圈與捷運站僅5分鐘，名建商營造品質有保障。',
      priceMult: 1.06,
    },
    {
      titleModifier: '精華地段名宅四房雙平車｜公園第一排',
      type: '電梯大樓' as BuildingType,
      rooms: 4, living: 2, baths: 2, balconies: 2,
      pingMain: 42.0, pingSub: 5.8, pingPublic: 18.5,
      age: 7, floor: 9, totalFloors: 22,
      parking: '坡道平面' as ParkingType,
      parkingPrice: 420,
      orientation: '朝東南',
      mgtFee: 4800,
      tags: ['公園第一排', '雙平面車位', '大四房', '知名豪宅物業', '尊榮大廳'],
      desc: '綠意公園第一排無敵景觀，大器四房雙主臥規劃，附B1獨立相鄰雙大平車，24小時五星級飯店式物業管理。',
      priceMult: 1.15,
    },
    {
      titleModifier: '低公設超大室內雙陽台溫馨兩房',
      type: '華廈' as BuildingType,
      rooms: 2, living: 2, baths: 1, balconies: 2,
      pingMain: 21.5, pingSub: 3.2, pingPublic: 4.8,
      age: 18, floor: 5, totalFloors: 7,
      parking: '坡道機械' as ParkingType,
      parkingPrice: 130,
      orientation: '朝東',
      mgtFee: 1500,
      tags: ['低公設比', '超低管理費', '首購精選', '周邊機能成熟', '即可入住'],
      desc: '公設比僅約 16%，室內使用空間大，雙面採光衛浴開窗，一層兩戶住戶單純，小資首購成家第一首選！',
      priceMult: 0.88,
    },
    {
      titleModifier: '自住首選生活機能極佳！靜巷大三房',
      type: '電梯大樓' as BuildingType,
      rooms: 3, living: 2, baths: 2, balconies: 1,
      pingMain: 26.2, pingSub: 3.5, pingPublic: 11.5,
      age: 12, floor: 6, totalFloors: 14,
      parking: '坡道平面' as ParkingType,
      parkingPrice: 200,
      orientation: '朝西南',
      mgtFee: 2600,
      tags: ['靜巷住宅', '近傳統市場', '格局方正', '無暗房', '垃圾專人處理'],
      desc: '離塵不離城，鬧中取靜優質住宅區，周邊全聯、市場、超商一應俱全，三代同堂舒適宜居。',
      priceMult: 0.97,
    },
    {
      titleModifier: '超稀有市中心大地坪透天別墅前院停車',
      type: '透天別墅' as BuildingType,
      rooms: 5, living: 3, baths: 4, balconies: 3,
      pingMain: 65.0, pingSub: 8.5, pingPublic: 0,
      age: 15, floor: 1, totalFloors: 4,
      parking: '一樓平面' as ParkingType,
      parkingPrice: 0,
      orientation: '朝南',
      mgtFee: 0,
      tags: ['獨立產權', '零公設', '前院停車', '五大套房', '傳家首選'],
      desc: '難得釋出獨立地坪透天別墅，整棟 1~4 樓，一樓寬敞客餐廳與前院車庫，頂樓大露台可作空中花園或神明廳。',
      priceMult: 0.94,
    },
    {
      titleModifier: '高投報小資成家捷運精緻電梯套房',
      type: '套房' as BuildingType,
      rooms: 1, living: 1, baths: 1, balconies: 1,
      pingMain: 11.2, pingSub: 1.8, pingPublic: 4.5,
      age: 9, floor: 7, totalFloors: 12,
      parking: '無車位' as ParkingType,
      parkingPrice: 0,
      orientation: '朝北',
      mgtFee: 1200,
      tags: ['高租金收益', '總價親民', '近捷運站', '飯店式管理', '收租自住皆宜'],
      desc: '鄰近核心商圈與辦公大樓群，租客穩定租金收益率高，附精緻全套傢俱家電，買進立享租金收入。',
      priceMult: 1.08,
    },
    {
      titleModifier: '捷運景觀大露台美宅｜極稀有釋出',
      type: '電梯大樓' as BuildingType,
      rooms: 3, living: 2, baths: 2, balconies: 2,
      pingMain: 31.0, pingSub: 6.5, pingPublic: 13.5,
      age: 6, floor: 14, totalFloors: 15,
      parking: '坡道平面' as ParkingType,
      parkingPrice: 240,
      orientation: '朝南',
      mgtFee: 3600,
      tags: ['專有大露台', '高樓層無遮蔽', '雙向坡平車位', '知名建商', '豪華公設'],
      desc: '稀有頂樓次高層約定專用大露台，私人空中庭園造景，奢華生活空間，室內奢華現代裝潢直接入住。',
      priceMult: 1.12,
    },
    {
      titleModifier: '成熟商圈超值採光公寓三樓免爬高',
      type: '公寓' as BuildingType,
      rooms: 3, living: 2, baths: 2, balconies: 2,
      pingMain: 27.5, pingSub: 3.5, pingPublic: 0,
      age: 34, floor: 3, totalFloors: 5,
      parking: '無車位' as ParkingType,
      parkingPrice: 0,
      orientation: '朝東南',
      mgtFee: 0,
      tags: ['零公設實坪大', '黃金三樓', '免管理費', '全棟管線已更新', '土地持分大'],
      desc: '傳統黃金三樓樓層，全室水電管線已全部翻新，雙陽台大客廳，土地持分大具未來危老都更潛力！',
      priceMult: 0.72,
    },
  ];

  return templates.map((t, index) => {
    const road = roads[index % roads.length];
    const prefix = COMMUNITY_PREFIXES[(index * 2 + 1) % COMMUNITY_PREFIXES.length];
    const suffix = COMMUNITY_SUFFIXES[(index * 3 + 2) % COMMUNITY_SUFFIXES.length];
    const communityName = t.type === '公寓' ? `${road}經典名居` : `${prefix}${district.replace('區', '')}${suffix}`;
    const title = `【${communityName}】${t.titleModifier}`;

    const totalPing = Math.round((t.pingMain + t.pingSub + t.pingPublic) * 10) / 10;
    const publicRatio = totalPing > 0 ? Math.round((t.pingPublic / totalPing) * 1000) / 10 : 0;
    const unitPrice = Math.round(basePrice * t.priceMult * 10) / 10;
    const housePrice = Math.round(unitPrice * totalPing);
    const totalPrice = housePrice + (t.parkingPrice || 0);

    const agent = AGENT_LIST[index % AGENT_LIST.length];
    const imgUrl = PROPERTY_IMAGES[index % PROPERTY_IMAGES.length];
    const extraImgs = [
      imgUrl,
      PROPERTY_IMAGES[(index + 1) % PROPERTY_IMAGES.length],
      PROPERTY_IMAGES[(index + 2) % PROPERTY_IMAGES.length],
    ];

    return {
      id: `prop-${city}-${district}-${index + 101}`,
      title,
      communityName,
      city,
      district,
      address: `${city}${district}${road}${30 + index * 15}號`,
      price: totalPrice,
      pingTotal: totalPing,
      pingMain: t.pingMain,
      pingSub: t.pingSub,
      pingPublic: t.pingPublic,
      publicRatio,
      pricePerPing: unitPrice,
      age: t.age,
      floor: t.floor,
      totalFloors: t.totalFloors,
      rooms: t.rooms,
      livingRooms: t.living,
      bathrooms: t.baths,
      balconies: t.balconies,
      buildingType: t.type,
      parkingType: t.parking,
      parkingPrice: t.parkingPrice,
      orientation: t.orientation,
      managementFee: t.mgtFee,
      tags: t.tags,
      description: t.desc,
      imageUrl: imgUrl,
      images: extraImgs,
      agent,
      createdAt: '2026-03-01',
    };
  });
}

// Generate Area Market Summary
export function getAreaSummary(city: string, district: string): AreaSummary {
  const avgPrice = getBenchmarkBasePrice(city, district);
  const medianPrice = Math.round(avgPrice * 0.97 * 10) / 10;
  const highestPrice = Math.round(avgPrice * 1.38 * 10) / 10;
  const lowestPrice = Math.round(avgPrice * 0.68 * 10) / 10;
  const yoyChange = Math.round((3.2 + (avgPrice > 50 ? 2.5 : 1.5)) * 10) / 10;
  const qoqChange = Math.round((0.8 + (avgPrice > 50 ? 0.6 : 0.3)) * 10) / 10;

  // Price Distribution bands
  let priceRanges: string[];
  if (avgPrice > 80) {
    priceRanges = ['70萬以下', '70~90萬', '90~110萬', '110~130萬', '130萬以上'];
  } else if (avgPrice > 50) {
    priceRanges = ['40萬以下', '40~50萬', '50~65萬', '65~80萬', '80萬以上'];
  } else if (avgPrice > 30) {
    priceRanges = ['25萬以下', '25~32萬', '32~40萬', '40~50萬', '50萬以上'];
  } else {
    priceRanges = ['15萬以下', '15~20萬', '20~28萬', '28~35萬', '35萬以上'];
  }

  const distribution = [
    { range: priceRanges[0], percentage: 12, count: 28 },
    { range: priceRanges[1], percentage: 24, count: 56 },
    { range: priceRanges[2], percentage: 38, count: 89 },
    { range: priceRanges[3], percentage: 18, count: 42 },
    { range: priceRanges[4], percentage: 8, count: 19 },
  ];

  return {
    city,
    district,
    avgPrice,
    medianPrice,
    yoyChange,
    qoqChange,
    highestPrice,
    lowestPrice,
    totalListingsCount: 234,
    recentTransactionsCount: 68,
    avgDaysOnMarket: 42,
    priceDistribution: distribution,
  };
}
