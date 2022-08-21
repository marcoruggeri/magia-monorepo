import { AppAPI } from '../api'
import { AppStore } from '../stores/app'
import { AnalyticsController } from './analytics'
import { ContractController } from './contract'
import { EventController } from './event'
import { HUDController } from './hud'
import { MagicController } from './magic'
import { MapController } from './map'
import { UserController } from './user'

export class AppController {
  map: MapController
  user: UserController
  event: EventController
  hud: HUDController
  contract: ContractController
  analytics: AnalyticsController
  magic: MagicController

  constructor(store: AppStore, api: AppAPI) {
    this.map = new MapController(this, store, api)
    this.user = new UserController(this, store, api)
    this.event = new EventController(this, store, api)
    this.hud = new HUDController(this, store, api)
    this.contract = new ContractController(this, store, api)
    this.analytics = new AnalyticsController(this, store, api)
    this.magic = new MagicController(this, store, api)
  }
}
