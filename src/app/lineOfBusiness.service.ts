import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { LineOfBusiness } from './LineOfBusiness';
import { CommonService } from './common.service';


@Injectable({ providedIn: 'root' })
export class LineOfBusinessService {

  private lineOfBusinessUrl = 'api/linesOfBusiness';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private commonService: CommonService) { }

  /** GET lines of business from the server */
  getLinesOfBusiness(): Observable<LineOfBusiness[]> {
    return this.http.get<LineOfBusiness[]>(this.lineOfBusinessUrl)
      .pipe(
        tap(_ => this.commonService.log('fetched lines of business')),
        catchError(this.commonService.handleError<LineOfBusiness[]>('getLinesOfBusiness', []))
      );
  }

  /** GET line of business by id. Return `undefined` when id not found */
  getLineOfBusinessNo404<Data>(id: number): Observable<LineOfBusiness> {
    const url = `${this.lineOfBusinessUrl}/?id=${id}`;
    return this.http.get<LineOfBusiness[]>(url)
      .pipe(
        map(linesOfBusiness => linesOfBusiness[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.commonService.log(`${outcome} lineOfBusiness id=${id}`);
        }),
        catchError(this.commonService.handleError<LineOfBusiness>(`getLineOfBusiness id=${id}`))
      );
  }

  /** GET line of business by id. Will 404 if id not found */
  getLineOfBusiness(id: number): Observable<LineOfBusiness> {
    const url = `${this.lineOfBusinessUrl}/${id}`;
    return this.http.get<LineOfBusiness>(url).pipe(
      tap(_ => this.commonService.log(`fetched lineOfBusiness id=${id}`)),
      catchError(this.commonService.handleError<LineOfBusiness>(`getLineOfBusiness id=${id}`))
    );
  }

  /* GET lines of business whose name contains search term */
  searchLinesOfBusiness(term: string): Observable<LineOfBusiness[]> {
    if (!term.trim()) {
      // if not search term, return empty line of business array.
      return of([]);
    }
    return this.http.get<LineOfBusiness[]>(`${this.lineOfBusinessUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.commonService.log(`found line of business matching "${term}"`) :
         this.commonService.log(`no lines of business matching "${term}"`)),
      catchError(this.commonService.handleError<LineOfBusiness[]>('searchLinesOfBusiness', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new line of business to the server */
  addLineOfBusiness(lineOfBusiness: LineOfBusiness): Observable<LineOfBusiness> {
    return this.http.post<LineOfBusiness>(this.lineOfBusinessUrl, lineOfBusiness, this.httpOptions).pipe(
      tap((newLineOfBusiness: LineOfBusiness) => this.commonService.log(`added line of business w/ id=${newLineOfBusiness.id}`)),
      catchError(this.commonService.handleError<LineOfBusiness>('addLineOfBusiness'))
    );
  }

  /** DELETE: delete the line of business from the server */
  deleteLineOfBusiness(id: number): Observable<LineOfBusiness> {
    const url = `${this.lineOfBusinessUrl}/${id}`;

    return this.http.delete<LineOfBusiness>(url, this.httpOptions).pipe(
      tap(_ => this.commonService.log(`deleted line of business id=${id}`)),
      catchError(this.commonService.handleError<LineOfBusiness>('deleteLineOfBusiness'))
    );
  }

  /** PUT: update the line of business on the server */
  updateLineOfBusiness(lineOfBusiness: LineOfBusiness): Observable<any> {
    return this.http.put(this.lineOfBusinessUrl, lineOfBusiness, this.httpOptions).pipe(
      tap(_ => this.commonService.log(`updated line of business id=${lineOfBusiness.id}`)),
      catchError(this.commonService.handleError<any>('updateLineOfBusiness'))
    );
  }
}
