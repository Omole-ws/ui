import '../../../../../semantic/dist/components/header.css'
import '../../../../../semantic/dist/components/dimmer.css'
import '../../../../../semantic/dist/components/loader.css'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash/fp'

import { Action, DeskMode } from '../../../actions'
import Cy from './cy'

class Desk extends React.Component {

    constructor(props) {
        super(props)

        this.state = {isDataReady: false, cy: null}
        this.isEmpty = true
        this.cytoscapeElement = null
    }

    static propTypes = {
        gid: PropTypes.string.isRequired,
        graph: PropTypes.object,
        visualAttributes: PropTypes.object,
        tape: PropTypes.array,
        groups: PropTypes.object,
        paths: PropTypes.shape({
            list: PropTypes.arrayOf(PropTypes.object),
            idx: PropTypes.number
        }),
        deskMode: PropTypes.string.isRequired,
        getGraph: PropTypes.func.isRequired,
        fetchGVA: PropTypes.func.isRequired
    }

    loadGraphData = (graph, visualAttributes) => {
        if (!visualAttributes || !visualAttributes.isFetching) {
            this.props.fetchGVA(graph ? graph : {id: this.props.gid})
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tape !== this.props.tape) {
            const news = _.difference(nextProps.tape)(this.props.tape)
            if (news.length > 0) {
                this.state.cy.applyChanges(news)
            }
        }

        if (nextProps.groups !== this.props.groups) {
            this.props.groups && this.state.cy.hideGroups(this.props.groups.mappings)
            nextProps.groups && this.state.cy.showGroups(nextProps.groups.mappings, nextProps.groups.idx)
        }

        if (nextProps.paths.list !== this.props.paths.list) {
            this.props.paths.list && this.state.cy.hidePaths(this.props.paths.list)
            this.props.paths.list && this.state.cy.dimPath(this.props.paths.list[this.props.paths.idx])
            nextProps.paths.list && this.state.cy.showPaths(nextProps.paths.list)
            nextProps.paths.list && this.state.cy.highlightPath(nextProps.paths.list[nextProps.paths.idx])
        } else if (nextProps.paths.idx !== this.props.paths.idx) {
            this.state.cy.dimPath(this.props.paths.list[this.props.paths.idx])
            this.state.cy.highlightPath(nextProps.paths.list[nextProps.paths.idx])
        }

        this.setState({isDataReady:
            _.flow(_.at(['graph.isFetching', 'visualAttributes.isFetching']), _.all(e => e === false))(nextProps)})
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isDataReady !== this.state.isDataReady ||
            nextState.cy !== this.state.cy ||
            nextProps.deskMode !== this.props.deskMode ||
            nextProps.tape !== this.props.tape

    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.isDataReady && nextState.cy && this.isEmpty) {
            nextState.cy.populate(nextProps.graph, nextProps.visualAttributes, nextProps.tape)
            this.isEmpty =false
        }
        if (nextProps.deskMode !== this.props.deskMode) {
            nextState.cy.setMode(nextProps.deskMode)
        }
    }

    componentDidMount() {
        this.loadGraphData(this.props.graph, this.props.visualAttributes)
        Cy.create(this.cytoscapeElement, cy => {
            cy.setMode(this.props.deskMode)
            this.setState({cy})
        })
    }

    componentWillUnmount() {
        this.state.cy && this.state.cy.destroy()
        this.setState({isDataReady: false, cy: null})
        this.isEmpty = true
    }

    render() {
        return (
            <div ref={c => this.cytoscapeElement = c}
                className={`ui blurring dimmable ${this.state.isDataReady && this.state.cy ? '' : 'dimmed'} cytoscape`}
                style={{cursor: this.props.deskMode === DeskMode.NODE_CREATE ? 'crosshair' : 'auto'}}>
                <h1 className={`ui disabled center alligned ${this.props.tape && this.props.tape.length > 0 ? 'red' : 'green'} header`}>
                    { this.props.graph && this.props.graph.label }
                </h1>
                <div className="ui simple inverted dimmer">
                    <div className="ui large text loader">
                        Loading data  ...
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        visualAttributes: state.graphsExtra.visualAttributes[ownProps.gid],
        tape: state.tapes[ownProps.gid],
        groups: state.operating.groups,
        paths: state.operating.paths || {},
        deskMode: state.operating.deskMode
    }
}

const mapDispatchToProps = {
    getGraph: Action.getGraph,
    fetchGVA: Action.fetchGVA
}

export default connect(mapStateToProps, mapDispatchToProps)(Desk)
