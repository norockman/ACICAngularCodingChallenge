import { LineOfBusiness } from "./LineOfBusiness";

export interface RecentQuote {
  id: number;
  quoteNumber: string;
  lineOfBusiness: number;
}

export interface RecentQuoteSummary extends Omit<RecentQuote, 'id'>, Omit<LineOfBusiness, 'id'> {
  quoteCount: number;
}