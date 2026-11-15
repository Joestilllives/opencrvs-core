/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * OpenCRVS is also distributed under the terms of the Civil Registration
 * & Healthcare Disclaimer located at http://opencrvs.org/license.
 *
 * Copyright (C) The OpenCRVS Authors located at https://github.com/opencrvs/opencrvs-core/blob/master/AUTHORS.
 */
import {
  EventState,
  getDeclarationFields,
  tennisClubMembershipEvent,
  ValidatorContext
} from '@opencrvs/commons/client'
import { hasDeclarationFieldChanged, hasFieldChanged } from './declarationDiff'

const eventConfiguration = tennisClubMembershipEvent
const fields = getDeclarationFields(tennisClubMembershipEvent)
const validatorContext: ValidatorContext = {}

const filledName = { firstname: 'Jane', surname: 'Doe' }

describe('hasFieldChanged', () => {
  const recommenderName = fields.find(({ id }) => id === 'recommender.name')
  if (!recommenderName) {
    throw new Error('tennisClubMembershipEvent has no recommender.name field')
  }

  const filledAndVisible: EventState = {
    'recommender.none': false,
    'recommender.name': filledName
  }

  it('detects a filled field that a change of a sibling field hides', () => {
    const nowHidden: EventState = {
      'recommender.none': true,
      // The client keeps the values of hidden fields in form state.
      'recommender.name': filledName
    }

    expect(
      hasFieldChanged(
        recommenderName,
        nowHidden,
        filledAndVisible,
        validatorContext
      )
    ).toBe(true)
    expect(
      hasDeclarationFieldChanged(
        recommenderName,
        nowHidden,
        filledAndVisible,
        eventConfiguration,
        validatorContext
      )
    ).toBe(true)
  })

  it('does not detect a change for an empty field that becomes hidden', () => {
    const emptyAndVisible: EventState = { 'recommender.none': false }
    const nowHidden: EventState = { 'recommender.none': true }

    expect(
      hasFieldChanged(
        recommenderName,
        nowHidden,
        emptyAndVisible,
        validatorContext
      )
    ).toBe(false)
  })

  it('does not detect a change for a field that stays hidden', () => {
    const hidden: EventState = {
      'recommender.none': true,
      'recommender.name': filledName
    }

    expect(
      hasFieldChanged(recommenderName, hidden, hidden, validatorContext)
    ).toBe(false)
  })

  it('detects a field that becomes visible and gets a value', () => {
    const hidden: EventState = { 'recommender.none': true }

    expect(
      hasFieldChanged(
        recommenderName,
        filledAndVisible,
        hidden,
        validatorContext
      )
    ).toBe(true)
  })

  it('does not detect a change for a visible field with the same value', () => {
    expect(
      hasFieldChanged(
        recommenderName,
        filledAndVisible,
        filledAndVisible,
        validatorContext
      )
    ).toBe(false)
  })
})
