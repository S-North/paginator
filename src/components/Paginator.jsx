import { For, Show, createEffect, createSignal } from "solid-js"
import style from './Paginator.module.css'


export default function Paginator (props) {

    // keep track of how many pages there should be
    const [ pages, setPages ] = createSignal([])
    createEffect(() => {
        setPages([...Array(Math.ceil(props.list.length / props.pageSize)).keys()])
    })

    const [ currentPage, setCurrentPage ] = createSignal(0)
    const [ cursor, setCursor ] = createSignal(0) // keeps track of the first item of the current page

    const [ slice, setSlice ] = createSignal([])
    createEffect(() => {
        setSlice(props.list.slice(cursor(), cursor() + props.pageSize))
    })

    const handlePageChange = (evt, targetPage) => {
        evt.preventDefault()
        const page = parseInt(targetPage)
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
            <h2 class={style.title}>{props.title}</h2>

            {/* Add additional controls above the list e.g. a filter control */}
            {props.children} 
            
            {/* page controls */}
            <div class={style.controls}>
                <button 
                    class={style.btn} 
                    disabled={currentPage() === 0} 
                    onClick={() => {setCurrentPage(0); setCursor(props.pageSize * (currentPage()))}}>
                        {`<<`}
                </button>
                <button 
                    class={style.btn} 
                    disabled={currentPage() === 0} 
                    onClick={evt => handleIncrements(evt, 'down')}>
                        {`<`}
                </button>

                <select 
                    class={style.select} 
                    value={currentPage()} 
                    onChange={e => handlePageChange(e, e.target.value)}>
                    <For each={pages()}>
                        {page => 
                            <option 
                                class={style.select} 
                                value={page}>
                                    {`${page + 1} of ${pages().length}`}
                            </option>}
                    </For>
                </select>

                <button 
                    class={style.btn} 
                    disabled={currentPage() === pages().length -1} 
                    onClick={evt => handleIncrements(evt, 'up')}>
                        {`>`}
                </button>
                <button 
                    class={style.btn} 
                    disabled={currentPage() === pages().length -1} 
                    onClick={() => {setCurrentPage(pages().length -1); setCursor(props.pageSize * (currentPage()))}}>
                        {`>>`}
                </button>
            </div>
            
            {/* The list of items */}
            <div class={style.list}>
                <For each={slice()}>
                    {item => 
                        <div 
                            class={style.item} 
                            onClick={() => props.command(item)}>
                            <p>{`${item.name} (${item.level})`}</p>
                        </div>
                    }
                </For>
            </div>
        </div>
    )
}