import { createEffect, createSignal, onMount } from 'solid-js';
import styles from './App.module.css';
import monsterFile from './data/monster-file.json'
import Paginator from './components/Paginator';

function App() {
  const [ monsters, setMonsters ] = createSignal([])
  const [ pageSize, setPageSize ] = createSignal(10)
  const [ monsterSlice, setMonsterSlice ] = createSignal(10)
  createEffect(() => {
    setMonsters(monsterFile.sort((a,b) => a.name > b.name).slice(0, monsterSlice()))
    console.log(monsterFile)
  })

  const handleItemSelect = (item) => {
    console.log(item)
    console.log(`clicked ${item.name}`)
  }

  return (
    <div class={styles.App}>
      <label htmlFor="pagesize">Page Size </label>
      <input type="number" name="" id="pagesize" value={pageSize()} onChange={e => setPageSize(e.target.value)} />
      <label htmlFor="monstersize">Monster Slice </label>
      <input type="number" name="" id="monstersize" value={monsterSlice()} onChange={e => setMonsterSlice(parseInt(e.target.value))} />

      <Paginator list={monsters()} pageSize={pageSize()} command={handleItemSelect}></Paginator>
    </div>
  );
}

export default App;
