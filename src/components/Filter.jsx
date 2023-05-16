import { For, Show, createEffect, createSignal, onMount } from 'solid-js'
import style from './Filter.module.css'

export default function Filter (props) {
    
    createEffect(() => {
        console.log(props.filters())
    })
    
    createEffect(() => {
        let tempList = [...props.list]
        
        if (props?.list && Array.isArray(props?.list)) {
            console.log('filter monsters')
            console.log(props.filters().search)
            tempList = tempList.filter(item => item.name.toLowerCase().includes(props.filters().search.toLowerCase()))
        }
        
        props.filters().numbers.forEach(elem => {
            if (elem.operator === '>=') tempList = tempList.filter(item => item[elem.key] >= elem.value)
            if (elem.operator === '<=') tempList = tempList.filter(item => item[elem.key] <= elem.value)
        });
        console.log(props.filters().numbers)

        props.filteredlist([...tempList])
    })

    return (
        <details class={style.wrapper}>
            <summary>Filters</summary>
            <div class={style.controls}>
                <Show when={props.search === true}>
                    <input 
                        class={style.searchbox}
                        type="text" 
                        name="" 
                        id="" 
                        placeholder='Search'
                        value={props.filters().search}
                        onInput={e => props.setFilters({...props.filters(), search: e.target.value})} />
                </Show>
                <div class={style.numbers}>
                    <For each={props.filters().numbers.sort((a,b) => a.order > b.order)}>
                        {elem => 
                            <div class={style.numberWrapper}>
                                <label htmlFor={elem.label}>{elem.label}</label>
                                <input
                                    style={{"max-width": "3rem"}}
                                    type="number" 
                                    name={elem.label} 
                                    id={elem.label} 
                                    value={elem.value} 
                                    min={elem.min} 
                                    max={elem.max} 
                                    onChange={e => {
                                        e.preventDefault();
                                        props.setFilters(
                                        {
                                            ...props.filters(), 
                                            numbers: [
                                                ...props.filters().numbers.filter(item => item.label !== elem.label),
                                                {...elem, value: parseInt(e.target.value)}
                                            ]
                                        })}
                                    } />
                            </div>
                        }
                    </For>
                </div>
            </div>
        </details>
    )
}