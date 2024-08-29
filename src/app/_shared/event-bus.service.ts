import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { EventData } from './event.class';

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  // private subject$ = new Subject<EventData>();

  // emit(event: EventData) {
  //   this.subject$.next(event);
  // }

  // on(eventName: string, action: any): Subscription {
  //   return this.subject$.pipe(
  //       filter((e: EventData) => e.name === eventName),
  //       map((e: EventData) => e["value"])
  //     ).subscribe(action);
  // }

  private emit$ = new Subject<EventData>();
  readEvent = this.emit$.asObservable();

  constructor() {

  }

  emit(event: EventData) {
    this.emit$.next(event)
  }



}
