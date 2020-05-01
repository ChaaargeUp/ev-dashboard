import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { CellContentTemplateComponent } from 'app/shared/table/cell-content-template/cell-content-template.component';
import { ChipType } from 'app/types/GlobalType';
import { OcpiEndpointDetail } from 'app/types/OCPIEndpoint';

@Component({
  template: `
    <mat-chip-list [selectable]="false">
      <mat-chip [ngClass]="row.totalNbr | appFormatOcpiEvsesTotal:'class'" [disabled]="true">
        {{row.totalNbr | appFormatOcpiEvsesTotal:'text'}}
      </mat-chip>
    </mat-chip-list>
  `,
})
export class OcpiDetailTotalEvsesStatusFormatterComponent extends CellContentTemplateComponent {
  @Input() public row!: OcpiEndpointDetail;
}

@Pipe({name: 'appFormatOcpiEvsesTotal'})
export class AppFormatOcpiEvsesTotalPipe implements PipeTransform {
  public transform(totalNbr: number, type: string): string {
    if (type === 'class') {
      let classNames = 'chip-width-4em ';
      if (totalNbr > 0) {
        classNames += ChipType.INFO;
      } else {
        classNames += ChipType.GREY;
      }
      return classNames;
    }
    if (type === 'text') {
      return (totalNbr > 0 ? totalNbr.toString() : '-');
    }
    return '';
  }
}
