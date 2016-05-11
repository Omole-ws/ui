// import _ from 'lodash'

// import { uuid } from '../../helpers'
import { DeskMode } from '../../actions'

// function et() {
//     return et.edgeType
// }

export default class CyMenus {
    constructor(cyObj) {
        // super()
        // et.edgeType = 'read'
        this.cy = cyObj.cy
        this.core = null

        this.type = 'read'
        // const this.cy = cyObj.this.cy
        this.menus = {
            core: {
                defaults: {
                    selector: 'core'
                },
                [DeskMode.BASIC]: {
                    commands: [
                        {
                            fillColor: 'rgba(0, 50, 0, 0.75)',
                            // content: '<i class="ui circle add icon"></i>',
                            content: '<i class="big icons"><i class="thin circle icon"></i><i class="corner add icon"></i></i>',
                            select: () => {
                                cyObj.setDeskMode(DeskMode.NODE_CREATE)
                                this.cy.on('tap', ev => {
                                    if (ev.cyTarget === this.cy) {
                                        cyObj.nodeDialog(null, ev.cyPosition)
                                    }
                                })
                            }
                        },
                        {
                            // fillColor: 'rgba(0, 50, 0, 0.75)',
                            // content: '<i class="ui circle add icon"></i>',
                            content: '<i class="big clockwise rotated fork icon"</i>',
                            select: () => {
                                cyObj.setDeskMode(DeskMode.CONNECT)
                                this.cy.edgehandles('enable')
                                // this.cy.edgehandles('option', 'edgeParams', () => ({classes: this.type}))
                            }
                        }
                    ]
                },
                [DeskMode.NODE_CREATE]: {
                    commands: [
                        {
                            content: 'Done',
                            fillColor: 'red',
                            select: () => {
                                cyObj.setDeskMode(DeskMode.BASIC)
                                this.cy.off('tap')
                            }
                        }
                    ]
                },
                [DeskMode.CONNECT]: {
                    commands: [
                        {
                            content: 'RO',
                            fillColor: '#726707',
                            select: () => {
                                this.type = 'r-only'
                            }
                        },
                        {
                            content: 'WO',
                            fillColor: '#ef6718',
                            select: () => {
                                this.type = 'w-only'
                            }
                        },
                        {
                            content: 'G',
                            fillColor: '#bc00ff',
                            select: () => {
                                this.type = 'grant'
                            }
                        },
                        {
                            content: 'Done',
                            fillColor: 'red',
                            select: () => {
                                cyObj.setDeskMode(DeskMode.BASIC)
                                this.cy.edgehandles('disable')
                            }
                        },
                        {
                            content: 'T',
                            fillColor: '#2979ff',
                            select: () => {
                                this.type = 'take'
                            }
                        },
                        {
                            content: 'W',
                            fillColor: '#ff7728',
                            select: () => {
                                this.type = 'write'
                            }
                        },
                        {
                            content: 'R',
                            fillColor: '#827717',
                            select: () => {
                                this.type = 'read'
                            }
                        }
                    ]
                }
            }
        }
    }

    setup(mode) {
        this.destroy()
        this.core = this.cy.cxtmenu({
            ...CyMenus.cxtMenuDefaults,
            ...this.menus.core.defaults,
            ...this.menus.core[mode]
        })
    }

    destroy() {
        this.core && this.core.destroy()
        this.core = null
    }


// ++++++++++++++++++++++++++++++++
// ++++++++++ STATICS +++++++++++++
// ++++++++++++++++++++++++++++++++

    static cxtMenuDefaults = {
        menuRadius: 80, // the radius of the circular menu in pixels
        selector: '', // elements matching this Cytoscape.js selector will trigger cxtmenus
        // commands: [ // an array of commands to list in the menu or a function that returns the array
        /*
        { // example command
          fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
          content: 'a command name' // html/text content to be displayed in the menu
          select: function(ele){ // a function to execute when the command is selected
            console.log( ele.id() ) // `ele` holds the reference to the active element
          }
        }
        */
        // ], // function( ele ){ return [ /*...*/ ] }, // example function for commands
        fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
        activeFillColor: 'rgba(92, 194, 237, 0.75)', // the colour used to indicate the selected command
        activePadding: 5, // additional size in pixels for the active command
        indicatorSize: 0, // the size in pixels of the pointer to the active command
        separatorWidth: 0, // the empty spacing in pixels between successive commands
        spotlightPadding: 5, // extra spacing in pixels between the element and the spotlight
        minSpotlightRadius: 15, // the minimum radius in pixels of the spotlight
        maxSpotlightRadius: 30, // the maximum radius in pixels of the spotlight
        openMenuEvents: 'cxttapstart', // cytoscape events that will open the menu (space separated)
        itemColor: 'white', // the colour of text in the command's content
        itemTextShadowColor: null, // the text shadow colour of the command's content
        zIndex: 9999 // the z-index of the ui div
    }
}
