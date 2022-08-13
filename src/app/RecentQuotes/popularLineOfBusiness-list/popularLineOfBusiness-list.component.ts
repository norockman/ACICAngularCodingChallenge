import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { LineOfBusiness } from 'src/app/LineOfBusiness';
import { LineOfBusinessService } from 'src/app/lineOfBusiness.service';
import { RecentQuote, RecentQuoteSummary } from 'src/app/RecentQuote';
import { RecentQuoteService } from 'src/app/recentquote.service';

@Component({
  selector: 'app-popularlineofbusiness-list',
  templateUrl: './popularlineofbusiness-list.component.html',
  styleUrls: ['./popularlineofbusiness-list.component.css']
})
export class PopularLineOfBusinessComponent implements OnInit {
  linesOfBusiness: LineOfBusiness[] = [];
  recentQuotesSummary: RecentQuoteSummary[] = [];

  constructor(private lineOfBusinessService: LineOfBusinessService, private recentQuoteService: RecentQuoteService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    forkJoin([this.lineOfBusinessService.getLinesOfBusiness(), this.recentQuoteService.getRecentQuotes()])
      .subscribe(([linesOfBusiness, recentQuotes]) => {
        this.recentQuotesSummary = this.mergeDataToRentQuoteSummary(linesOfBusiness, recentQuotes);
        this.linesOfBusiness = this.top2LineOfBusiness(linesOfBusiness, this.getTopLinesOfBusinessGroupby(this.recentQuotesSummary));
      });
  }

  mergeDataToRentQuoteSummary(linesOfBusiness: LineOfBusiness[], recentQuotes: RecentQuote[]): RecentQuoteSummary[] {
    let mergeData: RecentQuoteSummary[] = [];

    recentQuotes.forEach(recentQuote => {
      let lb = linesOfBusiness.find(x => x.id === recentQuote.lineOfBusiness);
      let quoteDetail: RecentQuoteSummary = {
        quoteNumber: recentQuote.quoteNumber,
        lineOfBusiness: recentQuote.lineOfBusiness,
        description: lb?.description,
        name: lb?.name,
        quoteCount: 1
      };

      mergeData.push(quoteDetail);
    });

    return mergeData;
  }

  top2LineOfBusiness(linesOfBusiness: LineOfBusiness[], topLinesOfBusiness: TopLinesOfBusiness[]): LineOfBusiness[] {
    topLinesOfBusiness.sort((a, b) => (a.quoteCount > b.quoteCount) ? -1 : 1);

    return linesOfBusiness.filter(x => 
      (x.id === topLinesOfBusiness[0].lineOfBusiness) || (x.id === topLinesOfBusiness[1].lineOfBusiness)
    ).slice(0, 2);//only select 2 in case of multiple records = max count
  }

  //Group by: LineOfBusiness
  getTopLinesOfBusinessGroupby(quoteDetails: RecentQuoteSummary[]): TopLinesOfBusiness[] {
    const dicQuoteDetails: { [key: string]: TopLinesOfBusiness } = {};
    quoteDetails.forEach(quoteDetail => {
      if (dicQuoteDetails[quoteDetail.lineOfBusiness] === undefined) {
        dicQuoteDetails[quoteDetail.lineOfBusiness] = {
          lineOfBusiness: quoteDetail.lineOfBusiness,
          quoteCount: 1
        }
      }
      else {
        let temp = dicQuoteDetails[quoteDetail.lineOfBusiness];
        temp.quoteCount += 1;
        dicQuoteDetails[quoteDetail.lineOfBusiness] = temp;
      }
    });

    let topLinesOfBusiness: TopLinesOfBusiness[] = [];
    for (let key in dicQuoteDetails)
      topLinesOfBusiness.push(dicQuoteDetails[key]);

    return topLinesOfBusiness;
  }
}

interface TopLinesOfBusiness {
  lineOfBusiness: number,
  quoteCount: number
}