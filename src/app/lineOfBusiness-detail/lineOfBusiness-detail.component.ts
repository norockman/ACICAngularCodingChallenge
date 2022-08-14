import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';
import { RecentQuoteService } from '../recentquote.service';

@Component({
  selector: 'app-lineOfBusiness-detail',
  templateUrl: './lineOfBusiness-detail.component.html',
  styleUrls: [ './lineOfBusiness-detail.component.css' ]
})
export class LineOfBusinessDetailComponent implements OnInit {
  lineOfBusiness: LineOfBusiness | undefined;
  totalQuoteCount: number = 0;
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private lineOfBusinessService: LineOfBusinessService,
    private location: Location,
    private recentQuoteService: RecentQuoteService
  ) {}

  ngOnInit(): void {
    this.id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.getLineOfBusiness();
    this.countLineOfBusiness();
  }

  getLineOfBusiness(): void {
    this.lineOfBusinessService.getLineOfBusiness(this.id)
      .subscribe(lineOfBusiness => this.lineOfBusiness = lineOfBusiness);
  }

  countLineOfBusiness(): void {
    this.recentQuoteService.getRecentQuotesbyLineOfBusiness(this.id)
      .subscribe(recentQuotes => this.totalQuoteCount = recentQuotes.length)
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.lineOfBusiness) {
      this.lineOfBusinessService.updateLineOfBusiness(this.lineOfBusiness)
        .subscribe(() => this.goBack());
    }
  }
}
