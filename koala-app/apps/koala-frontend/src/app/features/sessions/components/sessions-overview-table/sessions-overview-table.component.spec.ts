import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';

import { SessionsOverviewTableComponent } from './sessions-overview-table.component';

describe('Sessions Overview Table Component', () => {
  let component: SessionsOverviewTableComponent;
  let fixture: ComponentFixture<SessionsOverviewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionsOverviewTableComponent],
      imports: [MatTableModule, MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionsOverviewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the given sessions', (done) => {
    const pipe = new DatePipe('en-US');
    const sessionMockData = [
      {
        id: 1,
        name: 'Session 1',
        createdDate: new Date(),
        updatedDate: new Date(),
      },
      {
        id: 2,
        name: 'Session 2',
        createdDate: new Date(),
        updatedDate: new Date(),
      },
    ];

    component.sessions = sessionMockData;
    fixture.detectChanges();

    const tableRows = fixture.debugElement.queryAll(By.css('tr'));

    expect(tableRows).toBeDefined();
    expect(tableRows.length).toBe(3);

    // Header row
    const headerRow = tableRows[0];
    expect(headerRow.nativeElement.cells[0].innerHTML).toBe('Name');
    expect(headerRow.nativeElement.cells[1].innerHTML).toBe('Erstellungsdatum');
    expect(headerRow.nativeElement.cells[2].innerHTML).toBe('Änderungsdatum');

    // Data rows
    const row1 = tableRows[1];
    expect(row1.nativeElement.cells[0].innerHTML).toBe(sessionMockData[0].name);
    expect(row1.nativeElement.cells[1].innerHTML.trim()).toBe(
      pipe.transform(sessionMockData[0].createdDate, 'medium')
    );
    expect(row1.nativeElement.cells[2].innerHTML.trim()).toBe(
      pipe.transform(sessionMockData[0].updatedDate, 'medium')
    );

    const row2 = tableRows[2];
    expect(row2.nativeElement.cells[0].innerHTML).toBe(sessionMockData[1].name);
    expect(row2.nativeElement.cells[1].innerHTML.trim()).toBe(
      pipe.transform(sessionMockData[1].createdDate, 'medium')
    );
    expect(row2.nativeElement.cells[2].innerHTML.trim()).toBe(
      pipe.transform(sessionMockData[1].updatedDate, 'medium')
    );

    done();
  });
});
