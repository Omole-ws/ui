/* global $ */
import '../../../../semantic/dist/components/card.css'
import '../../../../semantic/dist/components/checkbox.css'
import '../../../../semantic/dist/components/checkbox.js'

import React from 'react'
import { connect } from 'react-redux'

import { Action, AlgoInputType } from '../../actions'
import PrepareTaskTmpl from '!pug-loader!./prepare-task.jade'

class PrepareTask extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: 'READ',
            quater: 1
        }
        this.snapTo = q => this._snapTo(q)
        this.handleFieldChange = e => this._handleFieldChange(e)
        this.launch = () => this._launch()
    }
    static propTypes = {
        onScreen: React.PropTypes.bool.isRequired,
        algo: React.PropTypes.shape({
            name: React.PropTypes.string,
            url: React.PropTypes.string,
            help: React.PropTypes.string,
            inputParam: React.PropTypes.string,
            outputParam: React.PropTypes.string
        }).isRequired,
        gid: React.PropTypes.string.isRequired,
        from: React.PropTypes.shape({
            id: React.PropTypes.string,
            name: React.PropTypes.string
        }),
        to: React.PropTypes.shape({
            id: React.PropTypes.string,
            name: React.PropTypes.string
        }),
        createTask: React.PropTypes.func.isRequired,
        cancel: React.PropTypes.func.isRequired
    }

    componentDidMount() {
        $(this.ref)
            .find('.ui.radio.checkbox')
            .checkbox()
    }

    render() {
        if (!this.props.onScreen) {
            return null
        }
        return <PrepareTaskTmpl setRef = { r => this.ref = r }
            snapTo = { this.snapTo }
            handleFieldChange = { this.handleFieldChange }
            launch = { this.launch }
            cancel = { this.props.cancel }
            quater = { this.state.quater }
            label = { this.state.label }
            algo = { this.props.algo }
            fromName = { this.props.from.name }
            toName = { this.props.to.name }
            ftType = { AlgoInputType.GLFT } />
    }

    _snapTo(quater) {
        this.setState({ quater })
    }

    _handleFieldChange(ev) {
        this.setState({
            [ev.target.name]: ev.target.value
        })
    }

    _launch() {
        let params = { gid: this.props.gid, cclabel: this.state.label }
        if (this.props.algo.inputParam === AlgoInputType.GLFT) {
            params = { ...params, from: this.props.from.id, to: this.props.to.id }
        }
        this.props.createTask({ algo: this.props.algo, params })
    }
}

//  +-+-+-+-+-+-+-+
//  |c|o|n|n|e|c|t|
//  +-+-+-+-+-+-+-+

function mapStateToProps(state) {
    return {
        onScreen: state.pendingAlgo.onScreen,
        algo: state.pendingAlgo.algo,
        gid: state.currentGraph,
        from: state.pendingAlgo.from,
        to: state.pendingAlgo.to
    }
}

const mapDispatchToProps = {
    createTask: Action.createTask,
    cancel: Action.cancelTaskPrepare
}

export default connect(mapStateToProps, mapDispatchToProps)(PrepareTask)
