import { Component, OnInit } from '@angular/core';
import { ExerciseService } from 'src/app/_services/exercise.service';
import { Exercise } from 'src/app/_models/exercise.model';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {
  exercises$: Observable<Exercise[]>;
  constructor(
    private exerciseService: ExerciseService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit() {
    this.exercises$ = this.store.select(fromTraining.getAvailableTrainings);
    this.exerciseService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.exerciseService.startExercise(form.value.exercise);
  }
}
