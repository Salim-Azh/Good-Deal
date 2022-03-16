import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router,NavigationEnd  } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Good Deal';
  currentRoute!: string;

  constructor(private router: Router){

  }

}
