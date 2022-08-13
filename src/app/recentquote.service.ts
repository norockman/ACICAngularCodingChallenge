import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { RecentQuote } from './RecentQuote';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class RecentQuoteService {

  private recentQuotesUrl = 'api/recentQuotes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,
    private commonService: CommonService) { }

  /** GET recent quotes from the server */
  getRecentQuotes(): Observable<RecentQuote[]> {
    return this.http.get<RecentQuote[]>(this.recentQuotesUrl)
      .pipe(
        tap(_ => this.commonService.log('fetched recent quotes')),
        catchError(this.commonService.handleError<RecentQuote[]>('getRecentQuotes', []))
      );
  }

  /** GET recent quotes by lineOfBusiness. Will 404 if id not found */
  getRecentQuotesbyLineOfBusiness(lineOfBusiness: number): Observable<RecentQuote[]> {
    const url = `${this.recentQuotesUrl}?lineOfBusiness=${lineOfBusiness}`;
    return this.http.get<RecentQuote[]>(url).pipe(
      tap(_ => this.commonService.log(`fetched RecentQuote id=${lineOfBusiness}`)),
      catchError(this.commonService.handleError<RecentQuote[]>(`getRecentQuotesbyLineOfBusiness id=${lineOfBusiness}`))
    );
  }
}
