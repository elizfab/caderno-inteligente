import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { Icon } from '../icon/icon';

const ROOT_ROUTES = new Set(['/dashboard']);

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [ButtonModule, Icon],
  templateUrl: './back-button.html',
  styleUrl: './back-button.scss',
})
export class BackButtonComponent implements OnInit, OnDestroy {
  private readonly currentUrl = signal('');
  private sub = new Subscription();

  readonly visible = computed(() => {
    const url = this.currentUrl().split('?')[0];
    return !ROOT_ROUTES.has(url);
  });

  constructor(
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUrl.set(this.router.url);

    this.sub.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe((e) => this.currentUrl.set(e.urlAfterRedirects)),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  goBack(): void {
    const url = this.currentUrl().split('?')[0];
    const segments = url.split('/').filter(Boolean);

    if (segments.length > 1) {
      // Navigate to parent route
      const parent = '/' + segments.slice(0, -1).join('/');
      this.router.navigateByUrl(parent);
    } else {
      this.location.back();
    }
  }
}
