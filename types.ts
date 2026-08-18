export interface TaiwanDistrictData {
  city: string;
  districts: string[];
}

export type BuildingType = '電梯大樓' | '華廈' | '公寓' | '透天別墅' | '套房';
export type ParkingType = '坡道平面' | '坡道機械' | '升降平面' | '升降機械' | '一樓平面' | '無車位';

export interface AgentInfo {
  name: string;
  agency: string;
  phone: string;
  licenseNumber: string;
  avatarUrl: string;
  experienceYears: number;
}

export interface Property {
  id: string;
  title: string;
  communityName: string;
  city: string;
  district: string;
  address: string;
  price: number; // 總價 (萬元)
  pingTotal: number; // 總建坪
  pingMain: number; // 主建物坪數
  pingSub: number; // 附屬建物 (陽台/雨遮)
  pingPublic: number; // 公設坪數
  publicRatio: number; // 公設比 %
  pricePerPing: number; // 萬元 / 坪
  age: number; // 屋齡 (年)
  floor: number; // 樓層
  totalFloors: number; // 總樓層
  rooms: number; // 房
  livingRooms: number; // 廳
  bathrooms: number; // 衛
  balconies: number; // 陽台
  buildingType: BuildingType;
  parkingType: ParkingType;
  parkingPrice?: number; // 車位價格 (萬元)
  orientation: string; // 座向 (朝南/朝東南/朝北等)
  managementFee: number; // 管理費 (元/月)
  tags: string[];
  description: string;
  imageUrl: string;
  images: string[];
  agent: AgentInfo;
  createdAt: string;
}

export interface RealPriceRecord {
  id: string;
  transactionDate: string; // e.g. 115/02 or 2026/02
  formattedDate: string;
  address: string; // e.g. 大安路一段 31~60 號
  communityName: string;
  totalPrice: number; // 萬元
  areaPing: number; // 交易總坪數
  unitPricePing: number; // 單價 (萬元/坪, 車位已拆算)
  buildingType: BuildingType;
  floor: string; // e.g. "8樓 / 共 15 樓"
  age: number; // 交易時屋齡
  layout: string; // e.g. "3房2廳2衛"
  parkingInfo: string; // e.g. "含坡道平面車位 1 個 (280萬)" or "無車位"
  priceDiffPercent: number; // 與區域均價相比差距 % (正為高於，負為低於)
  buildingMaterial?: string; // 鋼筋混凝土(RC) / 鋼骨(SC)
  purpose?: string; // 住家用 / 商業用
}

export interface PriceTrendPoint {
  period: string; // e.g. "2024 Q3", "2024 Q4", "2025 Q1", etc.
  monthLabel: string;
  elevatorPrice: number; // 電梯大樓單價 (萬/坪)
  lowRisePrice: number; // 華廈/公寓單價 (萬/坪)
  overallPrice: number; // 全區均價 (萬/坪)
  volume: number; // 成交量 (戶)
  minPrice: number; // 最低單價
  maxPrice: number; // 最高單價
}

export interface PriceDistribution {
  range: string;
  percentage: number;
  count: number;
}

export interface AreaSummary {
  city: string;
  district: string;
  avgPrice: number; // 當前均價 萬/坪
  medianPrice: number; // 中位數單價 萬/坪
  yoyChange: number; // 年增率 %
  qoqChange: number; // 季增率 %
  highestPrice: number;
  lowestPrice: number;
  totalListingsCount: number;
  recentTransactionsCount: number;
  avgDaysOnMarket: number;
  priceDistribution: PriceDistribution[];
}

export interface FilterOptions {
  keyword: string;
  minPrice?: number;
  maxPrice?: number;
  minPing?: number;
  maxPing?: number;
  minAge?: number;
  maxAge?: number;
  rooms?: number | 'all';
  buildingType?: BuildingType | 'all';
  sortBy: 'price-asc' | 'price-desc' | 'unit-asc' | 'unit-desc' | 'ping-desc' | 'age-asc' | 'latest';
}
