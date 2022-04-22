import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.scss']
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList();
  activeTab: string = "";
  constructor() { }

  ngAfterContentInit(): void {
    const activeTabs = this.tabs.filter(tab => tab.active);

    if (!activeTabs || activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(selectedTab: TabComponent) {
    this.tabs.forEach(tab => { tab.active = false });
    selectedTab.active = true;

    // Easiest way for prevent deafult behavior of href elements
    return false;
  }

}
