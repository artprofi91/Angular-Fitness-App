import { Exercise } from '../_models/exercise.model';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { UIService } from '../_shared/ui.service';
import * as fromTraining from '../components/training/training.reducer';
import * as Training from '../components/training/training.actions';

@Injectable()
export class ExerciseService {
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises() {
    return this.fbSubs.push(
      this.db
        .collection('exercises')
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return docArray.map(doc => {
              return {
                id: doc.payload.doc.id,
                // tslint:disable-next-line: no-string-literal
                name: doc.payload.doc.data()['name'],
                // tslint:disable-next-line: no-string-literal
                duration: doc.payload.doc.data()['duration'],
                // tslint:disable-next-line: no-string-literal
                calories: doc.payload.doc.data()['calories']
              };
            });
          })
        )
        .subscribe(
          (exercises: Exercise[]) => {
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
          },
          error => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(
              'Fetching Exercises failed, please try again later',
              null,
              3000
            );
          }
        )
    );
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe(ex => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: 'completed'
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe(ex => {
        this.addDataToDatabase({
          ...ex,
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled'
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        })
    );
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
