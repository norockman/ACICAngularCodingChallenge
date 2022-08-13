import { Component, Input, OnInit } from '@angular/core';
import { RecentQuote, RecentQuoteSummary } from 'src/app/RecentQuote';
import { RecentQuoteService } from 'src/app/recentquote.service';

@Component({
  selector: 'app-recentQuotes-list',
  templateUrl: './recentquotes-list.component.html',
  styleUrls: ['./recentquotes-list.component.css']
})
export class RecentQuotesListComponent implements OnInit {
  @Input() recentQuotesSummary: RecentQuoteSummary[] = [];
  sumRecentQuotes: RecentQuoteSummary[] = [];

  constructor() { }

  ngOnChanges() {
    this.getRecentQuotesSummaryGroupby();
  }

  ngOnInit(): void {
  }

  //Group by: QuoteNumber And LineOfBusiness
  getRecentQuotesSummaryGroupby(): void {

    const dicRecentQuote: { [key: string]: RecentQuoteSummary } = {};
    this.recentQuotesSummary.forEach(recentQuoteSummary => {
      let key: string = recentQuoteSummary.lineOfBusiness + recentQuoteSummary.quoteNumber;
      if (dicRecentQuote[key] === undefined) {
        dicRecentQuote[key] = {
          quoteNumber: recentQuoteSummary.quoteNumber,
          lineOfBusiness: recentQuoteSummary.lineOfBusiness,
          name: recentQuoteSummary.name,
          description: recentQuoteSummary.description,
          quoteCount: 1
        };
      }
      else {
        let updateRecentQuote = dicRecentQuote[key];
        updateRecentQuote.quoteCount += 1;
        dicRecentQuote[key] = updateRecentQuote;
      }

    });

    for (let key in dicRecentQuote)
      this.sumRecentQuotes.push(dicRecentQuote[key]);

  }
}