import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuHeaderComponent } from "../../components/side-menu/side-menu-header/side-menu-header.component";
import { SideMenuOptionsComponent } from "../../components/side-menu/side-menu-options/side-menu-options.component";

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterOutlet, SideMenuHeaderComponent, SideMenuOptionsComponent],
  templateUrl: './dashboard-page.component.html'
})
export default class DashboardPageComponent { }
