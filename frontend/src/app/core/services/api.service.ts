import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IChords } from '../models/chords.interface';
import { ISearchTrack } from '../models/search-track.interface';
import { ITrack } from '../models/track.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  public searchTracks(title: string, artists: string): Observable<ISearchTrack[]> {
    const params: Record<string, string> = {};

    if (title) {
      params['title'] = title;
    }

    if (artists) {
      params['artists'] = artists;
    }

    return this.http.get<ISearchTrack[]>('track/search', { params });
  }

  public getTrack(trackId: string): Observable<ITrack> {
    return this.http.get<ITrack>(`track/${trackId}`);
  }

  public getTrackTemplate(): Observable<string> {
    return this.http.get<string>('track/template');
  }

  public getChords(key: string): Observable<IChords> {
    return this.http.get<IChords>('chords/byKey', { params: { key } });
  }
}
