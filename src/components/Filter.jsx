import { For, Show, createEffect, onMount } from 'solid-js'
import style from './Filter.module.css'
import iconUp from '../assets/up.png'
import iconDown from '../assets/down.png'

export default function Filter (props) {
    setTimeout(() => {
        const searchbox = document.getElementById('searchbox')
        searchbox.focus()
    }, 100)

    // TODO: traits
    createEffect(() => {
        console.log(props.list)
        const traits = {}
        props.list.forEach(m => {
            m.traits.forEach(t => {
                if (!traits[t.name]) traits[t.name] = t.description
            })
        })
        console.log(traits)
    })
    
    // calculate and apply filters when they change
    createEffect(() => {
        let tempList = [...props.list]
        
        if (props?.list && Array.isArray(props?.list)) {
            tempList = tempList.filter(item => item.name.toLowerCase().includes(props.filters().search.toLowerCase()))
        }
        
        props.filters().numbers.forEach(elem => {
            if (elem.operator === '>=') tempList = tempList.filter(item => item[elem.key] >= elem.value)
            if (elem.operator === '<=') tempList = tempList.filter(item => item[elem.key] <= elem.value)
        });
        const activeSort = props.filters().sort.filter(elem => elem.active)[0]
        console.log(activeSort)
        if (activeSort.desc) tempList = tempList.sort((a,b) => a[activeSort.key] > b[activeSort.key])
        else tempList = tempList.sort((a,b) => a[activeSort.key] < b[activeSort.key])

        props.filteredlist([...tempList])
    })

    const handleSort = (e, item) => {
        let updatedSorts = []
        
        if ( !item.active ) {
            props.filters().sort.forEach(elem => {
                let tempElem = {...elem}
                if (tempElem.key === item.key) tempElem.active = true
                else tempElem.active = false
                updatedSorts.push(tempElem)
            })
        } else updatedSorts = [...props.filters().sort]
        
        let tempSorts = []
        if ( item.active ) {
            updatedSorts.forEach(elem => {
                const tempElem = {...elem}
                if (elem.key === item.key) tempElem.desc = !tempElem.desc
                tempSorts.push(tempElem)
            })
            updatedSorts = [...tempSorts]
        }
        console.log(updatedSorts)

        props.setFilters(
            {
                ...props.filters(), 
                sort: updatedSorts
            }
        )
    }

    return (
        <details class={style.wrapper} open>
            <summary>Filters</summary>
            <div class={style.controls}>
                {/* search input */}
                <Show when={props.search === true}>
                    <input 
                        class={style.searchbox}
                        type="text" 
                        name="" 
                        id="searchbox" 
                        placeholder='Search'
                        value={props.filters().search}
                        onInput={e => props.setFilters({...props.filters(), search: e.target.value})} />
                </Show>

                {/* sort toggles */}
                <div class={style.sorttoggles}>
                    <For each={props.filters().sort.sort((a,b) => a.key > b.key)}>
                        {sort =>
                            <div class={sort.active ? style.sortChipActive : style.sortChip} onClick={e => handleSort(e, sort)}>
                                <div
                                    class={style.link}
                                    >
                                        {sort.key}
                                </div>
                                <Show when={sort.active}>
                                    <img src={sort.desc ? iconDown : iconUp} class={style.sortIcon}></img>
                                </Show>
                            </div>
                        }
                    </For>
                </div>

                {/* number based filters e.g. min/max level, hp, ac etc */}
                <div class={style.numbers}>
                    <For each={props.filters().numbers.sort((a,b) => a.order > b.order)}>
                        {elem => 
                            <form class={style.numberWrapper}>
                                <label htmlFor={elem.label}>{elem.label}</label>
                                <input
                                    required
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
                            </form>
                        }
                    </For>
                </div>
            </div>
        </details>
    )
}