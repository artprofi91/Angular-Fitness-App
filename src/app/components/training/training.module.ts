import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { StoreModule } from '@ngrx/store';

import { TrainingComponent } from '../training/training.component';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingsComponent } from './past-trainings/past-trainings.component';
import { trainingReducer } from './training.reducer';

@NgModule({
  declarations: [
    TrainingComponent,
    CurrentTrainingComponent,
    NewTrainingComponent,
    PastTrainingsComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    StoreModule.forFeature('training', trainingReducer)
  ],
  exports: []
})
export class TrainingModule {}
