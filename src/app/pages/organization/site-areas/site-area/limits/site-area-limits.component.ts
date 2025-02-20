import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ComponentService } from 'services/component.service';
import { TenantComponents } from 'types/Tenant';

import { SiteArea } from '../../../../../types/SiteArea';

@Component({
  selector: 'app-site-area-limits',
  templateUrl: 'site-area-limits.component.html',
})
export class SiteAreaLimitsComponent implements OnInit, OnChanges {
  @Input() public siteArea!: SiteArea;
  @Input() public formGroup!: UntypedFormGroup;
  @Input() public readOnly: boolean;

  public public = false;
  public isSmartChargingComponentActive = false;
  public initialized = false;

  public maximumPower!: AbstractControl;
  public maximumTotalPowerAmps!: AbstractControl;
  public maximumPowerAmpsPerPhase!: AbstractControl;
  public voltage!: AbstractControl;
  public smartCharging!: AbstractControl;
  public numberOfPhases!: AbstractControl;

  public phaseMap = [
    { key: 1, description: 'site_areas.single_phased' },
    { key: 3, description: 'site_areas.three_phased' },
  ];

  public constructor(
    private componentService: ComponentService) {
    this.isSmartChargingComponentActive = this.componentService.isActive(TenantComponents.SMART_CHARGING);
  }

  public ngOnInit() {
    // Init the form
    this.formGroup.addControl('smartCharging', new UntypedFormControl(false));
    this.formGroup.addControl('maximumPower', new UntypedFormControl(0,
      Validators.compose([
        Validators.pattern(/^[+-]?([0-9]*[.])?[0-9]+$/),
        Validators.required,
      ])
    ));
    this.formGroup.addControl('maximumTotalPowerAmps', new UntypedFormControl(0));
    this.formGroup.addControl('maximumPowerAmpsPerPhase', new UntypedFormControl(0));
    this.formGroup.addControl('voltage', new UntypedFormControl(230,
      Validators.compose([
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[+]?[0-9]*$'),
      ])
    ));
    this.formGroup.addControl('numberOfPhases', new UntypedFormControl(3,
      Validators.compose([
        Validators.required,
      ])
    ));
    // Form
    this.smartCharging = this.formGroup.controls['smartCharging'];
    this.maximumPower = this.formGroup.controls['maximumPower'];
    this.maximumTotalPowerAmps = this.formGroup.controls['maximumTotalPowerAmps'];
    this.maximumPowerAmpsPerPhase = this.formGroup.controls['maximumPowerAmpsPerPhase'];
    this.voltage = this.formGroup.controls['voltage'];
    this.numberOfPhases = this.formGroup.controls['numberOfPhases'];
    this.maximumPowerAmpsPerPhase.disable();
    this.maximumTotalPowerAmps.disable();
    this.initialized = true;
    this.loadSiteArea();
  }

  public ngOnChanges() {
    this.loadSiteArea();
  }

  public loadSiteArea() {
    if (this.initialized && this.siteArea) {
      if (this.siteArea.maximumPower) {
        this.maximumPower.setValue(this.siteArea.maximumPower);
      }
      if (this.siteArea.numberOfPhases) {
        this.numberOfPhases.setValue(this.siteArea.numberOfPhases);
      }
      if (this.siteArea.voltage) {
        this.voltage.setValue(this.siteArea.voltage);
      }
      if (this.siteArea.smartCharging) {
        this.smartCharging.setValue(this.siteArea.smartCharging);
      } else {
        this.smartCharging.setValue(false);
      }
      this.refreshMaximumAmps();
    }
  }

  public voltageChanged() {
    this.maximumPowerChanged();
  }

  public numberOfPhasesChanged() {
    this.maximumPowerChanged();
  }

  public refreshMaximumAmps() {
    this.maximumPowerChanged();
  }

  public maximumPowerChanged() {
    if (!this.maximumPower.errors && this.voltage.value) {
      if (this.numberOfPhases.value) {
        this.maximumPowerAmpsPerPhase.setValue(
          Math.floor((this.maximumPower.value as number) / (this.voltage.value as number) / (this.numberOfPhases.value)));
      } else {
        this.maximumPowerAmpsPerPhase.setValue(0);
      }
      this.maximumTotalPowerAmps.setValue(
        Math.floor((this.maximumPower.value as number) / (this.voltage.value as number)));
    } else {
      this.maximumPowerAmpsPerPhase.setValue(0);
      this.maximumTotalPowerAmps.setValue(0);
    }
  }
}
