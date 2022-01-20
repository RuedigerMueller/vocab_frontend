import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonModule, FormModule } from '@fundamental-ngx/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { routes } from 'src/app/app-routing.module';
import { Lesson } from 'src/app/models/lesson.model';
import { frontend } from 'src/app/resource.identifiers';
import { lessonTestData } from 'test/lesson.testdata.spec';
import * as fromReducer from '../state/lesson.reducer';
import { EditLessonComponent } from './edit-lesson.component';

describe('EditLessonComponent', () => {
    const testLessonList: Lesson[] = lessonTestData;
    const testEditLesson: Lesson = testLessonList[0];

    let router: Router;

    let mockStore: MockStore<fromReducer.State>;
    const loadedState = {
        lesson: {
            lessons: testLessonList,
            error: ''
        }
    } as fromReducer.State;

    let component: EditLessonComponent;
    let fixture: ComponentFixture<EditLessonComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [EditLessonComponent],
            imports: [
                ReactiveFormsModule,
                RouterTestingModule.withRoutes(routes),
                ButtonModule,
                FormModule
            ],
            providers: [
                provideMockStore({ initialState: loadedState }),
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (id: number) => testEditLesson.id } } } },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        router = TestBed.inject(Router);
        mockStore = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(EditLessonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('component', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });


        it('should contain lesson data after loading', () => {
            const expected = cold('a', { a: testEditLesson });
            expect(component.lesson$).toBeObservable(expected);
        });
    });

    describe('should render UI elements', () => {
        it('should have the required labels', () => {
            const expectedLabels: ReadonlyArray<string> = ['Title', 'Learned language', 'Known language'];
            const labels: NodeListOf<HTMLLabelElement> = fixture.nativeElement.querySelectorAll('label');
            let success = true;
            for (const expectedLabel of expectedLabels) {
                let found = false;
                labels.forEach((label) => {
                    if (label.textContent === expectedLabel) {
                        found = true;
                    }
                });

                if (found === false) {
                    success = false;
                    expect(found).toBeTruthy(`Label ${expectedLabel} not found`);
                }
            }
            expect(success).toBeTruthy('All expected labels rendered');
        });

        it('should have input field filled', () => {
            const inputTitle: any = fixture.debugElement.query(By.css('#edit-lesson-title')).nativeElement;
            expect(inputTitle.value).toBe(testEditLesson.title, 'Lesson title missing');
            const inputLanguageA: any = fixture.debugElement.query(By.css('#edit-lesson-language_a')).nativeElement;
            expect(inputLanguageA.value).toContain(testEditLesson.language_a, 'Lesson languaga A missing');
            const inputLanguageB: any = fixture.debugElement.query(By.css('#edit-lesson-language_b')).nativeElement;
            expect(inputLanguageB.value).toContain(testEditLesson.language_b, 'Lesson language B missing');
        });
    });

    describe('should have required actions', () => {
        it('should have button "Save"', () => {
            const button: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-lesson-saveButton');
            expect(button.textContent).toContain('Save');
        });

        it('should have button "Cancel"', () => {
            const button: HTMLButtonElement = fixture.nativeElement.querySelector('#edit-lesson-cancelButton');
            expect(button.textContent).toContain('Cancel');
        });
    });

    describe('should route correctly on actions', () => {
        it('should navigate to list-lessons component when clicking "Save"', () => {
            spyOn(router, 'navigateByUrl').and.stub();

            component.editLessonForm.markAsDirty();
            component.editLessonForm.markAsTouched();
            component.submitForm(testEditLesson);

            expect(router.navigateByUrl).toHaveBeenCalledWith(`/${frontend.lessons}`);
        });

        it('should navigate to list-lessons component when clicking "Cancel"', () => {
            spyOn(router, 'navigateByUrl').and.stub();

            component.cancel();

            expect(router.navigateByUrl).toHaveBeenCalledWith(`/${frontend.lessons}`);
        });
    });

    describe('should support keyboard navigation', () => {
        it('lesson title should have autofocus', () => {
            const inputElement: any = fixture.debugElement.query(By.css('#edit-lesson-title')).nativeElement;
            expect(inputElement.autofocus).toBeTrue();
        });

        it('should only have one autofocus element', () => {
            const items: ReadonlyArray<HTMLElement> = fixture.nativeElement.getElementsByTagName('*');
            let counter = 0;
            for (let i = items.length; i--;) {
                if (items[i].autofocus === true) { counter++; }
            }
            expect(counter).toEqual(1);
        });
    });
});
