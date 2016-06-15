import React from 'react'
import { connect } from 'react-redux'

import { Action } from '../../actions'
import Nav from '../nav/nav'

class Reports extends React.Component {
    render() {
        return (
            <div>
                <Nav>
                    <a className="item" href="#!/"> List </a>
                </Nav>
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
        reports: state
    }
}

const mapDispatchToProps = {
    // getReports: Action.getReports
}

export default connect(mapStateToProps)(Reports)
// export default connect(mapStateToProps, mapDispatchToProps)(Reports)
