import page from 'page'
import { Action, Mode } from './actions'


export default function configureRouter(store) {
    // const modeSetter = function (mode, sessionRequired = true, extra) {
    //     return function (ctx, next) {
    //         if (!!ctx.state.session === sessionRequired) {
    //             store.dispatch(Action.setMode(mode))
    //             ctx.state.ifModeSet = true
    //             extra && extra(ctx, next)
    //             next(ctx, next)
    //         } else {
    //             page.redirect(sessionRequired ? '/login' : ctx.state.prev_path)
    //         }
    //     }
    // }
    const modeSetter = (mode) => (ctx, next) => {
        store.dispatch(Action.setMode(mode))
        ctx.state.ifModeSet = true
        next(ctx, next)
    }
    // FIXME: bad idea
    page.base(window.location.pathname)
    // page('*', function (ctx, next) {
    //     let state = store.getState()
    //     ctx.state.session = state.session.account !== null
    //     ctx.state.prev_path = state.router.path
    //     next(ctx, next)
    // })
    // page('/login', modeSetter(Mode.LOGIN, false))
    page('/login', (ctx, next) => {
        modeSetter(Mode.LOGIN)(ctx, next)
    })
    page('/registration', modeSetter(Mode.REGISTRATION, false))
    page('/', modeSetter(Mode.LIST))
    page('/:gid/operate', (ctx, next) => {
        store.dispatch(Action.setCurrentGraph(ctx.params.gid))
        modeSetter(Mode.OPERATE)(ctx, next)
    })
    page('/:gid/reports', (ctx, next) => {
        store.dispatch(Action.setCurrentGraph(ctx.params.gid))
        modeSetter(Mode.REPORTS)(ctx, next)
    })
    page('*', ctx => {
        if(!ctx.state.ifModeSet) {
            page.redirect('/')
        } else {
            store.dispatch(Action.routeChanged(ctx.path))
        }
        // next(ctx, next)
    })
    // page('*', function () { page.redirect('/') })

    page.start({
        click: true,
        popstate: true,
        dispatch: true,
        hashbang: true,
        decodeURLComponents: true
    })
}
