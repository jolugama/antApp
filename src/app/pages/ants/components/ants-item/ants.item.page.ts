import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';


// rxjs y redux
import { Observable, combineLatest, of, Subscription, empty } from 'rxjs';
import { distinctUntilChanged, map, switchMap, take, catchError } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

// actions y reducers
import * as fromAntsReducers from '@pages/ants/reducers';
import * as fromAntsActions from '@pages/ants/actions';


// servicios
import { AntsService } from '@pages/ants/services/ants.service';


import { ItemPageComponent } from '@shared/components/item-page/item-page.component';




@Component({
  selector: 'app-ants-items',
  templateUrl: './ants-item.page.html',
  styleUrls: ['./ants-item.page.scss'],
})
export class AntsItemPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('page') page: ItemPageComponent;
  itemsSuscription$: Subscription;


  constructor(
    // private dataService: DataService,
    private antService: AntsService,
    private storeItems$: Store<fromAntsReducers.State>,
  ) {
    console.log('constructor ant page');

    // carga ants en redux
    this.antService.loadItems();
  }

  ngOnInit() {

  }


  ngAfterViewInit() {
    this.page.searcherEmitter.subscribe(data => {
      const query = data.value;
      this.storeItems$.dispatch(fromAntsActions.SearchActions.searchItems({ query }));
    });

    // suscripción a los items filtrados
    this.antService.getFilteredItems().subscribe(data => {
      console.log(data);
      console.log('ants', data.ants.items);
      this.page.dataItems = data.ants.items;
    });
  }

  ngOnDestroy(): void {
    this.itemsSuscription$.unsubscribe();
  }

}
