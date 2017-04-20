import page from 'page'
import { Action, Mode } from './actions'


export default function configureRouter(store) {
    const modeSetter = (mode) => (ctx, next) => {
        store.dispatch(Action.setMode(mode))
        ctx.state.ifModeSet = true
        next(ctx, next)
    }
    // FIXME: bad idea
    page.base(window.location.pathname)
    page('/login', (ctx, next) => {
        modeSetter(Mode.LOGIN)(ctx, next)
    })
    page('/registration', modeSetter(Mode.REGISTRATION, false))
    page('/tm', modeSetter(Mode.TASKMAN))
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

    page.start({
        click: true,
        popstate: true,
        dispatch: true,
        hashbang: true,
        decodeURLComponents: true
    })
}
