import { Component, AfterViewInit, ElementRef, OnDestroy, Input, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ElementResizeObserver, Size } from '@ngui/responsive'
import { Unsubscribable } from 'rxjs';
import { IMap } from './IMap';
import { CRS, imageOverlay, LatLngBounds, Layer, Map, marker, DomUtil } from 'leaflet';

@Component({
  selector: 'hra-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private _resizeSub: Unsubscribable;
  @ViewChild('mapContainer', { static: true })
  private mapContainer: ElementRef<HTMLElement>;
  private mapComponent: Map;
  private mapBaseLayer: Layer;

  @ViewChildren('layer', { read: ElementRef })
  private viewLayers: QueryList<ElementRef<HTMLElement>>;


  @Input()
  public map: IMap;

  constructor(elmRef: ElementRef<HTMLElement>) {
    this._resizeSub = new ElementResizeObserver(elmRef.nativeElement).subscribe(_ => { this.onResize(_) });
  }

  ngAfterViewInit(): void {
    this.createMap();
    this.viewLayers.changes.subscribe(() => {
      if (this.mapComponent) {
        this.viewLayers.forEach(_ => {
         // console.log(_);
        });
      }
    })
  }

  ngOnDestroy() {
    this._resizeSub.unsubscribe();
  }

  private onResize(size: Size) {

    if (this.mapContainer) {
      const m = this.map;
      if (this.mapComponent) {

        this.mapComponent.setMinZoom(0).invalidateSize();
        setTimeout(() => {
          var wantedZoom = this.mapComponent.getBoundsZoom(new LatLngBounds([0, 0], [m.height, m.width]), false);
          this.mapComponent.setMinZoom(wantedZoom);
          this.mapComponent.setZoom(wantedZoom);
        }, 50);

      }
    }
  }

  private createMap() {
    const m = this.map;
    const mapElement = this.mapContainer.nativeElement.appendChild(document.createElement('div'));
    const map: Map = new Map(mapElement, {
      crs: CRS.Simple,
      zoomSnap: 0,
      bounceAtZoomLimits: false,
      maxBoundsViscosity: 0.95,
      attributionControl: false,
      zoomControl: false
    });
    const xOffset = m.width / 2;
    var bounds = new LatLngBounds([0, 0], [m.height, m.width]);
    this.mapBaseLayer = imageOverlay('', bounds, { className: 'map-background-layer' }).addTo(map);
    //map.addLayer(this.createLayer());


    this.viewLayers.forEach(ref => {
      map.addLayer(this.createLayer(ref.nativeElement));
    });

    var wantedZoom = map.getBoundsZoom(bounds, false);
    //map.fitWorld();
    map.setView([m.height / 2, m.width / 2], wantedZoom);
    map.setMinZoom(wantedZoom);
    map.setMaxBounds(bounds);
    this.mapComponent = map;
  }

  private createLayer(elm: HTMLElement) {
    const mapBaseLayer = this.mapBaseLayer;
    class CustomLayer extends Layer {
      protected options: any;
      private _container: any;
      public onAdd(map: Map): this {
        var pane = map.getPane(this.options.pane);
        this._container = elm;//DomUtil.create('div');
        pane.appendChild(this._container);
        this.update();
        map.on('zoomend viewreset', this.update, this);
        return this;
      }

      public onRemove(map: Map): this {
        DomUtil.remove(this._container);
        map.off('zoomend viewreset', this.update, this);
        return this;
      }

      private update() {
        const map = this._map;
        const b = (mapBaseLayer as any).getBounds() as LatLngBounds;

       
        //DomUtil.setPosition()
        const sPoint = map.latLngToLayerPoint(b.getNorthWest());
        const ePoint = map.latLngToLayerPoint(b.getSouthEast());
        DomUtil.setPosition(this._container, sPoint);

        this._container.style.width = (ePoint.x - sPoint.x) + 'px';
        this._container.style.height = (ePoint.y - sPoint.y) + 'px';
      }
    }
    /*const customLayer = Layer.extend({
      onAdd: function (this: Layer & { [key: string]: any }, map: Map) {
        this.map = map;
        var pane = map.getPane(this.options.pane);
        this._container = DomUtil.create('div');

        pane.appendChild(this._container);
        this._update();
        map.on('zoomend viewreset', this._update, this);

        // DomUtil.setPosition(this._container, map.ge;

      },
      onRemove: function (this: Layer & { [key: string]: any }, map: Map) {
        DomUtil.remove(this._container);
        map.off('zoomend viewreset', this._update, this);
      },
      _update: function (this: ) {
        const map = this.map;
        const b = (mapBaseLayer as any).getBounds() as LatLngBounds;

       
        //DomUtil.setPosition()
        const sPoint = map.latLngToLayerPoint(b.getNorthWest());
        const ePoint = map.latLngToLayerPoint(b.getSouthEast());
        DomUtil.setPosition(this._container, sPoint);

        this._container.style.width = (ePoint.x - sPoint.x) + 'px';
        this._container.style.height = (ePoint.y - sPoint.y) + 'px';
      }
    });*/
    return new CustomLayer();
  }

}
