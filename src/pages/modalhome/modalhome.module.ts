import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalhomePage } from './modalhome';

@NgModule({
  declarations: [
    ModalhomePage,
  ],
  imports: [
    IonicPageModule.forChild(ModalhomePage),
  ],
})
export class ModalhomePageModule {}
