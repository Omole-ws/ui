import '../../../../semantic/dist/components/header.css'
import '../../../../semantic/dist/components/dimmer.css'
import '../../../../semantic/dist/components/icon.css'

import React from 'react'

import Cy from './cy'

export default class Desk extends React.Component {

    constructor(props) {
        super(props)
        this.state = {dirty: true}
        this._cytoscape = null
        this._cy = null
    }

    static propTypes = {
        isFetching: React.PropTypes.bool.isRequired,
        graph: React.PropTypes.object.isRequired
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.isFetching !== this.props.isFetching) {
            return true
        }
        return false
    }

    componentDidMount() {
        if (!this.props.isFetching) {
            this._cy = new Cy(this._cytoscape)
            this._cy.load(this.props.graph)
        }
    }

    componentDidUpdate() {
        if (!this.props.isFetching) {
            if (this._cy) {
                this._cy.destroy()
                this._cy = null
            }
            this._cy = new Cy(this._cytoscape)
            this._cy.load(this.props.graph)
        }
    }

    componentWillUnmount() {
        this._cy.destroy()
        this._cy = null
    }

    render() {
        return (
            <div id="cytoscape" ref={c => this._cytoscape = c}>
                {this.props.children}
            </div>
        )
    }
}