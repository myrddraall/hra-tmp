import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CRS, imageOverlay, LatLngBounds, Layer, Map, marker } from 'leaflet';
import ResizeObserver from 'resize-observer-polyfill';

export interface IMap {
  width: number;
  height: number;
  image: string;

}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, AfterContentInit, OnChanges {


  @ViewChild('mapContainer', { static: true })
  private mapContainer: ElementRef<HTMLElement>;
  private mapComponent: Map;
  private mapBaseLayer: Layer;


  @Input()
  public mapDef: IMap = {
    width: 290,
    height: 216,
    image: 'https://static.heroesofthestorm.com/images/battlegrounds/maps/braxis-holdout/map-full-1c496e0a69.jpg'
  };

  constructor(elmRef: ElementRef<HTMLElement>) {
    const resizeObserver = new ResizeObserver(entries => {
      this.onResize(entries[0].contentRect as any);
    })
    resizeObserver.observe(elmRef.nativeElement);

  }


  public onResize(rect: DOMRectReadOnly) {
    
    if (this.mapContainer) {

      const m = this.mapDef;


     /* const xFactor = rect.width / m.width;
      const yFactor = rect.height / m.height;
      const factor = Math.min(xFactor, yFactor);

      this.mapContainer.nativeElement.style.width = `100%`;
      this.mapContainer.nativeElement.style.height = `100%`;*/

      if(this.mapComponent){
        this.mapComponent.setMinZoom(0).invalidateSize();
        setTimeout(()=>{
          var wantedZoom = this.mapComponent.getBoundsZoom(new LatLngBounds([0, 0], [m.height, m.width]), false);
          this.mapComponent.setMinZoom(wantedZoom);
        });
      }
    }
  }

  ngAfterViewInit(): void {
    
    this.createMap();
  }

  ngAfterContentInit() {
  
  }
  ngOnChanges(changes: SimpleChanges): void {

  }

  private createMap() {
    const m: IMap = {
      width: 290,
      height: 216,
      image: 'https://static.heroesofthestorm.com/images/battlegrounds/maps/braxis-holdout/map-full-1c496e0a69.jpg'
    }

    const mapElement = this.mapContainer.nativeElement.appendChild(document.createElement('div'))
    const map: Map = new Map(mapElement, {
      crs: CRS.Simple,
      zoomSnap: 0,
      bounceAtZoomLimits: false,
      maxBoundsViscosity: 0.95,
      attributionControl: false,
      zoomControl: false
    });

    marker([0, 0]).addTo(map);
    const xOffset = m.width / 2;
    var bounds = new LatLngBounds([0, 0], [m.height, m.width]);
    this.mapBaseLayer = imageOverlay(m.image, bounds).addTo(map);
    //this.mapBaseLayer.
    var wantedZoom = map.getBoundsZoom(bounds, false);
    //map.fitWorld();
    map.setView([m.height / 2, m.width / 2], wantedZoom);

    // var center = bounds.getCenter();
    map.setMinZoom(wantedZoom);
    setInterval(() => {
      // map.panTo([0,0]);
    }, 500)

    map.setMaxBounds(bounds);

    //map.setZoom(wantedZoom)
    //  console.log(wantedZoom, map.getZoom())

    //map.setMaxBounds(new LatLngBounds([0, 0], [m.height, m.width]));
    // map.fitBounds(new LatLngBounds([m.height, m.width], [0,0]));
    //map.fitBounds(new LatLngBounds([m.height, m.width], [0,0]));
    //map.fitWorld()
    //map.setMaxBounds(layer.getBounds());
    //const grp = featureGroup([layer]);
    //map.fitBounds(layer.getBounds());
    // map.se
    //map.fitWorld();
    /*
    map.setZoom(1);
    map.
    map.setMinZoom( map.getBoundsZoom([[-180,85],[180,85]], true) );
    */
    this.mapComponent = map;
  }

}
