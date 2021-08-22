import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonModule, FormModule } from '@fundamental-ngx/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { routes } from 'src/app/app-routing.module';
import { Lesson } from 'src/app/models/lesson.model.';
import { frontend } from 'src/app/resource.identifiers';
import { lessonTestData } from 'test/lesson.testdata.spec';
import * as fromReducer from '../state/lesson.reducer';
import { AddLessonComponent } from './add-lesson.component';

describe('AddLessonComponent', () => {
    const testLessonList: Lesson[] = lessonTestData;

    let router: Router;

    let mockStore: MockStore<fromReducer.State>;

    const loadedState = {
        lesson: {
            lessons: testLessonList,
            error: ''
        }
    } as fromReducer.State;

    let component: AddLessonComponent;
    let fixture: ComponentFixture<AddLessonComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AddLessonComponent],
            imports: [
                ReactiveFormsModule,
                RouterTestingModule.withRoutes(routes),
                ButtonModule,
                FormModule
            ],
            providers: [
                provideMockStore({ initialState: loadedState }),
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        router = TestBed.inject(Router);
        mockStore = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(AddLessonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('component', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });
    });

    describe('should render UI elements', () => {
        it('should have the required labels', () => {
            const expectedLabels = ['Title', 'Learned language', 'Known language'];
            const appElement: HTMLElement = fixture.nativeElement;
            const labels: NodeListOf<HTMLLabelElement> = appElement.querySelectorAll('label');
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

        it('should have empty input fields', () => {
            const inputTitle: any = fixture.debugElement.query(By.css('#add-lesson-title')).nativeElement;
            expect(inputTitle.value).toBe('', 'Lesson title missing');
            const inputLanguageA: any = fixture.debugElement.query(By.css('#add-lesson-language_a')).nativeElement;
            expect(inputLanguageA.value).toBe('', 'Lesson languaga A missing');
            const inputLanguageB: any = fixture.debugElement.query(By.css('#add-lesson-language_b')).nativeElement;
            expect(inputLanguageB.value).toBe('', 'Lesson language B missing');
        });
    });

    describe('should have required actions', () => {
        it('should have button "Create"', () => {
            const button: HTMLButtonElement = fixture.nativeElement.querySelector('#add-lesson-createButton');
            expect(button.textContent).toContain('Create');
        });

        it('should have button "Cancel"', () => {
            const button: HTMLButtonElement = fixture.nativeElement.querySelector('#add-lesson-cancelButton');
            expect(button.textContent).toContain('Cancel');
        });
    });

    describe('should route correctly on actions', () => {
        it('should navigate to list-lessons component when clicking "Create"', () => {
            spyOn(router, 'navigateByUrl').and.stub();

            component.submitForm();
            expect(router.navigateByUrl).toHaveBeenCalledWith(`/${frontend.lessons}`);
        });

        it('should navigate to list-lessons component when clicking "Cancel"', () => {
            spyOn(router, 'navigateByUrl').and.stub();

            component.cancel();
            expect(router.navigateByUrl).toHaveBeenCalledWith(`/${frontend.lessons}`);
        });
    });
});
