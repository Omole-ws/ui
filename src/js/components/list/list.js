import '../../../../semantic/dist/components/item.css'
import '../../../../semantic/dist/components/button.css'
import '../../../../semantic/dist/components/icon.css'
import '../../../../semantic/dist/components/label.css'
import '../../../../semantic/dist/components/dimmer.css'
import '../../../../semantic/dist/components/dimmer'

import React from 'react'
import ReactTransitionGroup from 'react-addons-transition-group'
import { connect } from 'react-redux'

import { Action, Mode } from '../../actions'
import Nav from '../nav/nav'
import ListItem from './list-item'
// import ListItem from '!jade-react!./list-item.jade'
// import List from '!jade-react!./list.jade'
import Edit from './edit'

class ListView extends React.Component {

    constructor(props) {
        super(props)
        this.editGraph      = graph => this._editGraph(graph)
        this.removeGraph    = graph => this._removeGraph(graph)
        this.duplicateGraph = graph => this._duplicateGraph(graph)
        this.list = new Map()
        this.setListRef     = (id, ref) => this._setListRef(id, ref)
    }


    static propTypes = {
        list:           React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        isFetching:     React.PropTypes.bool.isRequired,
        changeCSRF:     React.PropTypes.func.isRequired,
        fetchGraphList: React.PropTypes.func.isRequired,
        postNewGraph:   React.PropTypes.func.isRequired,
        removeGraph:    React.PropTypes.func.isRequired
    }

    componentWillMount() {
        if (!this.props.isFetching) {
            this.props.fetchGraphList()
        }
    }

    _editGraph(graph) {
        this.editComponent.activate(graph)
    }

    _removeGraph(graph) {
        this.props.removeGraph(graph)
    }

    _duplicateGraph(graph) {
        console.log(`Duplicate graph '${graph.info.label}'`)
    }

    _setListRef(id, ref) {
        this.list.set(id, ref)
    }


    render() {
        return(
            <div>
                <Nav mode={Mode.LIST}>
                    <div className="link item" onClick={() => this.editGraph(null)}>
                        <i className="circle add icon"></i>
                        New
                    </div>
                </Nav>
                <Edit ref={(r) => this.editComponent = r} save={this.props.postNewGraph}/>
                <ReactTransitionGroup component="div" className="ui divided items">
                    {
                        this.props.list.map(g => {
                            return <ListItem key={g.id} setRef={this.setListRef} graph={g}
                                edit={this.editGraph}
                                remove={this.removeGraph}
                                duplicate={this.duplicateGraph}/>
                        })
                    }
                </ReactTransitionGroup>
            </div>
        )
    }
}
// ListView.defaultProps = {list:[], isFetching: false}



const mapStoreToProps = store => {
    return {
        list: store.graphs.list,
        isFetching: store.graphs.isFetching
    }
}

const mapDispatchToProps = {
    changeCSRF: Action.changeCSRF,
    fetchGraphList: Action.fetchGraphsList,
    postNewGraph: Action.postNewGraph,
    removeGraph: Action.removeGraph
}

export default connect(mapStoreToProps, mapDispatchToProps)(ListView)