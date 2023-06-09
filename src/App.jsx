import { createEffect, createSignal, onMount } from 'solid-js';
import styles from './App.module.css';
import monsterFile from './data/monster-file.json'
import Filter from './components/Filter';
import Paginator from './components/Paginator';

function App() {
  const [ monsters, setMonsters ] = createSignal([])
  const [ filteredMonsters, setFilteredMonsters ] = createSignal([])

  createEffect(() => {
    setMonsters(monsterFile.sort((a,b) => a.name > b.name))
  })

  const filterOptions = {
    search: '',
    sort: [
      {
        key: 'name',
        active: true,
        desc: true
      },
      {
        key: 'level',
        active: false,
        desc: true
      }
    ],
    toggles: [],
    selects: [],
    numbers: [
      {
        label: 'Min Level',
        order: 1,
        key: 'level',
        max: 25,
        min: -1,
        value: -1,
        operator: '>='
      },
      {
        label: 'Max Level',
        order: 2,
        key: 'level',
        max: 25,
        min: -1,
        value: 25,
        operator: '<='
      }
    ]
  }
  const [ filters, setFilters ] = createSignal(filterOptions)

  const handleItemSelect = (item) => {
    // console.log(item)
    // console.log(`clicked ${item.name}`)
  }

  return (
    <div class={styles.App}>
      <Paginator title={"Paginator - I'll Be Back"} list={filteredMonsters()} pageSize={10} command={handleItemSelect}>
        <Filter search={true} filters={filters} setFilters={setFilters} list={monsters()} filteredlist={setFilteredMonsters} />
      </Paginator>
    </div>
  );
}

export default App;
