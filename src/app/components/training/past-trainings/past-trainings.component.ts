import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Exercise } from 'src/app/_models/exercise.model';
import { ExerciseService } from 'src/app/_services/exercise.service';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.scss']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'date',
    'name',
    'calories',
    'duration',
    'state'
  ];
  dataSource = new MatTableDataSource<Exercise>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private exerciseService: ExerciseService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit() {
    this.store
      .select(fromTraining.getFinishedTrainings)
      .subscribe((exercises: Exercise[]) => {
        this.dataSource.data = exercises;
      });
    this.exerciseService.fetchCompletedOrCancelledExercises();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
