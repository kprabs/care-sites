import { Component, OnInit } from '@angular/core';
import { ApiService, Facility } from '../services/api.service';

@Component({
  selector: 'app-tiles',
  template: `
    <div class="page">
      <h1>Care Directory</h1>
      <p class="muted">Each category displays at most one facility (if available).</p>

      <div class="grid">
        <!-- Labs -->
        <section class="card" [style.--tile-bg]="colors.labs" aria-label="Lab">
          <header><h2>Lab Details</h2><span class="badge">{{ labs.length }}</span></header>
          <ng-container *ngIf="labsLoaded; else labsLoading">
            <ng-container *ngIf="firstLab as f; else noLabs">
              <div class="single">
                <h3>{{ f.name }}</h3>
                <p>{{ f.address }}, {{ f.city }}, {{ f.state }} {{ f.zip }}</p>
                <p><a [href]="'tel:' + f.phone">{{ f.phone }}</a></p>
              </div>
            </ng-container>
            <ng-template #noLabs><p class="muted">No labs found.</p></ng-template>
          </ng-container>
          <ng-template #labsLoading><p class="muted">Loading labs…</p></ng-template>
        </section>

        <!-- PT -->
        <section class="card" [style.--tile-bg]="colors.pt" aria-label="Physical Therapy">
          <header><h2>Physical Therapy</h2><span class="badge">{{ pts.length }}</span></header>
          <ng-container *ngIf="ptsLoaded; else ptLoading">
            <ng-container *ngIf="firstPT as f; else noPT">
              <div class="single">
                <h3>{{ f.name }}</h3>
                <p>{{ f.address }}, {{ f.city }}, {{ f.state }} {{ f.zip }}</p>
                <p><a [href]="'tel:' + f.phone">{{ f.phone }}</a></p>
              </div>
            </ng-container>
            <ng-template #noPT><p class="muted">No physical therapy facilities found.</p></ng-template>
          </ng-container>
          <ng-template #ptLoading><p class="muted">Loading physical therapy…</p></ng-template>
        </section>

        <!-- Radiology -->
        <section class="card" [style.--tile-bg]="colors.rad" aria-label="Radiology">
          <header><h2>Radiology</h2><span class="badge">{{ radios.length }}</span></header>
          <ng-container *ngIf="radLoaded; else radLoading">
            <ng-container *ngIf="firstRad as f; else noRad">
              <div class="single">
                <h3>{{ f.name }}</h3>
                <p>{{ f.address }}, {{ f.city }}, {{ f.state }} {{ f.zip }}</p>
                <p><a [href]="'tel:' + f.phone">{{ f.phone }}</a></p>
              </div>
            </ng-container>
            <ng-template #noRad><p class="muted">No radiology facilities found.</p></ng-template>
          </ng-container>
          <ng-template #radLoading><p class="muted">Loading radiology…</p></ng-template>
        </section>
      </div>

      <p *ngIf="error" class="error">{{ error }}</p>
    </div>
  `,
  styles: [`
    .page{max-width:1100px;margin:2rem auto;padding:0 1rem;font-family:system-ui,Arial}
    h1{font-size:1.75rem;margin:0 0 .25rem}
    .muted{color:#6b7280;font-size:.95rem;margin:0 0 1rem}
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
    .card{background:var(--tile-bg,#fff);border-radius:1rem;box-shadow:0 8px 24px rgba(0,0,0,.08);padding:1rem}
    .card header{display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem}
    .badge{font-size:.75rem;padding:.2rem .5rem;border-radius:999px;background:rgba(255,255,255,.65);border:1px solid rgba(0,0,0,.08);color:#111827}
    .single{min-height:110px;display:grid;gap:.35rem}
    .error{color:#b91c1c;margin-top:1rem}
    @media (max-width:900px){.grid{grid-template-columns:1fr}}
  `]
})
export class TilesComponent implements OnInit {
  labs: Facility[] = [];
  pts: Facility[] = [];
  radios: Facility[] = [];
  labsLoaded = false; ptsLoaded = false; radLoaded = false;
  error: string | null = null;

  colors = { labs: '#E3F2FD', pt: '#E8F5E9', rad: '#FFF3E0' };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getLabs().subscribe({ next: d => { this.labs = d || []; this.labsLoaded = true; }, error: e => { this.error = String(e); this.labsLoaded = true; }});
    this.api.getPT().subscribe({ next: d => { this.pts = d || [];  this.ptsLoaded  = true; }, error: e => { this.error = String(e); this.ptsLoaded  = true; }});
    this.api.getRadiology().subscribe({ next: d => { this.radios = d || []; this.radLoaded = true; }, error: e => { this.error = String(e); this.radLoaded = true; }});
  }

  get firstLab(): Facility | null { return this.labs.length ? this.labs[0] : null; }
  get firstPT():  Facility | null { return this.pts.length ? this.pts[0] : null; }
  get firstRad(): Facility | null { return this.radios.length ? this.radios[0] : null; }
}
