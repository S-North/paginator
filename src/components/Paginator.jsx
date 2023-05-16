import { For, Show, createEffect, createSignal } from "solid-js"
import style from './Paginator.module.css'

export default function Paginator (props) {
    // keep track of how many pages there should be
    const [ pages, setPages ] = createSignal([])
    createEffect(() => {
        setPages([...Array(Math.ceil(props.list.length / props.pageSize)).keys()])
    })

    const [ currentPage, setCurrentPage ] = createSignal(0)
    const [ cursor, setCursor ] = createSignal(0) // keeps track of the starting item of the current page

    const [ slice, setSlice ] = createSignal([])
    createEffect(() => {
        setSlice(props.list.slice(cursor(), cursor() + props.pageSize))
    })

    const handlePageChange = (evt, targetPage) => {
        evt.preventDefault()
        const page = parseInt(targetPage)
        console.log(page)
        setCurrentPage(page)
        setCursor(props.pageSize * (currentPage()))
    }

    const handleIncrements = (evt, direction) => {
        evt.preventDefault()
        if ( direction === 'down' && !currentPage() < 1) setCurrentPage(prev => prev - 1)
        if ( direction === 'up' ) setCurrentPage(prev => prev + 1)
        setCursor(props.pageSize * (currentPage()))
    }
    
    return (
        <div class={style.wrapper}>
            <h2 class={style.title}>Paginator</h2>
            <div class={style.list}>
                <For each={slice()}>
                    {item => 
                        <div class={style.item} onClick={() => props.command(item)}>{item.name}</div>
                    }
                </For>
            </div>
            <div class={style.controls}>
                <button class={style.btn} disabled={currentPage() === 0} onClick={() => {setCurrentPage(0); setCursor(props.pageSize * (currentPage()))}}>{`<<`}</button>
                <button class={style.btn} disabled={currentPage() === 0} onClick={evt => handleIncrements(evt, 'down')}>{`<`}</button>
                <select class={style.select} value={currentPage()} onChange={e => handlePageChange(e, e.target.value)}>
                    <For each={pages()}>
                        {page => <option class={style.select} value={page}>{`${page + 1} of ${pages().length}`}</option>}
                    </For>
                </select>
                {/* <For each={pages()}>
                    {page => <button class={currentPage() === page ? style.btnSelected : style.btn} onClick={evt => handlePageChange(evt, page)}>{page + 1}</button>}
                </For> */}
                <button class={style.btn} disabled={currentPage() === pages().length -1} onClick={evt => handleIncrements(evt, 'up')}>{`>`}</button>
                <button class={style.btn} disabled={currentPage() === pages().length -1} onClick={() => {setCurrentPage(pages().length -1); setCursor(props.pageSize * (currentPage()))}}>{`>>`}</button>
            </div>
        </div>
    )
}