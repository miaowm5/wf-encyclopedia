
import RouteParser from 'route-parser'
import apiFactory from 'm5api/svelte'
import { onMount } from "svelte"

const m5api = apiFactory({
  auth: undefined,
  api: '',
  route: RouteParser,
  svelte: { onMount },
})
const api = m5api.api
const EventEmitter = m5api.EventEmitter
const Route = m5api.Route

export {
  api, EventEmitter, Route,
}
