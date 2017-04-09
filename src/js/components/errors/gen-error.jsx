/* global $ */

import '../../../../semantic/dist/components/modal.css'
import '../../../../semantic/dist/components/modal'

import React from 'react'
import { connect } from 'react-redux'

import { Action } from '../../actions'

class GenError extends React.Component {

    static propTypes = {
        error: React.PropTypes.object,
        dismiss: React.PropTypes.func.isRequired
    }

    // componentDidMount() {
    //     $(this.accordion).accordion()
    // }
    //
    // componentDidUpdate() {
    //     $(this.accordion).accordion()
    // }

    render() {
        return (
            <div className={ `ui ${this.props.error ? 'active' : '' } modal` }>
                <div className="header">Error</div>
                <div className="content">
                    <p>{ this.props.error }</p>
                </div>
                <div className="actions">
                    <div className="ui button" onClick={ () => this.props.dismiss() }>Close</div>
                </div>
            </div>
        )
    }
}

//                                                      888
//                                                      888
//                                                      888
//  .d8888b .d88b.  88888b.  88888b.   .d88b.   .d8888b 888888
// d88P"   d88""88b 888 "88b 888 "88b d8P  Y8b d88P"    888
// 888     888  888 888  888 888  888 88888888 888      888
// Y88b.   Y88..88P 888  888 888  888 Y8b.     Y88b.    Y88b.
//  "Y8888P "Y88P"  888  888 888  888  "Y8888   "Y8888P  "Y888
//
//
//

function mapStateToProps(state) {
    return {
        error: state.genError
    }
}

const mapDispatchToProps = {
    dismiss: Action.genErrorDrop
}

export default connect(mapStateToProps, mapDispatchToProps)(GenError)
