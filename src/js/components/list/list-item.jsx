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
import cs from 'classnames'
import _ from 'lodash'

import { DataURL } from '../../actions'

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
        getGraph: React.PropTypes.func.isRequired
    }

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(nextProps.graph, this.props.graph)
    }

    _exportGraph(graph) {
        this.props.getGraph(graph)
    }
    render() {
        const g = this.props.graph
        const operateURL = `#!/${g.id}/operate`
        const exportURL = `${DataURL}/${g.id}/export`
        const timeStamp = new Date(Number.parseInt(g.tstamp)).toString()
        return (
            <div className={cs({item: true, bluring: true, dimmable: true, dimmed: g.isFetching || g.isSyncing})} ref={r => this.ref = r}>
                <i className="ui large orange sitemap icon"/>
                <div className="content">
                    <a className="header" href={operateURL}> {g.label} </a>
                    <div className="meta"><div className="ui small basic label"> {timeStamp} </div></div>
                    {
                        g.comment &&
                        <div className="description" dangerouslySetInnerHTML={{ __html: g.comment.replace(/\n/g, '<br>') }}/>
                    }
                    <div className="extra">
                        <div className="ui compact small basic button" onClick={() => this.props.edit(g)}>
                            <i className="edit icon"/> Edit
                        </div>
                        <div className="ui compact small basic button" onClick={() => this.props.duplicate(g)}>
                            <i className="copy icon"/> Duplicate
                        </div>
                        <a className="ui compact small basic button" href={exportURL} download={`${g.label}.json`}>
                            <i className="cloud download icon"/> Export
                        </a>
                        <div className="ui compact small basic button" onClick={() => this.props.remove(g)}>
                            <i className="recycle icon"/> Remove
                        </div>
                    </div>
                </div>
                <div className="ui simple inverted dimmer"><div className="ui loader"></div></div>
            </div>
        )
    }
}
