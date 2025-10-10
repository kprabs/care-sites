import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Facility } from '../services/api.service';

@Component({
  selector: 'app-tiles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>Care Directory</h1>
      <p class="muted">Browse each category with the arrows or keyboard ← →</p>

      <div class="grid">
        <!-- Labs -->
        <section class="card" (keydown)="onKey($event, 'labs')" tabindex="0" aria-label="Lab details carousel">
          <header>
            <h2>Lab Details</h2>
            <span class="badge">{{ labs()?.length || 0 }}</span>
          </header>

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
          <ng-template #labsLoading><p class="muted">Loading labs…</p></ng-template>
        </section>

        <!-- Physical Therapy -->
        <section class="card" (keydown)="onKey($event, 'pt')" tabindex="0" aria-label="Physical therapy carousel">
          <header>
            <h2>Physical Therapy</h2>
            <span class="badge">{{ pts()?.length || 0 }}</span>
          </header>

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
          <ng-template #ptLoading><p class="muted">Loading physical therapy…</p></ng-template>
        </section>

        <!-- Radiology -->
        <section class="card" (keydown)="onKey($event, 'rad')" tabindex="0" aria-label="Radiology carousel">
          <header>
            <h2>Radiology</h2>
            <span class="badge">{{ radios()?.length || 0 }}</span>
          </header>

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
          <ng-template #radioLoading><p class="muted">Loading radiology…</p></ng-template>
        </section>
      </div>
      <p *ngIf="error()" class="error">{{ error() }}</p>
    </div>
  `,
  styles: [`
    .page{max-width:1100px;margin:2rem auto;padding:0 1rem;font-family:system-ui,Arial}
    h1{font-size:1.75rem;margin:0 0 .25rem}
    .muted{color:#6b7280;font-size:.95rem;margin-bottom:1rem}
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
    .card{background:#fff;border-radius:1rem;box-shadow:0 8px 24px rgba(0,0,0,.08);padding:1rem;outline:none}
    .card:focus{box-shadow:0 0 0 3px #c7d2fe, 0 8px 24px rgba(0,0,0,.08)}
    .card header{display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem}
    .badge{font-size:.75rem;padding:.2rem .5rem;border-radius:999px;background:#eef2ff;color:#4338ca}
    .slide{min-height:100px;display:grid;gap:.35rem}
    .controls{display:flex;align-items:center;justify-content:center;gap:.75rem;margin-top:.5rem}
    .nav{border:0;background:#f3f4f6;border-radius:999px;padding:.25rem .6rem;font-size:1.2rem;cursor:pointer}
    .nav:hover{background:#e5e7eb}
    .count{font-size:.9rem;color:#4b5563;min-width:70px;text-align:center}
    .error{color:#b91c1c;margin-top:1rem}
    @media (max-width:900px){.grid{grid-template-columns:1fr}}
  `]
})
export class TilesComponent implements OnInit {
  private api = inject(ApiService);

  labs = signal<Facility[] | null>(null);
  pts = signal<Facility[] | null>(null);
  radios = signal<Facility[] | null>(null);
  error = signal<string | null>(null);

  // per-category carousel indexes
  labIndex = signal(0);
  ptIndex = signal(0);
  radIndex = signal(0);

  // currently visible item per category
  currentLab = computed(() => {
    const a = this.labs(); if (!a || !a.length) return null;
    return a[this.labIndex() % a.length];
  });
  currentPT = computed(() => {
    const a = this.pts(); if (!a || !a.length) return null;
    return a[this.ptIndex() % a.length];
  });
  currentRad = computed(() => {
    const a = this.radios(); if (!a || !a.length) return null;
    return a[this.radIndex() % a.length];
  });

  ngOnInit(): void {
    this.api.getLabs().subscribe({ next: d => { this.labs.set(d); this.labIndex.set(0); }, error: e => this.error.set(String(e)) });
    this.api.getPT().subscribe({ next: d => { this.pts.set(d); this.ptIndex.set(0); }, error: e => this.error.set(String(e)) });
    this.api.getRadiology().subscribe({ next: d => { this.radios.set(d); this.radIndex.set(0); }, error: e => this.error.set(String(e)) });
  }

  next(kind: 'labs'|'pt'|'rad'): void {
    if (kind === 'labs' && this.labs()) this.labIndex.update(i => (i + 1) % this.labs()!.length);
    if (kind === 'pt'   && this.pts())  this.ptIndex.update(i => (i + 1) % this.pts()!.length);
    if (kind === 'rad'  && this.radios()) this.radIndex.update(i => (i + 1) % this.radios()!.length);
  }
  prev(kind: 'labs'|'pt'|'rad'): void {
    if (kind === 'labs' && this.labs()) this.labIndex.update(i => (i - 1 + this.labs()!.length) % this.labs()!.length);
    if (kind === 'pt'   && this.pts())  this.ptIndex.update(i => (i - 1 + this.pts()!.length) % this.pts()!.length);
    if (kind === 'rad'  && this.radios()) this.radIndex.update(i => (i - 1 + this.radios()!.length) % this.radios()!.length);
  }

  // keyboard support: left/right arrows when the card is focused
  onKey(ev: KeyboardEvent, kind: 'labs'|'pt'|'rad') {
    if (ev.key === 'ArrowRight') { this.next(kind); ev.preventDefault(); }
    if (ev.key === 'ArrowLeft')  { this.prev(kind); ev.preventDefault(); }
  }
}
