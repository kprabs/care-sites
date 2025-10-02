import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Facility } from '../services/api.service';

type Category = 'labs' | 'pt' | 'rad';

@Component({
  selector: 'app-tiles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <h1>Care Directory</h1>
      <p class="muted">Use the toggles to choose slideshow (multiple) or a single facility per category.</p>

      <!-- Settings row -->
      <div class="settings">
        <div class="setting">
          <label>
            <input type="checkbox" [(ngModel)]="settings().labs.slideshow" />
            Labs: slideshow
          </label>
          <input type="color" [(ngModel)]="settings().labs.color" aria-label="Labs color" />
        </div>

        <div class="setting">
          <label>
            <input type="checkbox" [(ngModel)]="settings().pt.slideshow" />
            Physical Therapy: slideshow
          </label>
          <input type="color" [(ngModel)]="settings().pt.color" aria-label="PT color" />
        </div>

        <div class="setting">
          <label>
            <input type="checkbox" [(ngModel)]="settings().rad.slideshow" />
            Radiology: slideshow
          </label>
          <input type="color" [(ngModel)]="settings().rad.color" aria-label="Radiology color" />
        </div>
      </div>

      <div class="grid">
        <!-- Labs tile -->
        <section class="card"
                 [style.--tile-bg]="settings().labs.color"
                 (keydown)="onKey($event, 'labs')"
                 tabindex="0"
                 aria-label="Labs">
          <header>
            <h2>Lab Details</h2>
            <span class="badge">{{ labs()?.length || 0 }}</span>
          </header>

          <!-- Slideshow mode -->
          <ng-container *ngIf="settings().labs.slideshow; else labsSingle">
            <ng-container *ngIf="labs(); else labsLoading">
              <div class="slide" *ngIf="currentLab() as f">
                <h3>{{ f.name }}</h3>
                <p>{{ f.address }}, {{ f.city }}, {{ f.state }} {{ f.zip }}</p>
                <p><a [href]="'tel:' + f.phone">{{ f.phone }}</a></p>
              </div>
              <div class="controls">
                <button class="nav" (click)="prev('labs')" aria-label="Previous lab">‹</button>
                <span class="count">{{ labIndex()+1 }} / {{ labs()!.length }}</span>
                <button class="nav" (click)="next('labs')" aria-label="Next lab">›</button>
              </div>
            </ng-container>
          </ng-container>
          <!-- Single mode -->
          <ng-template #labsSingle>
            <ng-container *ngIf="labs(); else labsLoading">
              <div class="single" *ngIf="labs()![0] as f">
                <h3>{{ f.name }}</h3>
                <p>{{ f.address }}, {{ f.city }}, {{ f.state }} {{ f.zip }}</p>
                <p><a [href]="'tel:' + f.phone">{{ f.phone }}</a></p>
              </div>
            </ng-container>
          </ng-template>
          <ng-template #labsLoading><p class="muted">Loading labs…</p></ng-template>
        </section>

        <!-- PT tile -->
        <section class="card"
                 [style.--tile-bg]="settings().pt.color"
                 (keydown)="onKey($event, 'pt')"
                 tabindex="0"
                 aria-label="Physical Therapy">
          <header>
            <h2>Physical Therapy</h2>
            <span class="badge">{{ pts()?.length || 0 }}</span>
          </header>

          <ng-container *ngIf="settings().pt.slideshow; else ptSingle">
            <ng-container *ngIf="pts(); else ptLoading">
              <div class="slide" *ngIf="currentPT() as f">
                <h3>{{ f.name }}</h3>
                <p>{{ f.address }}, {{ f.city }}, {{ f.state }} {{ f.zip }}</p>
                <p><a [href]="'tel:' + f.phone">{{ f.phone }}</a></p>
              </div>
              <div class="controls">
                <button class="nav" (click)="prev('pt')" aria-label="Previous PT">‹</button>
                <span class="count">{{ ptIndex()+1 }} / {{ pts()!.length }}</span>
                <button class="nav" (click)="next('pt')" aria-label="Next PT">›</button>
              </div>
            </ng-container>
          </ng-container>
          <ng-template #ptSingle>
            <ng-container *ngIf="pts(); else ptLoading">
              <div class="single" *ngIf="pts()![0] as f">
                <h3>{{ f.name }}</h3>
                <p>{{ f.address }}, {{ f.city }}, {{ f.state }} {{ f.zip }}</p>
                <p><a [href]="'tel:' + f.phone">{{ f.phone }}</a></p>
              </div>
            </ng-container>
          </ng-template>
          <ng-template #ptLoading><p class="muted">Loading physical therapy…</p></ng-template>
        </section>

        <!-- Radiology tile -->
        <section class="card"
                 [style.--tile-bg]="settings().rad.color"
                 (keydown)="onKey($event, 'rad')"
                 tabindex="0"
                 aria-label="Radiology">
          <header>
            <h2>Radiology</h2>
            <span class="badge">{{ radios()?.length || 0 }}</span>
          </header>

          <ng-container *ngIf="settings().rad.slideshow; else radSingle">
            <ng-container *ngIf="radios(); else radioLoading">
              <div class="slide" *ngIf="currentRad() as f">
                <h3>{{ f.name }}</h3>
                <p>{{ f.address }}, {{ f.city }}, {{ f.state }} {{ f.zip }}</p>
                <p><a [href]="'tel:' + f.phone">{{ f.phone }}</a></p>
              </div>
              <div class="controls">
                <button class="nav" (click)="prev('rad')" aria-label="Previous radiology">‹</button>
                <span class="count">{{ radIndex()+1 }} / {{ radios()!.length }}</span>
                <button class="nav" (click)="next('rad')" aria-label="Next radiology">›</button>
              </div>
            </ng-container>
          </ng-container>
          <ng-template #radSingle>
            <ng-container *ngIf="radios(); else radioLoading">
              <div class="single" *ngIf="radios()![0] as f">
                <h3>{{ f.name }}</h3>
                <p>{{ f.address }}, {{ f.city }}, {{ f.state }} {{ f.zip }}</p>
                <p><a [href]="'tel:' + f.phone">{{ f.phone }}</a></p>
              </div>
            </ng-container>
          </ng-template>
          <ng-template #radioLoading><p class="muted">Loading radiology…</p></ng-template>
        </section>
      </div>

      <p *ngIf="error()" class="error">{{ error() }}</p>
    </div>
  `,
  styles: [`
    .page{max-width:1100px;margin:2rem auto;padding:0 1rem;font-family:system-ui,Arial}
    h1{font-size:1.75rem;margin:0 0 .25rem}
    .muted{color:#6b7280;font-size:.95rem;margin:0 0 1rem}
    .settings{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem}
    .setting{display:flex;align-items:center;gap:.5rem;background:#f9fafb;border:1px solid #e5e7eb;border-radius:.75rem;padding:.5rem .75rem}
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
    .card{
      background: var(--tile-bg, #ffffff);
      border-radius:1rem;
      box-shadow:0 8px 24px rgba(0,0,0,.08);
      padding:1rem;
      outline:none;
      backdrop-filter:saturate(120%) brightness(102%);
    }
    .card header{display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem}
    .badge{font-size:.75rem;padding:.2rem .5rem;border-radius:999px;background:rgba(255,255,255,.65);border:1px solid rgba(0,0,0,.08);color:#111827}
    .slide,.single{min-height:110px;display:grid;gap:.35rem}
    .controls{display:flex;align-items:center;justify-content:center;gap:.75rem;margin-top:.5rem}
    .nav{border:0;background:#11182710;border-radius:999px;padding:.25rem .6rem;font-size:1.2rem;cursor:pointer}
    .nav:hover{background:#11182718}
    .count{font-size:.9rem;color:#374151;min-width:70px;text-align:center}
    .error{color:#b91c1c;margin-top:1rem}
    @media (max-width:900px){.grid{grid-template-columns:1fr}}
  `]
})
export class TilesComponent implements OnInit {
  private api = inject(ApiService);

  // Data
  labs    = signal<Facility[] | null>(null);
  pts     = signal<Facility[] | null>(null);
  radios  = signal<Facility[] | null>(null);
  error   = signal<string | null>(null);

  // Settings: per-category slideshow + color
  settings = signal({
    labs: { slideshow: true,  color: '#E3F2FD' },  // light blue
    pt:   { slideshow: true,  color: '#E8F5E9' },  // light green
    rad:  { slideshow: true,  color: '#FFF3E0' }   // light orange
  });

  // Carousel indexes
  labIndex = signal(0);
  ptIndex  = signal(0);
  radIndex = signal(0);

  // Current items for slideshow
  currentLab = computed(() => this.pick(this.labs(), this.labIndex()));
  currentPT  = computed(() => this.pick(this.pts(), this.ptIndex()));
  currentRad = computed(() => this.pick(this.radios(), this.radIndex()));

  ngOnInit(): void {
    this.api.getLabs().subscribe({ next: d => { this.labs.set(d); this.labIndex.set(0); }, error: e => this.error.set(String(e)) });
    this.api.getPT().subscribe({ next: d => { this.pts.set(d);  this.ptIndex.set(0);  }, error: e => this.error.set(String(e)) });
    this.api.getRadiology().subscribe({ next: d => { this.radios.set(d); this.radIndex.set(0); }, error: e => this.error.set(String(e)) });
  }

  // Helpers
  pick(list: Facility[] | null, idx: number) {
    if (!list || list.length === 0) return null;
    const i = ((idx % list.length) + list.length) % list.length;
    return list[i];
  }

  next(kind: Category): void {
    if (kind === 'labs' && this.labs())   this.labIndex.update(i => (i + 1) % this.labs()!.length);
    if (kind === 'pt'   && this.pts())    this.ptIndex.update(i => (i + 1) % this.pts()!.length);
    if (kind === 'rad'  && this.radios()) this.radIndex.update(i => (i + 1) % this.radios()!.length);
  }
  prev(kind: Category): void {
    if (kind === 'labs' && this.labs())   this.labIndex.update(i => (i - 1 + this.labs()!.length) % this.labs()!.length);
    if (kind === 'pt'   && this.pts())    this.ptIndex.update(i => (i - 1 + this.pts()!.length) % this.pts()!.length);
    if (kind === 'rad'  && this.radios()) this.radIndex.update(i => (i - 1 + this.radios()!.length) % this.radios()!.length);
  }

  onKey(ev: KeyboardEvent, kind: Category) {
    if (ev.key === 'ArrowRight') { this.next(kind); ev.preventDefault(); }
    if (ev.key === 'ArrowLeft')  { this.prev(kind); ev.preventDefault(); }
  }
}
