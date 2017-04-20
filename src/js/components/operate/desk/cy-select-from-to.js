import { store } from '../../../../index'
import { Action, DeskMode } from '../../../actions'

export default class CySelectFromTo {
    constructor(cy) {
        cy.nodes().unselect()

        this.cy = cy
        this.selected = 0
        this.select = ev => this._select(ev)
        this.unselect = ev => this._unselect(ev)

        cy.on('select', 'node', this.select)
        cy.on('unselect', 'node', this.unselect)
    }

    destroy() {
        this.cy.off('select', 'node', this.select)
        this.cy.off('unselect', 'node', this.unselect)
        this.cy.nodes().selectify()
        this.from && this.from.removeClass('from').unselect()
        this.to && this.to.removeClass('to').unselect()
    }

    shouldPersist(mode) {
        return mode === DeskMode.SELECT_FROM_TO

    }

    fromAction(action) {
        store.dispatch(Action.selectFrom(action))
    }

    toAction(action) {
        store.dispatch(Action.selectTo(action))
    }

    _select(ev) {
        const [id, name] = [ev.target.id(), ev.target.data('label')]
        const point = !this.from ? 'from' : 'to'
        switch (this.selected) {
            case 0:
                this.selected += 1
                this.from = this.cy.nodes(`#${id}`)
                this.from.addClass('from')
                store.dispatch(Action.selectFrom({ id, name }))
                break

            case 1:
                this.selected += 1
                this[point] = this.cy.nodes(`#${id}`)
                this[point].addClass(point)
                this[`${point}Action`]({ id, name })

                this.cy.nodes().unselectify()
                this.from.union(this.to).selectify()
                break
        }
    }

    _unselect(ev) {
        const [id, name] = [ev.target.id(), ev.target.data('label')]
        const point = this.from && id === this.from.id() ? 'from' : 'to'
        switch (this.selected) {
            case 1:
                this.selected -= 1
                this[point].removeClass(point)
                this[point] = null
                this[`${point}Action`]({})
                break

            case 2:
                this.selected -= 1
                this[point].removeClass(point)
                this[point] = null
                this[`${point}Action`]({})

                this.cy.nodes().selectify()
                break
        }
    }
}
