import {
  Component,
  OnInit,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  Input,
  SimpleChanges,
} from '@angular/core';
import classnames from 'unique-classnames';

import { Client } from 'urtc-sdk';
import { Stream, AudioStats, VideoStats, NetworkStats } from 'urtc-sdk/types';

interface Stats {
  audioLost: number;
  biggestAudioLost: number;
  videoLost: number;
  biggestVideoLost: number;
  rtt: number;
  biggestRTT: number;
}

@Component({
  selector: 'stream-info',
  templateUrl: './index.html',
})
export class StreamInfoComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() className: string;
  @Input() stream: Stream;
  @Input() client: Client;

  private classes: string;
  private volume = 0;
  private stats: Stats = {
    audioLost: 0,
    biggestAudioLost: 0,
    videoLost: 0,
    biggestVideoLost: 0,
    rtt: 0,
    biggestRTT: 0,
  };

  private volumeTimer: number;
  private stateTimer: number;

  private isComponentDestroyed: boolean;

  constructor() {
    this.volumeTimer = 0;
    this.stateTimer = 0;
  }

  ngOnInit() {
    this.classes = classnames('stream-info', this.className);
    this.isComponentDestroyed = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    const { stream } = changes;

    const currentValue: Stream = stream.currentValue;
    const previousValue: Stream = stream.previousValue;
    if (stream.firstChange && currentValue.mediaStream) {
      this.start();
      return;
    }
    if (!currentValue.mediaStream) {
      this.stop();
    } else if (currentValue.mediaStream !== previousValue.mediaStream) {
      this.start();
    }
  }

  ngAfterViewInit() {
    if (this.stream && this.stream.mediaStream) {
      this.start();
    }
  }

  ngOnDestroy() {
    this.stop();
    this.isComponentDestroyed = true;
  }

  start() {
    this.startGetVolume();
    this.startGetState();
  }
  stop() {
    this.stopGetVolume();
    this.stopGetState();
  }

  startGetVolume() {
    const { client, stream } = this;
    if (!client || !stream || !stream.audio) {
      return;
    }
    if (this.volumeTimer) {
      window.clearInterval(this.volumeTimer);
    }
    this.volumeTimer = window.setInterval(() => {
      this.volume = client.getAudioVolume(stream.sid);
    }, 1000);
  }
  stopGetVolume() {
    window.clearInterval(this.volumeTimer);
  }
  startGetState() {
    const { client, stream } = this;
    if (!client || !stream || !stream.video) {
      return;
    }
    if (this.stateTimer) {
      window.clearInterval(this.stateTimer);
    }
    this.stateTimer = window.setInterval(() => {
      client.getAudioStats(stream.sid, (pstats: AudioStats) => {
        // if (this.isComponentDestroyed) return;
        const { stats } = this;
        stats.audioLost = pstats.lostpre;
        if (stats.biggestAudioLost < pstats.lostpre) {
          stats.biggestAudioLost = pstats.lostpre;
        }
      }, (e) => {
        console.error('get video stats ', stream.sid);
      });
      client.getVideoStats(stream.sid, (pstats: VideoStats) => {
        // if (this.isComponentDestroyed) return;
        const { stats } = this;
        stats.videoLost = pstats.lostpre;
        if (stats.biggestVideoLost < pstats.lostpre) {
          stats.biggestVideoLost = pstats.lostpre;
        }
      }, (e) => {
        console.error('get video stats ', stream.sid);
      });
      client.getNetworkStats(stream.sid, (pstats: NetworkStats) => {
        // if (this.isComponentDestroyed) return;
        const { stats } = this;
        stats.rtt = pstats.rtt;
        if (stats.biggestRTT < pstats.rtt) {
          stats.biggestRTT = pstats.rtt;
        }
      }, (e) => {
        console.error('get network stats ', stream.sid);
      });
    }, 1000);
  }
  stopGetState() {
    window.clearInterval(this.stateTimer);
  }
}
