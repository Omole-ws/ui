import '../../../../semantic/dist/components/button.css'
import '../../../../semantic/dist/components/label.css'
import '../../../../semantic/dist/components/dropdown'
import '../../../../semantic/dist/components/dropdown.css'
import '../../../../semantic/dist/components/form'
import '../../../../semantic/dist/components/form.css'
import '../../../../semantic/dist/components/grid.css'
import '../../../../semantic/dist/components/icon.css'
import '../../../../semantic/dist/components/input.css'
import '../../../../semantic/dist/components/modal'
import '../../../../semantic/dist/components/modal.css'
import '../../../../semantic/dist/components/transition'
import '../../../../semantic/dist/components/transition.css'

import React from 'react'
import { connect } from 'react-redux'

import { Action, EdgeType, EdgeTypeInverted } from '../../actions'

import EditEdgeTmpl from '!jade-react!./edit-edge.jade'

class EditEdge extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            type: EdgeType.READ
        }
        this.handleFieldChange = ev => this._handleFieldChange(ev)
        this.submit = ev => this._submit(ev)
    }

    static propTypes = {
        gid: React.PropTypes.string.isRequired,
        onScreen: React.PropTypes.bool.isRequired,
        edge: React.PropTypes.object,
        edgeDialogClose: React.PropTypes.func.isRequired,
        edgeUpdate: React.PropTypes.func.isRequired
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.edge !== this.props.edge && nextProps.edge) {
            const type = Object.keys(EdgeTypeInverted).filter(cl => nextProps.edge.hasClass(cl))[0]
            this.setState({
                label: nextProps.edge.data('label'),
                note: nextProps.edge.data('note'),
                type
            })
            $(this.ref).find('.ui.dropdown').dropdown('set selected', type)
        }
    }

    componentDidMount() {
        $(this.ref)
        .modal({
            blurring: true,
            transition: 'fly up',
            onHidden: this.props.edgeDialogClose
        })
        .find('.ui.dropdown')
        .dropdown({
            on: 'hover',
            onChange: value => this.setState({type: value})
        })
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.onScreen && this.props.onScreen) {
            $(this.ref)
            .modal('show')
        }
    }

    render() {
        return <EditEdgeTmpl setRef={r => this.ref = r}
            label={this.state.label} note={this.state.note} type={this.state.type} Types={Object.keys(EdgeTypeInverted)}
            handleFieldChange={this.handleFieldChange} submit={this.submit}/>
    }

    _handleFieldChange(ev) {
        this.setState({[ev.target.name]: ev.target.value})
    }

    _submit(ev) {
        const id = this.props.edge.id()
        if (this.state.label !== this.props.edge.data('label') ||
            this.state.note !== this.props.edge.data('note') ||
            !this.props.edge.hasClass(this.state.type)) {
            this.props.edgeUpdate(id, {
                id,
                cclabel: EdgeTypeInverted[this.state.type],
                info: {
                    label: this.state.label,
                    comment: this.state.note
                }
            })
        }
        ev.preventDefault()
    }
}

function mapStoreToProps(store) {
    return {
        gid: store.currentGraph,
        onScreen: store.operating.edgeEditor.onScreen,
        edge: store.operating.edgeEditor.edge,
        position: store.operating.edgeEditor.position
    } 
}

const mapDispatchToProps = {
    edgeDialogClose: Action.edgeDialogClose,
    edgeUpdate: Action.edgeUpdate
}

export default connect(mapStoreToProps, mapDispatchToProps)(EditEdge)
