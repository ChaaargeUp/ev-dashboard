import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';

import { BaseFilterDef, FilterHttpIDs, FilterIDs } from '../../../../types/Filters';
import { ChargingStationsDialogComponent } from '../../../dialogs/charging-stations/charging-stations-dialog.component';
import { BaseFilter } from '../../base-filter.component';
import { FiltersService } from '../../filters.service';
import { DialogFilterComponent } from '../dialog.component';

@Component({
  selector: 'app-charging-station-filter',
  template: '<app-dialog-filter (dataChanged)="updateService($event)"></app-dialog-filter>'
})
export class ChargingStationFilterComponent extends BaseFilter implements AfterViewInit{

  @ViewChild(DialogFilterComponent) dialogFilter!: DialogFilterComponent;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private filtersService: FiltersService,
  ) {
    super();
    this.baseDetails = {
      id: FilterIDs.CHARGING_STATION,
      httpId: FilterHttpIDs.CHARGING_STATION,
      currentValue: [],
    }
    this.filtersService.setFilterValue(this.baseDetails);
  }

  public updateService(newData: BaseFilterDef){
    this.filtersService.setFilterValue(newData);
  }

  private initFilter() {
    this.dialogFilter.setFilter({
      ...this.baseDetails,
      name: 'chargers.title',
      label: '',
      cssClass: '',
      dialogComponent: ChargingStationsDialogComponent,
      defaultValue: [],
      dependentFilters: [
        FilterHttpIDs.ISSUER,
        FilterHttpIDs.SITE,
        FilterHttpIDs.SITE_AREA
      ]
    })
  }

  ngAfterViewInit(): void {
    this.initFilter();
    this.changeDetectorRef.detectChanges();
  }

}
