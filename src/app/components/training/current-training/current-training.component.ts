import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { StopTrainingComponent } from './stop-training.component';
import { ExerciseService } from 'src/app/_services/exercise.service';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss']
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer: number;
  @Output() trainingExit = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private exerciseService: ExerciseService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit() {
    this.startOrResumeTimer();
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: { progress: this.progress }
    });
    dialogRef.afterClosed().subscribe(result => {
      result
        ? this.exerciseService.cancelExercise(this.progress)
        : this.startOrResumeTimer();
    });
  }

  startOrResumeTimer() {
    this.store.select(fromTraining.getActiveTraining).subscribe(ex => {
      const step = (ex.duration / 100) * 1000;
      this.timer = window.setInterval(() => {
        this.progress = this.progress + 1;
        if (this.progress >= 100) {
          this.exerciseService.completeExercise();
          clearInterval(this.timer);
        }
      }, step);
    });
  }
}
