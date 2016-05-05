// import _ from 'lodash'

// import { uuid } from '../../helpers'
import { DeskMode } from '../../actions'


export default class CyMenus {
    constructor(cy, mode) {
        const menus = {
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
                                cy.setDeskMode(DeskMode.NODE_CREATE)
                                cy.cy.on('tap', (ev) => cy.nodeDialog(null, ev.cyPosition))
                            }
                        },
                        {
                            // fillColor: 'rgba(0, 50, 0, 0.75)',
                            // content: '<i class="ui circle add icon"></i>',
                            content: '<i class="big clockwise rotated fork icon"</i>',
                            select: () => {
                                cy.setDeskMode(DeskMode.CONNECT)
                            }
                        }
                    ]
                },
                [DeskMode.NODE_CREATE]: {
                    commands: [
                        {
                            content: 'Done',
                            fillColor: 'orange',
                            select: () => {
                                cy.setDeskMode(DeskMode.BASIC)
                                cy.cy.off('tap')
                            }
                        }
                    ]
                }
            }
        }

        this.core = cy.cy.cxtmenu({
            ...CyMenus.cxtMenuDefaults,
            ...menus.core.defaults,
            ...menus.core[mode]
        })
    }

    destroy() {
        this.core.destroy()
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
