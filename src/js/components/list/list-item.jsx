/* global $ */

import '../../../../semantic/dist/components/button.css'
import '../../../../semantic/dist/components/icon.css'
import '../../../../semantic/dist/components/label.css'
import '../../../../semantic/dist/components/dimmer.css'
import '../../../../semantic/dist/components/dimmer'
import '../../../../semantic/dist/components/header.css'
import '../../../../semantic/dist/components/loader.css'
import '../../../../semantic/dist/components/transition.css'
import '../../../../semantic/dist/components/transition'

import React from 'react'
import _ from 'lodash'

import ListItemTmpl from '!jade-react!./list-item.jade'

export default class ListItem extends React.Component {

    constructor(props) {
        super(props)

        this.exportGraph = (g, e) => this._exportGraph(g, e)
    }
    componentWillEnter(fin) {
        $(this.ref).transition('fly right in', fin)
    }

    componentWillLeave(fin) {
        $(this.ref).transition('fly left out', fin)
    }

    static propTypes = {
        graph: React.PropTypes.object.isRequired,
        edit: React.PropTypes.func.isRequired,
        remove: React.PropTypes.func.isRequired,
        duplicate: React.PropTypes.func.isRequired,
        fetchGraph: React.PropTypes.func.isRequired
    }

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(nextProps.graph, this.props.graph)
    }

    _exportGraph(graph) {
        this.props.fetchGraph(graph)
    }
    render() {
        return <ListItemTmpl graph={this.props.graph} setRef={r => this.ref = r}
            edit={this.props.edit} remove={this.props.remove}
            duplicate={this.props.duplicate} exportGraph={this.exportGraph}/>
    }
}
