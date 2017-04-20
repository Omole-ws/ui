import { DeskMode } from '../../../actions'


export default class CyMenus {
    constructor(cyObj) {
        this.cy = cyObj.cy
        this.core = null

        this.type = 'read'
        this.menus = {
            core: {
                defaults: {
                    selector: 'core'
                },
                [DeskMode.BASIC]: {
                    commands: [{
                        content: '<i class="big icons"><i class="thin circle icon"></i><i class="corner add icon"></i></i>',
                        select: () => {
                            cyObj.setDeskMode(DeskMode.NODE_CREATE)
                            this.cy.on('tap', ev => {
                                if (ev.target === this.cy) {
                                    cyObj.nodeDialog(null, ev.position)
                                }
                            })
                        }
                    }, {
                        content: '<i class="big clockwise rotated fork icon"</i>',
                        select: () => {
                            cyObj.setDeskMode(DeskMode.CONNECT)
                            this.cy.edgehandles('enable')
                        }
                    }]
                },
                [DeskMode.NODE_CREATE]: {
                    commands: [{
                        content: 'Done',
                        fillColor: 'rgba(255, 0, 0, 0.75)',
                        select: () => {
                            cyObj.setDeskMode(DeskMode.BASIC)
                            this.cy.off('tap')
                        }
                    }]
                },
                [DeskMode.CONNECT]: {
                    commands: [{
                        content: 'RO',
                        fillColor: 'rgba(114, 103, 7, 0.75)',
                        select: () => {
                            this.type = 'r-only'
                        }
                    }, {
                        content: 'WO',
                        fillColor: 'rgba(239, 103, 24, 0.75)',
                        select: () => {
                            this.type = 'w-only'
                        }
                    }, {
                        content: 'G',
                        fillColor: 'rgba(188, 0, 255, 0.75)',
                        select: () => {
                            this.type = 'grant'
                        }
                    }, {
                        content: 'Done',
                        fillColor: 'rgba(255, 0, 0, 0.75)',
                        select: () => {
                            cyObj.setDeskMode(DeskMode.BASIC)
                            this.cy.edgehandles('disable')
                        }
                    }, {
                        content: 'T',
                        fillColor: 'rgba(41, 121, 255, 0.75)',
                        select: () => {
                            this.type = 'take'
                        }
                    }, {
                        content: 'W',
                        fillColor: 'rgba(255, 119, 40, 0.75)',
                        select: () => {
                            this.type = 'write'
                        }
                    }, {
                        content: 'R',
                        fillColor: 'rgba(130, 119, 23, 0.75)',
                        select: () => {
                            this.type = 'read'
                        }
                    }]
                }
            },
            node: {
                defaults: {
                    selector: 'node',
                    commands: [{
                        content: '<i class="ui edit icon"></i>',
                        select: node => cyObj.nodeDialog(node)
                    }, {
                        content: '<i class="ui recycle icon"></i>',
                        fillColor: 'rgba(255, 0, 0, 0.75)',
                        select: node => {
                            node.connectedEdges()
                                .map(edge => cyObj.edgeDelete(edge))
                            cyObj.nodeDelete(node)
                        }
                    }]
                }
            },
            edge: {
                defaults: {
                    selector: 'edge',
                    commands: [{
                        content: '<i class="ui edit icon"></i>',
                        select: edge => cyObj.edgeDialog(edge)
                    }, {
                        content: '<i class="ui recycle icon"></i>',
                        fillColor: 'rgba(255, 0, 0, 0.75)',
                        select: edge => cyObj.edgeDelete(edge)
                    }]
                }
            }
        }
        this.node = this.cy.cxtmenu({
            ...CyMenus.cxtMenuDefaults,
            ...this.menus.node.defaults
        })
        this.edge = this.cy.cxtmenu({
            ...CyMenus.cxtMenuDefaults,
            ...this.menus.edge.defaults
        })
    }

    setup(mode) {
        this.destroy(true)
        this.core = this.cy.cxtmenu({
            ...CyMenus.cxtMenuDefaults,
            ...this.menus.core.defaults,
            ...this.menus.core[mode]
        })
    }

    destroy(partial) {
        this.core && this.core.destroy()
        this.core = null
        if (!partial) {
            this.node.destroy()
            this.edge.destroy()
        }
    }



    // ____ ___ ____ ___ _ ____ ____
    // [__   |  |__|  |  | |    [__
    // ___]  |  |  |  |  | |___ ___]
    //
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
