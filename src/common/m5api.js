
import RouteParser from 'route-parser'
import apiFactory from 'm5api/svelte'

const m5api = apiFactory({
  auth: undefined,
  api: '',
  route: RouteParser,
})
const api = m5api.api
const EventEmitter = m5api.EventEmitter
const Route = m5api.Route

export {
  api, EventEmitter, Route,
}
