import { Component, OnInit } from '@angular/core';
import { SidenavItem } from '../sidenav/sidenav-item/sidenav-item.model';
import * as fromRoot from '../../reducers/index';
import * as fromSidenav from '../sidenav/shared/sidenav.action';
import { Store } from '@ngrx/store';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SetCurrentlyOpenByRouteAction } from '../sidenav/shared/sidenav.action';
import { SelectLayoutAction, SetCardElevationAction } from '../layout/shared/layout.action';

@Component({
  selector: 'vr-route-handler',
  templateUrl: './route-handler.component.html',
  styleUrls: ['./route-handler.component.scss']
})
export class RouteHandlerComponent implements OnInit {

  role_id : any;
  constructor(
    private store: Store<fromRoot.State>,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    let user = JSON.parse(localStorage.getItem('user'));
    this.role_id = user.role_id;
    // Set Sidenav Currently Open on Page load
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.store.dispatch(new SetCurrentlyOpenByRouteAction(event.urlAfterRedirects));
      }
    });

    // You can use ?layout=beta to load the page with Layout Beta as default
    // Same with ?elevation=5 (anything from 0 to 24)
    this.route.queryParamMap.subscribe((params) => {
      const layout = params.get('layout');

      switch (layout) {
        case 'alpha': {
          this.store.dispatch(new SelectLayoutAction('alpha'));
          break
        }

        case 'beta': {
          this.store.dispatch(new SelectLayoutAction('beta'));
          break
        }

        case 'gamma': {
          this.store.dispatch(new SelectLayoutAction('gamma'));
          break
        }
      }

      const elevation = params.get('elevation');

      if (elevation) {
        this.store.dispatch(new SetCardElevationAction('card-elevation-z' + elevation))
      }
    });

    // Define Menu Items here

    // Top Level Item (The item to click on so the dropdown opens)
    const dashboard = new SidenavItem({
      name: 'Dashboard',
      icon: 'dashboard',
      subItems: [ ],
      route: '/dashboard',
      position: 1
    });

    const employee = new SidenavItem({
      name: 'Employees',
      icon: 'people',
      subItems: [ ],
      route: '/employee',
      position: 1
    });
 

    const settings = new SidenavItem({
      name: 'Settings',
      icon: 'settings',
      subItems: [ ],
      position: 1
    });

    const settingsSubItems = [
      new SidenavItem({
        name: 'Config Items',
        route: '/setting/config-item',
        parent: settings,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Roles',
        route: '/user/role',
        parent: settings,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Users',
        route: '/user',
        parent: settings,
        subItems: [ ],
        position: 1
      }),
      /*new SidenavItem({
        name: 'Organization Unit',
        route: '/organization',
        parent: settings,
        subItems: [ ],
        position: 1
      }),*/
      new SidenavItem({
        name: 'Banks',
        route: '/bank',
        parent: settings,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Sponsor',
        route: '/sponsor',
        parent: settings,
        subItems: [ ],
        position: 1
      }),
    ];

    settings.subItems.push(...settingsSubItems);


    const companies = new SidenavItem({
      name: 'Companies',
      icon: 'work',
      subItems: [ ],
        route: '/company/2',
      position: 1
    });

    const items = new SidenavItem({
      name: 'Items',
      icon: 'work',
      subItems: [ ],
      route: '/item',
      position: 1
    });

    const packages = new SidenavItem({
      name: 'Packages',
      icon: 'work',
      subItems: [ ],
      route: '/packages',
      position: 1
    });
    const sales = new SidenavItem({
      name: 'Sales',
      icon: 'attach_money',
      subItems: [ ],
      position: 1
    });

    const salesSubItems = [
      new SidenavItem({
        name: 'Daily Sale',
        route: '/sale/today',
        parent: sales,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Monthly Sale',
        route: '/sale/month',
        parent: sales,
        subItems: [ ],
        position: 1
      })
    ];

    sales.subItems.push(...salesSubItems);
    
    const payments = new SidenavItem({
      name: 'Account',
      icon: 'attach_money',
      subItems: [ ],
      position: 1
    });

    const paymentsSubItems = [
      new SidenavItem({
        name: 'Daily Income',
        route: '/payment/income',
        parent: payments,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Daily Expense',
        route: '/payment/expense',
        parent: payments,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Monthly Income',
        route: '/payment/income_month',
        parent: payments,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Monthly Expense',
        route: '/payment/expense_month',
        parent: payments,
        subItems: [ ],
        position: 1
      }),
    ];

    const paymentsSettings = new SidenavItem({
      name: 'Setting',
      parent: payments,
      subItems: [ ],
      position: 1
    });

    const paymentsSettingsSubItems = [
      new SidenavItem({
        name: 'Ledgers',
        route: '/ledger',
        parent: paymentsSettings,
        subItems: [ ],
        position: 1
      }),
      new SidenavItem({
        name: 'Categories',
        route: '/payment_category',
        parent: paymentsSettings,
        subItems: [ ],
        position: 1
      }),
      
    ];

    payments.subItems.push(...paymentsSubItems);
    paymentsSettings.subItems.push(...paymentsSettingsSubItems);
    payments.subItems.push(paymentsSettings);

    this.store.dispatch(new fromSidenav.AddSidenavItemAction(dashboard));
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(settings));
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(employee));
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(companies));
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(items));
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(sales));
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(payments));
  }

}
