// @flow
/* eslint-disable no-undef */

import type { Subscription } from '../types'

export default class Subscriptions {
  subscriptions = []

  getSubscriptions = () => this.subscriptions

  subscribe = (subscription: Subscription) => {
    this.subscriptions = [...this.subscriptions, subscription]
  }

  unsubscribe = (subscription: Subscription) => {
    this.subscriptions = this.subscriptions.filter(subscriber => subscriber !== subscription)
  }
}
